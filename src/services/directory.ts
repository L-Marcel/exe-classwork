import { CodeAnalytic, CodeAnalyticFile } from "@lmarcel/exe-code-analytics";
import axios, { AxiosInstance } from "axios";
import { Users } from "../controllers/Users";
import { CannotGetRepository } from "../errors/api/CannotGetRespository";
import { getRawString } from "../utils/getRawString";
import { Github } from "./github";

class Directory {
  static async getAppApi(userId: string) {
    const user = await Users.getById(userId);
    const token = await Github.generateAppAccessToken(user.installationId);
    
    const appApi = axios.create({
      baseURL: "https://api.github.com/",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    appApi.interceptors.response.use(res => {
      res.headers["x-ratelimit-remaining"] && console.log("\nRate limit remaining: " + res.headers["x-ratelimit-remaining"]);
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

    let oldCommitFiles: GithubTreesFile[] = [];

    const commits = await Promise.all(commitsRef.reverse().map(async(c) => {
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

      const files: GithubTreesFile[] = await Promise.all(data.files.map(async(f) => {
        return await this.getFileData({ 
          path: f.filename,
          url: f.raw_url,
          commit: c.sha
        }, authUserId, appApi);
      }));

      const allFiles = [ 
        ...oldCommitFiles,
        ...files
      ];

      const analytics = new CodeAnalytic<typeof allFiles[0]>(allFiles.map(f => {
        return {
          content: f.content,
          path: f.path,
          commit: f.commit,
          url: f.url
        };
      }));

      const analyticResult = analytics.execute();

      console.log("Commit loaded");

      oldCommitFiles = analyticResult.map((r) => {
        return {
          content: r.content,
          path: r.path,
          commit: r.commit,
          url: r.url
        };
      });

      console.log("Old commits updated");

      const currentCommitResult = analyticResult.reduce((prev, cur) => {
        const pathIndex = prev.findIndex(r => r.path === cur.path);

        if(pathIndex >= 0) {
          prev[pathIndex] = cur;
        } else {
          prev.push(cur);
        };

        return prev;
      }, [] as (CodeAnalyticFile & GithubTreesFile)[]);

      console.log("Result filtered");

      const commitMetrics = currentCommitResult.reduce((prev, cur) => {
        prev.churn += cur.churn;
      
        prev.sloc += cur.sloc;
        prev.complexity += cur.complexity;

        prev.classes = [ ...prev.classes, ...cur.classes.all ];
        prev.methods = [ ...prev.methods, ...cur.methods.all ];

        return prev;
      }, {
        churn: 0,
        complexity: 0,
        sloc: 0,
        methods: [],
        classes: []
      });

      console.log("Metrics saved");

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
        classes: commitMetrics.classes,
        methods: commitMetrics.methods,
        complexity: commitMetrics.complexity,
        churn: commitMetrics.churn,
        sloc: commitMetrics.sloc,
        url: data.html_url
      } as Partial<Commit>;
    }))

    return commits.filter(c => c !== null);
  };

  static async getFileData({ 
    path, 
    url,
    commit
  }: Partial<GithubTreesFile>, authUserId: string, appApi?: AxiosInstance): Promise<GithubTreesFile> {
    if(!appApi) {
      appApi = await this.getAppApi(authUserId);
    };

    const data = await appApi.get(url).then(res => res.data).catch(err => false as any);

    return {
      content: getRawString(data),
      commit,
      path,
      url
    } as GithubTreesFile;
  };
};

export { Directory };

