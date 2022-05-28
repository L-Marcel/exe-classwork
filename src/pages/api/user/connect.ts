import { Server } from "socket.io";
import { Installation } from "../../../services/installation";
import { apiHandle } from "../../../utils/api/apiHandle";
import { withUser } from "../../../utils/api/middlewares/withUser";

async function connectWithSocket(req: Req, res: Res) {
  const user = req.user;
  
  if(res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    const io = new Server(res.socket.server as any);
    res.socket.server.io = io;
  };

  const server = res.socket.server.io.of(`/${user.id}`);
  
  server.on("connection", async(socket) => {    
    socket.on("@update/rate_limit", (data) => {
      server.emit("rate_limit", data);
    });

    socket.on("@request/rate_limit", async(userId: string) => {
      const appApi = await Installation.getAppApi(userId);
      await appApi.get("rate_limit")
      .then(res => {
        server.emit("rate_limit", {
          ...res.data?.rate
        });
      })
      .catch(() => {});
    });
  });

  return res.status(200).json({ 
    userId: user.id
  });
};

export default apiHandle({
  "POST": withUser(connectWithSocket)
});
