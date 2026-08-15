import express from "express";

import {
  getAdminDashboard,
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
   ADMIN DASHBOARD
============================================================ */

router.get(
  "/dashboard",
  getAdminDashboard
);

export default router;