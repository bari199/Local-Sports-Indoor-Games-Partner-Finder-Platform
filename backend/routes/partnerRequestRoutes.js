import express from "express";

import {
  sendPartnerRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
} from "../controllers/partnerRequestController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendPartnerRequest);

router.get("/received", authMiddleware, getReceivedRequests);

router.get("/sent", authMiddleware, getSentRequests);

router.patch(
  "/:id/status",
  authMiddleware,
  updateRequestStatus
);

export default router;