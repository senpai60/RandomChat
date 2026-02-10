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

let waitingUser = null;

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join-chat", (username) => {
    if (waitingUser && waitingUser.id !== socket.id) {
      // Match Found!
      const roomId = `${waitingUser.id}-${socket.id}`;

      const user1 = waitingUser;
      const user2 = socket;

      // Dono ko room mein daalo
      user1.join(roomId);
      user2.join(roomId);

      // Event name MUST match your frontend: "start-chat"
      io.to(roomId).emit("start-chat", { roomId });

      console.log(`Matched in Room: ${roomId}`);
      waitingUser = null; // Queue clear
    } else {
      // No match, put in queue
      waitingUser = socket;
      console.log("User added to queue:", socket.id);
    }
  });

  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", { message, sender: "stranger" });
  });

  socket.on("disconnect", () => {
    if (waitingUser === socket) {
      waitingUser = null;
    } else {
      io.to(roomId).emit("stranger-left", "The stranger has left the chat");
    }
  });
});

export default server;
