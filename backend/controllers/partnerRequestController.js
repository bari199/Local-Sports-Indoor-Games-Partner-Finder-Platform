import mongoose from "mongoose";

import PartnerRequest from "../models/PartnerRequest.js";
import User from "../models/User.js";
import Game from "../models/Game.js";

/* ============================================================
   SEND PARTNER REQUEST
============================================================ */

export const sendPartnerRequest = async (req, res) => {
  try {
    const { receiverId, gameId, message } = req.body;

    /* --------------------------------------------------------
       1. Required fields
    -------------------------------------------------------- */

    if (!receiverId || !gameId) {
      return res.status(400).json({
        success: false,
        message: "Receiver and game are required",
      });
    }

    /* --------------------------------------------------------
       2. Validate MongoDB ObjectIds
    -------------------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID",
      });
    }

    /* --------------------------------------------------------
       3. Cannot send request to yourself
    -------------------------------------------------------- */

    if (req.user._id.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    /* --------------------------------------------------------
       4. Check receiver
    -------------------------------------------------------- */

    const receiver = await User.findOne({
      _id: receiverId,
      role: "user",
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    /* --------------------------------------------------------
       5. Check game
    -------------------------------------------------------- */

    const game = await Game.findOne({
      _id: gameId,
      isActive: true,
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or inactive",
      });
    }

    /* --------------------------------------------------------
       6. Check existing accepted connection
    -------------------------------------------------------- */

    const existingConnection = await PartnerRequest.findOne({
      game: gameId,
      status: "accepted",

      $or: [
        {
          sender: req.user._id,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: req.user._id,
        },
      ],
    });

    if (existingConnection) {
      return res.status(409).json({
        success: false,
        message: "You are already partners for this game",
      });
    }

    /* --------------------------------------------------------
       7. Check pending request in both directions
    -------------------------------------------------------- */

    const existingRequest = await PartnerRequest.findOne({
      game: gameId,
      status: "pending",

      $or: [
        {
          sender: req.user._id,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: req.user._id,
        },
      ],
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "A pending request already exists between these players",
      });
    }

    /* --------------------------------------------------------
       8. Create request
    -------------------------------------------------------- */

    const request = await PartnerRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      game: gameId,
      message: message || "",
    });

    /* --------------------------------------------------------
       9. Populate response
    -------------------------------------------------------- */

    const populatedRequest = await PartnerRequest.findById(request._id)
      .populate(
        "sender",
        "name profileImage location skillLevel"
      )
      .populate(
        "receiver",
        "name profileImage location skillLevel"
      )
      .populate(
        "game",
        "name type image"
      );

    /* --------------------------------------------------------
       10. Response
    -------------------------------------------------------- */

    return res.status(201).json({
      success: true,
      message: "Partner request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error(
      "Send partner request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error while sending request",
    });
  }
};


/* ============================================================
   GET RECEIVED REQUESTS
============================================================ */

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await PartnerRequest.find({
      receiver: req.user._id,
      status: "pending",
    })
      .populate(
        "sender",
        "name profileImage location skillLevel"
      )
      .populate(
        "game",
        "name type image"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get received requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching received requests",
    });
  }
};


/* ============================================================
   GET SENT REQUESTS
============================================================ */

export const getSentRequests = async (req, res) => {
  try {
    const requests = await PartnerRequest.find({
      sender: req.user._id,
      status: "pending",
    })
      .populate(
        "receiver",
        "name profileImage location skillLevel"
      )
      .populate(
        "game",
        "name type image"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get sent requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching sent requests",
    });
  }
};


/* ============================================================
   GET MY PARTNERS
============================================================ */

export const getMyPartners = async (req, res) => {
  try {
    const requests = await PartnerRequest.find({
      status: "accepted",

      $or: [
        {
          sender: req.user._id,
        },
        {
          receiver: req.user._id,
        },
      ],
    })
      .populate(
        "sender",
        "name profileImage location skillLevel"
      )
      .populate(
        "receiver",
        "name profileImage location skillLevel"
      )
      .populate(
        "game",
        "name type image"
      )
      .sort({ updatedAt: -1 });

    const partners = requests.map((request) => {
      const isSender =
        request.sender._id.toString() ===
        req.user._id.toString();

      return {
        requestId: request._id,

        partner: isSender
          ? request.receiver
          : request.sender,

        game: request.game,

        connectedAt: request.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: partners.length,
      partners,
    });
  } catch (error) {
    console.error(
      "Get partners error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching partners",
    });
  }
};


/* ============================================================
   UPDATE REQUEST STATUS
   ACCEPT / REJECT
============================================================ */

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    /* --------------------------------------------------------
       1. Validate status
    -------------------------------------------------------- */

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be accepted or rejected",
      });
    }

    /* --------------------------------------------------------
       2. Validate request ID
    -------------------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    /* --------------------------------------------------------
       3. Find request
       Only receiver can accept/reject
    -------------------------------------------------------- */

    const request = await PartnerRequest.findOne({
      _id: id,
      receiver: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    /* --------------------------------------------------------
       4. Request must be pending
    -------------------------------------------------------- */

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "This request has already been processed",
      });
    }

    /* --------------------------------------------------------
       5. Update status
    -------------------------------------------------------- */

    request.status = status;

    await request.save();

    /* --------------------------------------------------------
       6. Populate updated request
    -------------------------------------------------------- */

    const updatedRequest =
      await PartnerRequest.findById(request._id)
        .populate(
          "sender",
          "name profileImage location skillLevel"
        )
        .populate(
          "receiver",
          "name profileImage location skillLevel"
        )
        .populate(
          "game",
          "name type image"
        );

    /* --------------------------------------------------------
       7. Response
    -------------------------------------------------------- */

    return res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error(
      "Update request status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating request",
    });
  }
};