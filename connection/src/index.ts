import axios from "axios";
import cors from "cors";
import express from "express";

import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

config();

const app = express();
const http = createServer(app);

app.use(express.json());

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));

const io = new Server({
  cors: {
    origin: process.env.ALLOWED_ORIGIN
  }
});

const api = axios.create({
  baseURL: process.env.ALLOWED_ORIGIN + "/api"
});

console.log("api: ", process.env.ALLOWED_ORIGIN + "/api");

app.post("/connect", (req, res) => {
  try {
    const userId = req.body.id;
    const namespace = `/${userId}`;
    
    if(!io._nsps.has(namespace)) {
      const server = io.of(namespace);
      server.on("connection", (socket) => {    
        socket.on("@update/rate_limit", (data) => {
          server.emit("rate_limit", data);
        });

        console.log("Connected user: ", socket.id + " : " + userId);

        socket.on("@repostory/commits/refresh", ({
          repositoryFullname,
          token
        }) => {
          console.log("Commits refresh event received: ", {
            repositoryFullname,
            token
          });
          
          api.post(`user/repository/commits/refresh?token=${token}`, {
            repositoryFullname
          }).then(() => {
            socket.disconnect();
            console.log("Success on refresh commit...")
          })
          .catch((err) => console.log(err.message));
        })
      });
    };

    return res.status(201).send("");
  } catch (error) {
    return res.status(400).send("");
  };
});

io.listen(http.listen(process.env.PORT || 3333));

export default app;