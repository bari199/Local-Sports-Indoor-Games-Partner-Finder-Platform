import PartnerRequest from "../models/PartnerRequest.js";
import User from "../models/User.js";
import Game from "../models/Game.js";

export const sendPartnerRequest = async (req, res) => {
  try {
    const { receiverId, gameId, message } = req.body;

    if (!receiverId || !gameId) {
      return res.status(400).json({
        success: false,
        message: "Receiver and game are required",
      });
    }

    // Cannot send request to yourself
    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    // Check receiver
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

    // Check game
    const game = await Game.findOne({
      _id: gameId,
      isActive: true,
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    // Check existing pending request
    const existingRequest = await PartnerRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      game: gameId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "Request already sent",
      });
    }

    const request = await PartnerRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      game: gameId,
      message: message || "",
    });

    const populatedRequest = await PartnerRequest.findById(request._id)
      .populate("sender", "name location skillLevel")
      .populate("receiver", "name location skillLevel")
      .populate("game", "name type");

    return res.status(201).json({
      success: true,
      message: "Partner request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Send partner request error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending request",
    });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await PartnerRequest.find({
      receiver: req.user._id,
    })
      .populate("sender", "name location skillLevel")
      .populate("game", "name type")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get received requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching received requests",
    });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const requests = await PartnerRequest.find({
      sender: req.user._id,
    })
      .populate("receiver", "name location skillLevel")
      .populate("game", "name type")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get sent requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching sent requests",
    });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected",
      });
    }

    const request = await PartnerRequest.findOne({
      _id: req.params.id,
      receiver: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    request.status = status;

    await request.save();

    const updatedRequest = await PartnerRequest.findById(request._id)
      .populate("sender", "name location skillLevel")
      .populate("receiver", "name location skillLevel")
      .populate("game", "name type");

    return res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update request status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating request",
    });
  }
};