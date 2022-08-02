import { io, Socket } from "socket.io-client";
import { TimeoutConnectionError } from "../errors/api/TimeoutConnectionError";
import { Api } from "./api";

class ServerSocket {
  static domain = process.env.NEXT_PUBLIC_SOCKET_DOMAIN;

  static connect(
    events: (
      client: Socket
    ) => void
  ) {
    const client = io(this.domain, {
      timeout: 10000,
      reconnectionAttempts: 10
    });
    
    client.on("connect", () => events(client));
  };
  
  static initialize(
    subdomain: string, 
    events: (
      client: Socket
    ) => void,
    onError?: (err: any) => void,
    token?: string
  ) {
    Api.post(token? `/user/connect?token=${token}`:"user/connect").then((res) => {
      const client = io(this.domain + subdomain, {
        timeout: 10000,
        reconnectionAttempts: 10
      });
      
      client.on("connect", () => events(client));
    }).catch(onError);
  };

  static async getSocket(userId: string, token?: string) {
    const socketConnection = await new Promise<Socket>((resolve) => {      
      ServerSocket.initialize(`/${userId}`, (socket) => {
        resolve(socket);
      }, (err) => {
        console.log(err);
        resolve(null);
      }, token);
    });

    const timer = new Promise((_, reject) =>  
      setTimeout(() => reject(new TimeoutConnectionError()), 10000));

    return await Promise.race([socketConnection, timer]) as Promise<Socket>;
  };
};

export { ServerSocket };

