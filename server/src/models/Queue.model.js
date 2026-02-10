import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

export const Queue = mongoose.model("Queue", queueSchema);
