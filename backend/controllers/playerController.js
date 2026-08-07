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

    // Location filter
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Skill filter
    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }

    // Game filter
    if (game) {
      filter.preferredGames = game;
    }

    // Availability filter
    if (availability) {
      filter.availability = availability;
    }

    const players = await User.find(filter)
      .select("-password -email")
      .populate("preferredGames", "name type")
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