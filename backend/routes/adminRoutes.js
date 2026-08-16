import express from "express";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteAdminUser,

  getAdminGames,
  getAdminGameById,
  createAdminGame,
  updateAdminGame,
  deleteAdminGame,

  getAdminRequests,
  updateAdminRequestStatus,
  deleteAdminRequest,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ============================================================
   ADMIN PROTECTION
============================================================ */

router.use(authMiddleware);
router.use(adminMiddleware);


/* ============================================================
   DASHBOARD
============================================================ */

router.get(
  "/dashboard",
  getAdminDashboard
);


/* ============================================================
   USER MANAGEMENT
============================================================ */

router.get(
  "/users",
  getAdminUsers
);

router.get(
  "/users/:id",
  getAdminUserById
);

router.patch(
  "/users/:id/role",
  updateUserRole
);

router.delete(
  "/users/:id",
  deleteAdminUser
);


/* ============================================================
   GAME MANAGEMENT
============================================================ */

router.get(
  "/games",
  getAdminGames
);

router.get(
  "/games/:id",
  getAdminGameById
);

router.post(
  "/games",
  createAdminGame
);

router.patch(
  "/games/:id",
  updateAdminGame
);

router.delete(
  "/games/:id",
  deleteAdminGame
);

/* ============================================================
   PARTNER REQUEST MANAGEMENT
============================================================ */

router.get(
  "/requests",
  getAdminRequests
);

router.patch(
  "/requests/:id/status",
  updateAdminRequestStatus
);

router.delete(
  "/requests/:id",
  deleteAdminRequest
);

export default router;