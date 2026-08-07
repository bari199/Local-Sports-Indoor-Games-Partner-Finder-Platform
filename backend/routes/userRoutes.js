import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);

router.put(
  "/me",
  authMiddleware,
  upload.single("profileImage"),
  updateMyProfile
);

export default router;