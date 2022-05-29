import { io, Socket } from "socket.io-client";
import { Api } from "./api";

class ServerSocket {
  static domain = process.env.NEXT_PUBLIC_SOCKET_DOMAIN;
  
  static initialize(
    subdomain: string, 
    events: (
      client: Socket
    ) => void,
    onError?: (err: any) => void,
    token?: string
  ) {
    Api.post(token? `/user/connect?token=${token}`:"user/connect").then((res) => {
      console.log(this.domain, subdomain);
      const client = io(this.domain + subdomain, {
        timeout: 8000,
        reconnectionAttempts: 10
      });
      
      client.on("connect", () => events(client));
    }).catch(onError);
  };
};

export { ServerSocket };

