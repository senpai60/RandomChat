import { addToQueue } from "../services/queue.service.js";
export const addToQueue = async (req, res) => {
  const { socketId, username } = req.body;
  console.log(socketId, username);
  const message = await addToQueue(socketId, username);

  try {
    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
