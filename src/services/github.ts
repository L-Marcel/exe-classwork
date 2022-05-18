import axios, { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";

import { createHmac } from "crypto";
import { buffer } from "micro";
import { NextApiRequest } from "next";
import { ClassroomRelations } from "../controllers/ClassroomRelations";
import { Users } from "../controllers/Users";
import { CannotGetRepository } from "../errors/api/CannotGetRespository";
import { EventNotFoundError } from "../errors/api/EventNotFoundError";
import { GithubUnauthorizedError } from "../errors/api/GithubUnauthorizedError";
import { PermissionsNotMatchError } from "../errors/api/PermissionsNotMatchError";
import { UnauthorizedError } from "../errors/api/UnauthorizedError";
import { haveNecessaryPermissions } from "../utils/api/webhooks/haveNecessariesPermissions";
import { writeLog } from "../utils/writeLog";
import { Api } from "./api";
import { Cookies } from "./cookies";

export class Github {
  static privateKey = process.env.GITHUB_PRIVATE_KEY.replace(/\|/gm, '\n');
  static appId = process.env.GITHUB_APP_ID;
  static clientId = process.env.GITHUB_CLIENT_ID;
  static appName = process.env.APP_NAME;
  static clientSecret = process.env.GITHUB_CLIENT_SECRET;
  static webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
  static api = axios.create({
    baseURL: "https://api.github.com/"
  });

  authenticatedApi: AxiosInstance;
  token: string;
  refreshToken: string;

  constructor(req: Req, res: Res) {
    this.token = Cookies.get("token", { req, res });
    this.refreshToken = Cookies.get("refresh_token", { req, res });
    this.authenticatedApi = axios.create({
      baseURL: "https://api.github.com/",
      headers: {
        Authorization: `Bearer ${this.token}`,
      }
    });

    //this.authenticatedApi.interceptors();
    /* 
    if(err.response.statusText === "rate limit exceeded") {
      console.log("Rate limit exceeded");
    };
    */
  };

  static async getAppApi(userId: string) {
    const user = await Users.getById(userId);
    const token = await this.generateAppAccessToken(user.installationId);
    console.log(token);
    
    const appApi = axios.create({
      baseURL: "https://api.github.com/",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    appApi.interceptors.response.use(res => res, async(err) => {
      const oldRequest = err.config;

      if(err.response.headers["x-ratelimit-remaining"] === "0" && !oldRequest._retry) {
        oldRequest._retry = true;

        const token = await this.generateAppAccessToken(user.installationId);
        appApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return await appApi(oldRequest);
      };

      return Promise.reject(err);
    });

    return appApi;
  };

  static async getAccessToken(code?: string) {
    return await Api.post("https://github.com/login/oauth/access_token", {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code
    }, {
      headers: {
        Accept: "application/json"
      }
    }).catch((err) => {
      if (err === "bad_verification_code") {
        throw new GithubUnauthorizedError();
      } else {
        throw new Error(err.message);
      };
    });
  };

  static async checkIfTokenIsValid(token: string): Promise<GithubUser> {
    const { user } = await this.api.post(`/applications/${this.clientId}/token`, {
      access_token: token
    }, {
      auth: {
        username: this.clientId,
        password: this.clientSecret
      },
      headers: {
        accept: "application/vnd.github.v3+json"
      }
    })
    .then(res => res.data)
    .catch((err) => {
      throw new UnauthorizedError();
    });
    
    return user as GithubUser;
  };

  static async getGithubWebookIsAuth(req: NextApiRequest) {
    try {
      const raw = await buffer(req);
  
      const expectedSignature = "sha256=" + createHmac("sha256", this.webhookSecret)
        .update(raw)
        .digest("hex");
  
      const signature = req.headers["x-hub-signature-256"];
  
      if (signature === expectedSignature) {
        return {
          isAuth: true,
          body: JSON.parse(raw.toString("utf-8"))
        };
      };
    } catch (error) {};
  
    return {
      isAuth: false
    };
  };

  static async generateAppAccessToken(installationId: string) {
    const now = Math.floor(Date.now() / 1000) - 30;

    const expiration = now + 60 * 10;

    const payload = {
      iat: now,
      exp: expiration,
      iss: this.appId
    };

    const token = jwt.sign(payload, this.privateKey, { algorithm: "RS256" });
    
    return await this.api.post<{ token: string }>(
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

  static async triggerWebhookEvent(type: WebhookEventType, data: any) {
    switch(type) {
      case "installation":
        let content: WebhookEventData["installation"] = data;
        const installationId = String(content.installation.id);
        const githubId = String(content.installation.account.id);

        switch(content.action) {
          case "created":
          case "unsuspend":
            const havePermissions = haveNecessaryPermissions(content);
            if(!havePermissions) {
              throw new PermissionsNotMatchError();
            };

            const user = await Users.getByGithubId(githubId);

            if(user) {
              return await Users.updateInstallation({
                githubId
              }, installationId);
            };

            return await Users.create({
              githubId,
              installationId,
              avatarUrl: content.installation.account.avatar_url,
              username: content.installation.account.login
            });
          case "deleted":
          case "suspend":
            return await Users.updateInstallation({
              installationId,
            }, null);
          default:
            break;
        };

        break;
      case "repository":
        let repository: WebhookEventData["repository"];

        break;
      default:
        break;
    };

    throw new EventNotFoundError();
  };

  static async getCommitsRefs(repositoryFullname: string, authUserId: string, appApi?: AxiosInstance, page = 1, per_page = 30) {
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

    return commits.filter(c => c);
  };

  static async getFileData({ 
    path, 
    type, 
    url, 
    commitId,
    folderGroup,
    folderSha
  }: GithubTreesFile, authUserId: string, appApi?: AxiosInstance) {
    if(!appApi) {
      appApi = await this.getAppApi(authUserId);
    };

    if(type === "blob") {
      const data = await appApi.get(url).then(res => res.data).catch(err => "");

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

      const files = await Promise.all(data.tree.map(async(f) => {
        const file = await this.getFileData({ 
          path: f.path,
          type: f.type,
          commitId,
          folderGroup,
          folderSha: data.sha,
          url: f.url
        }, authUserId, appApi);

        return file;
      }));

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

  static async getCommitsFiles(authUserId: string, repositoryFullname: string, commits: Partial<Commit>[]) {
    const appApi = await this.getAppApi(authUserId);

    const trees = await Promise.all(commits.map(async(c) => {
      const data = await appApi.get(`repos/${repositoryFullname}/git/trees/${c.tree}`)
      .then(res => res.data).catch(err => false as any);

      if(!data) {
        return null;
      };

      const files = await Promise.all(data.tree.map(async(f) => {
        const file = await this.getFileData({ 
          path: f.path,
          type: f.type,
          commitId: c.id,
          folderGroup: c.tree,
          folderSha: data.sha,
          url: f.url
        }, authUserId, appApi);

        return file;
      }));

      return {
        group: c.tree,
        sha: data.sha,
        commitId: c.id,
        path: "/",
        url: data.url,
        type: "tree",
        files,
      } as Partial<Tree>;
    }));

    writeLog(trees);

    return trees;
  };

  async getAllRepositoriesByClassroomMembers(classroomId: string, userId: string) {
    const membersLength = await ClassroomRelations.countByClassroom(classroomId, {});

    const members = await ClassroomRelations.getByClassroom(classroomId,userId, {
      take: membersLength._count._all
    });

    let allRepositories = [];

    await Promise.all(members.map(async(m) => {
      const repositories: GithubRepository[] = await this.authenticatedApi.get<GithubRepository[]>
      (`users/${m.user.username}/repos`)
      .then(res => res.data).catch((err) => []);
      
      allRepositories = [ ...allRepositories, ...repositories.map(data => {
        return {
          owner: m.user,
          name: data.name,
          fullname: data.full_name,
          description: data.description,
          gitUrl: data.git_url,
          sshUrl: data.ssh_url,
          homepage: data.homepage
        };
      })]
    }));

    return allRepositories;
  };
};