import ClientCookies from "cookie-cutter";
import ServerCookies from "cookies";

export class Cookies {
  private static server = ServerCookies;
  private static client = ClientCookies;

  static get(cookie: string, serverParams?: ServerCookieParams) {
    if(typeof window === "undefined") {
      const { req, res } = serverParams;
      const server = new this.server(req, res);
      return server.get(cookie);
    } else {
      return this.client.get(cookie);
    };
  };

  static set(cookie: string, value: string, serverParams?: ServerCookieParams) {
    if(typeof window === "undefined") {
      const { req, res } = serverParams;
      const server = new this.server(req, res);
      return server.set(cookie, value);
    } else {
      return this.client.set(cookie, value, { path: "/" });
    };
  };

  static delete(cookie: string, serverParams?: ServerCookieParams) {
    if(typeof window === "undefined") {
      const { req, res } = serverParams;
      const server = new this.server(req, res);
      return server.set(cookie);
    };
  };
};