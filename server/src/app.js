import express from "express";
const app = express();
import { createServer } from "http";

import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";

app.use(cors());
app.use(morgan("dev"));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export default server;
