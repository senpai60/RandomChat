import { Router } from "express";
import { addToQueue } from "../controllers/queue.controller.js";

const router = Router();

router.post("/queue", addToQueue);

export default router;
