import express from "express";

import {
  sendPartnerRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  getMyPartners,
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

router.get("/partners", authMiddleware, getMyPartners);

export default router;