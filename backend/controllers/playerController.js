import mongoose from "mongoose";
import User from "../models/User.js";

export const getPlayers = async (req, res) => {
  try {
    const {
      game,
      location,
      skillLevel,
      availability,
    } = req.query;

    const filter = {
      _id: { $ne: req.user._id },
      role: "user",
    };

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }

    if (game) {
      if (!mongoose.Types.ObjectId.isValid(game)) {
        return res.status(400).json({
          success: false,
          message: "Invalid game ID",
        });
      }

      filter.preferredGames = game;
    }

    if (availability) {
      filter.availability = availability;
    }

    const players = await User.find(filter)
      .select("-password -email")
      .populate(
        "preferredGames",
        "name type image description"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: players.length,
      players,
    });
  } catch (error) {
    console.error("Get players error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching players",
    });
  }
};

// GET SINGLE PLAYER
export const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid player ID",
      });
    }

    const player = await User.findOne({
      _id: id,
      role: "user",
    })
      .select("-password -email")
      .populate(
        "preferredGames",
        "name type image description"
      );

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      player,
    });
  } catch (error) {
    console.error("Get player by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching player",
    });
  }
};