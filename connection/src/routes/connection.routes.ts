import express from "express";
import { io } from "..";
import { RepositoryQueue } from "../controllers/RepositoryQueue";
import { Users } from "../controllers/Users";
import { api } from "../services/api";

export type RepositoryStatus = "NOT_REQUESTED" | "REQUESTED" | "LOADED";
export type RefreshCommitsData = {
  id: string;
  status: RepositoryStatus;
  fullname: string;
  appToken: string;
}; 

const connectionRoutes = express.Router();

connectionRoutes.post("/connect", (req, res) => {
  try {
    const userId = req.body.id;
    const namespace = `/${userId}`;
    
    if(!io._nsps.has(namespace)) {
      const server = io.of(namespace);

      server.on("connection", (socket) => {    
        Users.addConnectedUser(namespace, {
          target: 0,
          value: 0,
          all: [] 
        });
        
        socket.join("app");

        socket.on("@update/rate_limit", (data) => {
          server.emit("rate_limit", data);
        });

        socket.on("@repostory/commits/refresh", ({
          repositoryFullname,
          token,
          userId
        }) => {
          console.log("Commit refresh event");

          api.post<RefreshCommitsData>(`user/repository/socket/commits/refresh?token=${token}`, {
            repositoryFullname
          }).then((res) => {
            const {
              id,
              appToken
            } = res.data;
            
            const user = Users.getUser(namespace);
             
            const newRepositoryQueue = new RepositoryQueue(
              server, 
              repositoryFullname, 
              id, 
              token, 
              appToken, 
              userId
            );

            user?.addInQueue(newRepositoryQueue);
          }).catch((err) => console.log("Error on try to get information: ", err));
        });
      });
    };

    return res.status(201).send("");
  } catch (error) {
    return res.status(400).send("");
  };
});

connectionRoutes.post("/alerts/new", (_, res) => {
  try {
    io.sockets.emit("@alerts/new");
    return res.status(200).send("");
  } catch (error) {
    return res.status(400).send("");
  };
});

export { connectionRoutes };

