
import axios from "axios";
import { Namespace } from "socket.io";

class GithubApp {
  rateLimit = {
    remaining: 0,
    reset: 0,
    used: 0,
    limit: 0
  };

  constructor(
    private server: Namespace, 
    private token: string
  ) {};

  async getApi() {        
    const appApi = axios.create({
      baseURL: "https://api.github.com/",
      headers: {
        Authorization: `Bearer ${this.token}`,
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

      if(this.server !== null && (
        res.headers["x-ratelimit-remaining"] ||
        res.headers["x-ratelimit-limit"] ||
        res.headers["x-ratelimit-reset"] ||
        res.headers["x-ratelimit-used"]
      ) && !Object.is(this.rateLimit, rateLimit)) { 
        this.server.emit("rate_limit", rateLimit);
        this.rateLimit = rateLimit;
      };
      
      return res;
    }, async(err) => {
      if(err.response.headers["x-ratelimit-remaining"] === "0") {
        console.log("Not ratelimit remaining...");
      };

      return Promise.reject(err);
    });

    return appApi;
  };
};

export { GithubApp };

