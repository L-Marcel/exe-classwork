import { io, Socket } from "socket.io-client";
import { TimeoutConnection } from "../errors/api/TimeoutConnection";
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
      setTimeout(() => reject(new TimeoutConnection()), 10000));

    return await Promise.race([socketConnection, timer]) as Promise<Socket>;
  };
};

export { ServerSocket };

