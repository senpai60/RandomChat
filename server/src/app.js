import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";

const app = express();
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
      const roomId = `${waitingUser.id}-${socket.id}`;
      const user1 = waitingUser;
      socket.username = username;
      const user2 = socket;

      user1.join(roomId);
      user2.join(roomId);

      user1.currentRoom = roomId;
      user2.currentRoom = roomId;

      io.to(roomId).emit("start-chat", {
        roomId,
        user1: { id: user1.id, username: user1.username },
        user2: { id: user2.id, username: user2.username },
      });

      console.log(`Matched in Room: ${roomId}`);
      waitingUser = null;
    } else {
      socket.username = username;
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
    } else if (socket.currentRoom) {
      socket
        .to(socket.currentRoom)
        .emit("stranger-left", "The stranger has left the chat");
    }
  });
});

export default server;
