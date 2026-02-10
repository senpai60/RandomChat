import { Queue } from "../models/Queue.model.js";

export const addToQueue = async (socketId, username) => {
  try {
    if (!socketId || !username) {
      throw new Error("Socket ID and username are required");
    }
    const queue = new Queue({ socketId, username });
    await queue.save();
    return { message: "Added to queue" };
  } catch (error) {
    console.log(error);
    return { message: "Internal server error" };
  }
};

export const removeFromQueue = async (socketId) => {
  try {
    if (!socketId) {
      throw new Error("Socket ID is required");
    }
    const queue = await Queue.findOne({ socketId });
    if (!queue) {
      throw new Error("User not found in queue");
    }
    await queue.remove();
    return { message: "Removed from queue" };
  } catch (error) {
    console.log(error);
    return { message: "Internal server error" };
  }
};
