import { io, Socket } from "socket.io-client";
import { Api } from "./api";

class ServerSocket {
  static domain = process.env.NEXT_PUBLIC_DOMAIN;
  
  static initialize(
    subdomain: string, 
    events: (
      client: Socket
    ) => void,
    onError?: (err: any) => void,
    token?: string
  ) {
    Api.post(token? `/user/connect?token=${token}`:"user/connect").then((res) => {
      const client = io(this.domain + subdomain);
      client.on("connect", () => events(client));
    }).catch(onError);
  };
};

export { ServerSocket };

