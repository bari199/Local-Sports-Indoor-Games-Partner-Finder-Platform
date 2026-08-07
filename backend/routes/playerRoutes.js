import express from "express";

import { getPlayers } from "../controllers/playerController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPlayers);

export default router;