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

app.post("/connect", (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.id;
    const server = io.of(`/${userId}`);

    server.on("connection", (socket) => {    
      socket.on("@update/rate_limit", (data) => {
        server.emit("rate_limit", data);
      });
    });

    return res.status(201).send("");
  } catch (error) {
    return res.status(400).send("");
  };
});

io.on("connect", () => {
  console.log("connected outside");
})


io.listen(http.listen(process.env.PORT || 3333));

export default app;