import express from "express";

import {
  getPlayers,
  getPlayerById,
} from "../controllers/playerController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPlayers);

router.get(
  "/:id",
  authMiddleware,
  getPlayerById
);

export default router;