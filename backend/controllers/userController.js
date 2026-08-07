import User from "../models/User.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("preferredGames", "name type");

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
    const {
      name,
      location,
      preferredGames,
      skillLevel,
      availability,
    } = req.body;

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

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (preferredGames !== undefined) {
      user.preferredGames = preferredGames;
    }

    if (skillLevel !== undefined) {
      user.skillLevel = skillLevel;
    }

    if (availability !== undefined) {
      user.availability = availability;
    }

    const updatedUser = await user.save();

    const userResponse = await User.findById(updatedUser._id)
      .select("-password")
      .populate("preferredGames", "name type");

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