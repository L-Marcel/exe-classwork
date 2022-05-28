
import axios from "axios";
import { Socket } from "socket.io-client";
import { Users } from "../controllers/Users";
import { TimeoutConnection } from "../errors/api/TimeoutConnection";
import { Github } from "./github";
import { ServerSocket } from "./serverSocket";

class Installation {
  socket: Socket | null = null;
  rateLimit = {
    remaining: 0,
    reset: 0,
    used: 0,
    limit: 0
  };

  constructor(private userId: string) {};

  protected async prepare(token?: string) {
    const socketConnection = await new Promise((resolve) => {      
      ServerSocket.initialize(`/${this.userId}`, (socket) => {
        this.socket = socket;
        resolve(socket);
      }, (err) => {
        console.log(err);
        resolve(null);
      }, token);
    });

    const timer = new Promise((_, reject) =>  
      setTimeout(() => reject(new TimeoutConnection()), 10000));

    return await Promise.race([socketConnection, timer]);
  };

  async getAppApi(token?: string) {
    const prepared = await this.prepare(token)
    .then(res => res).catch(() => {});
    
    console.log("connected: ", prepared !== null? true:false);
    
    const user = await Users.getById(this.userId);
    
    const appToken = await Github.generateAppAccessToken(user.installationId);
    
    const appApi = axios.create({
      baseURL: "https://api.github.com/",
      headers: {
        Authorization: `Bearer ${appToken}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    appApi.interceptors.response.use(res => {
      const rateLimit = {
        remaining: Number(res.headers["x-ratelimit-remaining"] || 0),
        limit: Number(res.headers["x-ratelimit-limit"] || 0),
        reset: Number(res.headers["x-ratelimit-reset"] || 0),
        used: Number(res.headers["x-ratelimit-used"] || 0)
      };

      if(this.socket !== null && (
        res.headers["x-ratelimit-remaining"] ||
        res.headers["x-ratelimit-limit"] ||
        res.headers["x-ratelimit-reset"] ||
        res.headers["x-ratelimit-used"]
      ) && !Object.is(this.rateLimit, rateLimit)) { 
        this.socket.emit("@update/rate_limit", rateLimit);
        this.rateLimit = rateLimit;
      };
      
      return res;
    }, async(err) => {
      if(err.response.headers["x-ratelimit-remaining"] === "0") {
        console.log("Not ratelimit remaining... ");
      };

      return Promise.reject(err);
    });

    return appApi;
  };

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
      return res;
    }, async(err) => {
      if(err.response.headers["x-ratelimit-remaining"] === "0") {
        console.log("Not ratelimit remaining... ");
      };

      return Promise.reject(err);
    });

    return appApi;
  };
};

export { Installation };

