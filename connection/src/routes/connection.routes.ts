import express from "express";
import { io } from "..";
import { Directory } from "../controllers/Directory";
import { api } from "../services/api";

export type RepositoryStatus = "NOT REQUESTED" | "REQUESTED" | "LOADED";
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

          api.post<RefreshCommitsData>(`user/repository/commits/refresh?token=${token}`, {
            repositoryFullname
          }).then((res) => {
            const {
              id,
              fullname,
              status,
              appToken 
            } = res.data;
        
            if(status === "NOT REQUESTED") {
              Directory.getRepositoryCommits(userId, fullname, appToken, (rateLimit) => {
                server.emit("rate_limit", rateLimit);
              }, (progress) => {
                server.emit("progress", {
                  ...progress,
                  name: fullname,
                  status: "REQUESTED"
                });
              }).then(async(commits) => {
                for(let c = 0; c <= Math.ceil(commits.length/10); c++) {
                  const pieceOfCommits = commits.slice((c*10), (c*10) + 10);
  
                  await api.post(`user/repository/commits?token=${token}`, {
                    fullname: repositoryFullname,
                    id,
                    commits: pieceOfCommits,
                    isFinished: c >= Math.ceil(commits.length/10),
                    count: commits.length
                  }).then((res) => {
                    console.log("IsFinished: " + (c >= Math.ceil(commits.length/10)));
                    server.emit("progress", {
                      target: -pieceOfCommits.length,
                      value: -pieceOfCommits.length,
                    });
                  }).catch((err) => console.log("c", err.message));
                };

                server.emit("progress", {
                  target: 0,
                  value: 0,
                  name: fullname,
                  status: "LOADED"
                });
                
                console.log("Repository loaded: " + repositoryFullname);
                socket.disconnect();
              }).catch((err) => console.log("b", err.message));
            };

          }).catch((err) => console.log("a", err));
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
})

export { connectionRoutes };

