import { CodeAnalytic, CodeAnalyticFile } from "@lmarcel/exe-code-analytics";
import { AxiosInstance } from "axios";
import { CannotGetRepository } from "../errors/CannotGetRespository";
import { getRawString } from "../utils/getRawString";
import { GithubApp, RateLimit } from "./GithubApp";

export type GithubRepositoryCommitRef = {
  sha: string;
  commit: {
    message: string;
    tree: {
      sha: string
    }
  };
};

export type GithubTreesFile = {
  url: string;
  path: string;
  content: string;
  commit: string;
};

export type GithubRepositoryCommit = {
  sha: string;
  html_url: string;
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  committer?: {
    login: string;
    id: number;
  };
  files: {
    status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
    filename: string;
    raw_url: string;
  }[];
};

export type Commit = {
  userGithubId: string;
  filesAdded: number;
  filesModified: number;
  filesRemoved: number;
  message: string;
  sha: string;
  totalAdditions: number;
  totalChanges: number;
  totalDeletions:number;
  classes: string[];
  methods: string[];
  complexity: number;
  churn: number;
  sloc: number;
  url: string;
};

class Directory {
  static async getCommitsRefs(
    repositoryFullname: string, 
    authUserId: string,
    token: string,
    appApi: AxiosInstance,
    onChangeRateLimit: (rateLimit: RateLimit) => void,
    page = 1, 
    per_page = 30,
  ) {
    if(!appApi) {
      const githubApp = new GithubApp(token);
      appApi = await githubApp.getApi(onChangeRateLimit);
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
      console.log(err.message);
      throw new CannotGetRepository(repositoryFullname);
    });

    if(refs.length >= per_page) {
      const nextPage = page + 1;
      const nextPageRefs: any = await this.getCommitsRefs(
        repositoryFullname, 
        authUserId, 
        token,
        appApi, 
        onChangeRateLimit,
        nextPage, 
        per_page,
      );

      return [ ...refs, ...nextPageRefs ];
    };

    return refs;
  };

  static async getRepositoryCommits(
    authUserId: string, 
    repositoryFullname: string,
    token: string,
    onChangeRateLimit: (rateLimit: RateLimit) => void
  ) {
    console.log("Getting api instance...");

    const githubApp = new GithubApp(token);
    const appApi = await githubApp.getApi(onChangeRateLimit);


    console.log("Getting commits refs...");
    const commitsRef: any[] = await this.getCommitsRefs(
      repositoryFullname, 
      authUserId, 
      token, 
      appApi, 
      onChangeRateLimit
    );

    console.log("Changing commits refs order...");
    commitsRef.reverse();

    const commits: Commit[] = [];
    
    let oldCommitFiles: GithubTreesFile[] = [];

    for(let ci in commitsRef) {
      const c = commitsRef[ci];

      const data: GithubRepositoryCommit = await appApi.get<GithubRepositoryCommit>(`repos/${repositoryFullname}/commits/${c.sha}`)
      .then(res => res.data).catch(err => false as any);

      if(!data) {
        continue;
      };

      const count = data.files.reduce((prev: any, cur: any) => {
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
        }, appApi);
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
      }), {
        printLog: "none"
      });

      const analyticResult = analytics.execute();

      oldCommitFiles = analyticResult.map((r) => {
        return {
          content: r.content,
          path: r.path,
          commit: r.commit,
          url: r.url
        };
      });

      const currentCommitResult = analyticResult.reduce((prev, cur) => {
        const pathIndex = prev.findIndex((r: any) => r.path === cur.path);

        if(pathIndex >= 0) {
          prev[pathIndex] = cur;
        } else {
          prev.push(cur);
        };

        return prev;
      }, [] as (CodeAnalyticFile & GithubTreesFile)[]);

      const commitMetrics = currentCommitResult.reduce((prev: any, cur: any) => {
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

      console.log(ci, c.commit.message);

      commits.push({
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
      } as Commit);
    };

    return commits.filter(c => c !== null);
  };

  private static async getFileData(
    { 
      path, 
      url,
      commit
    }: Omit<GithubTreesFile, "content">,
    appApi: AxiosInstance
  ): Promise<GithubTreesFile> {
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

