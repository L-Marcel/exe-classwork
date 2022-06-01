import cors from "cors";
import express from "express";

import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectionRoutes } from "./routes/connection.routes";

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

app.use(connectionRoutes);

export { app, http, io };
