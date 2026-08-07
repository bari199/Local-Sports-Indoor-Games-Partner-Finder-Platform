import User from "../models/User.js";
import Game from "../models/Game.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("preferredGames", "name type description");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, location, preferredGames, skillLevel, availability } =
      req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only fields provided by the user
    if (name !== undefined) {
      user.name = name.trim();
    }
    if (req.file) {
      user.profileImage = req.file.path;
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (preferredGames !== undefined) {
      if (!Array.isArray(preferredGames)) {
        return res.status(400).json({
          success: false,
          message: "Preferred games must be an array",
        });
      }

      const games = await Game.find({
        _id: { $in: preferredGames },
        isActive: true,
      });

      if (games.length !== preferredGames.length) {
        return res.status(400).json({
          success: false,
          message: "One or more selected games are invalid",
        });
      }

      user.preferredGames = preferredGames;
    }

    if (skillLevel !== undefined) {
      const allowedSkills = ["Beginner", "Intermediate", "Advanced"];

      if (!allowedSkills.includes(skillLevel)) {
        return res.status(400).json({
          success: false,
          message: "Invalid skill level",
        });
      }

      user.skillLevel = skillLevel;
    }
    if (availability !== undefined) {
      if (!Array.isArray(availability)) {
        return res.status(400).json({
          success: false,
          message: "Availability must be an array",
        });
      }

      user.availability = availability;
    }

    const updatedUser = await user.save();

    const userResponse = await User.findById(updatedUser._id)
      .select("-password")
      .populate("preferredGames", "name type description");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};
