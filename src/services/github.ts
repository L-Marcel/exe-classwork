import axios, { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";

import { createHmac } from "crypto";
import { buffer } from "micro";
import { NextApiRequest } from "next";
import { ClassroomRelations } from "../controllers/ClassroomRelations";
import { Users } from "../controllers/Users";
import { EventNotFoundError } from "../errors/api/EventNotFoundError";
import { GithubUnauthorizedError } from "../errors/api/GithubUnauthorizedError";
import { PermissionsNotMatchError } from "../errors/api/PermissionsNotMatchError";
import { UnauthorizedError } from "../errors/api/UnauthorizedError";
import { haveNecessaryPermissions } from "../utils/api/webhooks/haveNecessariesPermissions";
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
    }).catch(() => {
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

  async getAllRepositoriesByClassroomMembers(classroomId: string) {
    const membersLength = await ClassroomRelations.countByClassroom(classroomId, {});

    const members = await ClassroomRelations.getByClassroom(classroomId, {
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