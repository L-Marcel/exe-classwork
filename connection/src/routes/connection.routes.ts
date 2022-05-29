import express from "express";
import { io } from "..";
import { Directory } from "../controllers/Directory";
import { api } from "../services/api";

const connectionRoutes = express.Router();

connectionRoutes.post("/connect", (req, res) => {
  try {
    const userId = req.body.id;
    const namespace = `/${userId}`;
    
    if(!io._nsps.has(namespace)) {
      const server = io.of(namespace);
      server.on("connection", (socket) => {    
        socket.on("@update/rate_limit", (data) => {
          server.emit("rate_limit", data);
        });

        socket.on("@repostory/commits/refresh", ({
          repositoryFullname,
          token,
          userId
        }) => {
          console.log("Commit refresh event");

          api.post(`user/repository/commits/refresh?token=${token}`, {
            repositoryFullname
          }).then((res) => {
            const { id } = res.data;
        
            Directory.getRepositoryCommits(userId, repositoryFullname, server, token)
            .then((commits) => {
              api.post(`user/repository/commits?token=${token}`, {
                fullname: repositoryFullname,
                id,
                commits
              }).then((res) => {
                console.log("Repository loaded: " + repositoryFullname);
              }).catch((err) => console.log("c", err.message));
            }).catch((err) => console.log("b", err.message));
            
          }).catch((err) => console.log("a", err));
        });
      });
    };

    return res.status(201).send("");
  } catch (error) {
    return res.status(400).send("");
  };
});

export { connectionRoutes };

