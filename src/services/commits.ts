import axios, { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";
import { RequestHistories } from "../controllers/RequestHistories";
import { Users } from "../controllers/Users";
import { CannotGetFile } from "../errors/api/CannotGetFile";
import { CannotGetRepository } from "../errors/api/CannotGetRespository";
import { Github } from "./github";

class GithubCommits {
  static privateKey = process.env.GITHUB_PRIVATE_KEY.replace(/\|/gm, '\n');
  static appId = process.env.GITHUB_APP_ID;
  static clientId = process.env.GITHUB_CLIENT_ID;
  static appName = process.env.APP_NAME;

  constructor(private operation: string, private data: any) {};

  static async generateAppAccessToken(installationId: string) {
    const now = Math.floor(Date.now() / 1000) - 30;

    const expiration = now + 60 * 10;

    const payload = {
      iat: now,
      exp: expiration,
      iss: this.appId
    };

    const token = jwt.sign(payload, this.privateKey, { algorithm: "RS256" });
    
    return await Github.api.post<{ token: string }>(
      `app/installations/${installationId}/access_tokens`,
      payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.machine-man-preview+json"
      }
    }).then(res => {
      return res.data.token;
    }).catch((err) => {
      throw new Error("Can't access Github app token.");
    });
  };

  async getAppApi(userId: string) {
    const user = await Users.getById(userId);
    const token = await GithubCommits.generateAppAccessToken(user.installationId);
    
    const appApi = axios.create({
      baseURL: "https://api.github.com/",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    appApi.interceptors.response.use(res => res, async(err) => {
      console.log(err.response.headers["x-ratelimit-remaining"], err.message);
      if(err.response.headers["x-ratelimit-remaining"] === "0") {
        console.log("Not ratelimit remaining... ", this.operation, this.data);
        await RequestHistories.create(this.operation, this.data, user).then(() => {}).catch(e => console.log(e));
      };

      return Promise.reject(err);
    });

    return appApi;
  };

  async getCommitsRefs(
    repositoryFullname: string, 
    authUserId: string, 
    appApi?: AxiosInstance, 
    page = 1, 
    per_page = 30,
    lastRefs: any[] = []
  ) {
    if(!appApi) {
      appApi = await this.getAppApi(authUserId);
    };

    this.operation = "commitsRef";
    this.data = {
      repositoryFullname,
      authUserId,
      page,
      per_page,
      lastRefs
    };
      
    const refs = await appApi.get<GithubRepositoryCommitRef[]>(`repos/${repositoryFullname}/commits?per_page=${per_page}&page=${page}`)
    .then(res => {
      return res.data.map(c => {
        return {
          sha: c.sha,
          commit: {
            message: c.commit.message,
            tree: {
              sha: c.commit.tree.sha
            }
          }
        } as GithubRepositoryCommitRef;
      });
    }).catch(err => {
      throw new CannotGetRepository(repositoryFullname);
    });

    if(refs.length >= per_page) {
      const nextPage = page + 1;
      const nextPageRefs = await this.getCommitsRefs(repositoryFullname, authUserId, appApi, nextPage, per_page, refs);
      return [ ...refs, ...nextPageRefs ];
    };

    return refs;
  };

  async getRepositoryCommits(authUserId: string, repositoryFullname: string) {
    const appApi = await this.getAppApi(authUserId);

    const commitsRef: GithubRepositoryCommitRef[] = await this.getCommitsRefs(repositoryFullname, authUserId, appApi);

    this.operation = "commits";
    this.data = {
      repositoryFullname,
      authUserId,
      commitsRef
    };

    const commits = await Promise.all(commitsRef.map(async(c) => {
      const data: GithubRepositoryCommit = await appApi.get<GithubRepositoryCommit>(`repos/${repositoryFullname}/commits/${c.sha}`)
      .then(res => res.data).catch(err => false as any);

      if(!data) {
        return null;
      };

      const count = data.files.reduce((prev, cur) => {
        if(cur.status === "added" || cur.status === "copied") {
          prev.added++;
        } else if(cur.status === "changed" || cur.status === "modified" || cur.status === "renamed") {
          prev.modified++;
        } else if(cur.status === "removed") {
          prev.removed++;
        };

        return prev;
      }, {
        added: 0,
        modified: 0,
        removed: 0
      });

      return {
        userGithubId: data.committer?.id?.toString(),
        filesAdded: count.added,
        filesModified: count.modified,
        filesRemoved: count.removed,
        message: c.commit.message,
        sha: c.sha,
        totalAdditions: data.stats.additions,
        totalChanges: data.stats.total,
        totalDeletions: data.stats.deletions,
        tree: c.commit.tree.sha,
        url: data.html_url
      } as Partial<Commit>;
    }))

    return commits.filter(c => c);
  };

  async getFileData({ 
    path, 
    type, 
    url, 
    commitId,
    folderGroup,
    folderSha
  }: GithubTreesFile, authUserId: string, appApi?: AxiosInstance, repoFiles?: any, fileIndex?: number[]) {
    if(!appApi) {
      appApi = await this.getAppApi(authUserId);
    };

    if(type === "blob") {
      const data = await appApi.get(url).then(res => res.data).catch(err => false as any);

      return {
        blob: data?.content,
        encoding: data?.encoding,
        commitId,
        path,
        sha: data?.sha,
        folderGroup,
        folderSha,
        type,
        url
      } as Partial<Tree>;
    } else {
      const data = await appApi.get(url).then(res => res.data).catch(err => false as any);

      if(!data) {
        return url;
      };

      const files = [];
      
      for(let t in data.tree) {
        const result = data.tree[t];
        
        const file = await this.getFileData({ 
          path: result.path,
          type: result.type,
          commitId,
          folderGroup,
          folderSha: data.sha,
          url: result.url
        }, authUserId, appApi, repoFiles);

        return file;
      };

      return {
        path,
        type,
        sha: data.sha,
        folderGroup,
        folderSha,
        url,
        files
      } as Partial<Tree>;
    };
  };

  async getCommitsFiles(authUserId: string, repositoryFullname: string, commits: Partial<Commit>[]) {
    const appApi = await this.getAppApi(authUserId);

    const trees = [];
    
    for(let c in commits) {
      const commit = commits[c];

      this.operation = "commitFiles";
      this.data = {
        repositoryFullname,
        authUserId,
        commits: {
          all: commits,
          loaded: trees,
          index: c
        },
      };

      const data = await appApi.get(`repos/${repositoryFullname}/git/trees/${commit.tree}`)
      .then(res => res.data).catch(err => {
        if(err.response.headers["x-ratelimit-remaining"] === "0") {
          throw new CannotGetFile(repositoryFullname);
        };

        return false;
      });

      if(!data) {
        return null;
      };

      const files = [];
      
      for(let t in data.tree) {
        const result = data.tree[t];
        
        this.operation = "commitFilesData";
        this.data = {
          repositoryFullname,
          authUserId,
          commits: {
            all: commits,
            loaded: trees,
            index: c
          },
          files: {
            sha: data.sha,
            all: data.tree,
            loaded: files,
            index: t
          }
        };

        const file = await this.getFileData({ 
          path: result.path,
          type: result.type,
          commitId: commit.id,
          folderGroup: commit.tree,
          folderSha: data.sha,
          url: result.url
        }, authUserId, appApi, files);

        return file;
      };


      trees.push({
        group: commit.tree,
        sha: data.sha,
        commitId: commit.id,
        path: "/",
        url: data.url,
        type: "tree",
        files,
      } as Partial<Tree>);
    };
    
    return trees;
  };
};

export { GithubCommits };

