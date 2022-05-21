import axios, { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";
import { Users } from "../controllers/Users";
import { CannotGetFile } from "../errors/api/CannotGetFile";
import { CannotGetRepository } from "../errors/api/CannotGetRespository";
import { Github } from "./github";

class Directory {
  static privateKey = process.env.GITHUB_PRIVATE_KEY.replace(/\|/gm, '\n');
  static appId = process.env.GITHUB_APP_ID;
  static clientId = process.env.GITHUB_CLIENT_ID;
  static appName = process.env.APP_NAME;

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

  static async getAppApi(userId: string) {
    const user = await Users.getById(userId);
    const token = await this.generateAppAccessToken(user.installationId);
    
    const appApi = axios.create({
      baseURL: "https://api.github.com/",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    appApi.interceptors.response.use(res => {
      console.log("\nRemaining: " + res.headers["x-ratelimit-remaining"] + ":");
      return res;
    }, async(err) => {
      console.log("Error: " + err.response.headers["x-ratelimit-remaining"], err.message);
      if(err.response.headers["x-ratelimit-remaining"] === "0") {
        console.log("Not ratelimit remaining... ");
      };

      return Promise.reject(err);
    });

    return appApi;
  };

  static async getCommitsRefs(
    repositoryFullname: string, 
    authUserId: string, 
    appApi?: AxiosInstance, 
    page = 1, 
    per_page = 30
  ) {
    if(!appApi) {
      appApi = await this.getAppApi(authUserId);
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
      const nextPageRefs = await this.getCommitsRefs(repositoryFullname, authUserId, appApi, nextPage, per_page);
      return [ ...refs, ...nextPageRefs ];
    };

    return refs;
  };

  static async getRepositoryCommits(authUserId: string, repositoryFullname: string) {
    const appApi = await this.getAppApi(authUserId);

    const commitsRef: GithubRepositoryCommitRef[] = await this.getCommitsRefs(repositoryFullname, authUserId, appApi);

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

    return commits.filter(c => c !== null);
  };

  static async getFileData({ 
    path, 
    type, 
    url, 
    commitSha
  }: GithubTreesFile, authUserId: string, appApi?: AxiosInstance) {
    if(!appApi) {
      appApi = await this.getAppApi(authUserId);
    };

    if(type === "blob") {
      const data = await appApi.get(url).then(res => res.data).catch(err => false as any);
      console.log(path);

      return {
        blob: data?.content,
        encoding: data?.encoding,
        commitSha,
        path,
        sha: data?.sha,
        type,
        url
      } as Partial<Tree>;
    };

    return null;
  };

  static async getCommitsFiles(authUserId: string, repositoryFullname: string, commits: Partial<Commit>[]) {
    const appApi = await this.getAppApi(authUserId);

    const trees = await Promise.all(commits.map(async(commit) => {
      console.log("\n\n----\n" + commit.message + "\n----\n\n")
      const data = await appApi.get(`repos/${repositoryFullname}/git/trees/${commit.tree}?recursive=true`)
      .then(res => res.data).catch(err => {
        if(err.response.headers["x-ratelimit-remaining"] === "0") {
          throw new CannotGetFile(repositoryFullname);
        };

        return false;
      });

      return await Promise.all(data.tree.map(async(tree) => {
        return await this.getFileData({ 
          path: tree.path,
          type: tree.type,
          commitSha: commit.sha,
          url: tree.url
        }, authUserId, appApi);
      }) as Partial<Tree>[]);
    }));

    return trees.filter(t => t !== null).map(e => {
      return e.filter(f => f !== null);
    });
  };
};

export { Directory };

