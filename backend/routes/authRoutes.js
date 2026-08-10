import express from "express";
import multer from "multer";

import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateMyProfile,
} from "../controllers/authController.js";

import isAuthenticated from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// =====================================================
// AUTH ROUTES
// =====================================================

// =====================================================
// REGISTER
// =====================================================

router.post(
  "/register",
  upload.single("image"),
  registerUser
);

// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  loginUser
);

// =====================================================
// LOGOUT
// =====================================================

router.post(
  "/logout",
  logoutUser
);

// =====================================================
// USER PROFILE
// =====================================================

// GET CURRENT LOGGED-IN USER
router.get(
  "/me",
  isAuthenticated,
  getMyProfile
);

// UPDATE CURRENT LOGGED-IN USER PROFILE
router.put(
  "/profile",
  isAuthenticated,
  upload.single("image"),
  updateMyProfile
);

// =====================================================
// EXPORT
// =====================================================

export default router;