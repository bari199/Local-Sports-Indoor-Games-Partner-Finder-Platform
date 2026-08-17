import User from "../models/User.js";
import Game from "../models/Game.js";
import PartnerRequest from "../models/PartnerRequest.js";

/* ============================================================
   ADMIN DASHBOARD
============================================================ */

export const getAdminDashboard = async (req, res) => {
  try {
    /* ========================================================
       BASIC STATISTICS
    ======================================================== */

    const [
      totalUsers,
      totalAdmins,
      totalGames,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
    ] = await Promise.all([
      User.countDocuments({
        role: "user",
      }),

      User.countDocuments({
        role: "admin",
      }),

      Game.countDocuments(),

      PartnerRequest.countDocuments(),

      PartnerRequest.countDocuments({
        status: "pending",
      }),

      PartnerRequest.countDocuments({
        status: "accepted",
      }),

      PartnerRequest.countDocuments({
        status: "rejected",
      }),
    ]);

    /* ========================================================
       USER GROWTH
    ======================================================== */

    const userGrowthRaw = await User.aggregate([
      {
        $match: {
          role: "user",
          createdAt: {
            $exists: true,
          },
        },
      },

      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

          users: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const userGrowth = userGrowthRaw.map(
      (item) => ({
        month:
          monthNames[item._id.month - 1],

        year: item._id.year,

        users: item.users,
      })
    );

    /* ========================================================
       PARTNER REQUEST GROWTH
    ======================================================== */

    const requestGrowthRaw =
      await PartnerRequest.aggregate([
        {
          $match: {
            createdAt: {
              $exists: true,
            },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            requests: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    const requestGrowth =
      requestGrowthRaw.map(
        (item) => ({
          month:
            monthNames[
              item._id.month - 1
            ],

          year: item._id.year,

          requests: item.requests,
        })
      );

    /* ========================================================
       REQUEST STATUS
    ======================================================== */

    const requestStatus = [
      {
        name: "Pending",
        value: pendingRequests,
      },

      {
        name: "Accepted",
        value: acceptedRequests,
      },

      {
        name: "Rejected",
        value: rejectedRequests,
      },
    ];

    /* ========================================================
       GAME PREFERENCES
    ======================================================== */

    const gamePreferences =
      await User.aggregate([
        {
          $match: {
            role: "user",

            preferredGames: {
              $exists: true,

              $ne: [],
            },
          },
        },

        {
          $unwind: "$preferredGames",
        },

        {
          $group: {
            _id: "$preferredGames",

            users: {
              $sum: 1,
            },
          },
        },

        {
          $lookup: {
            from: "games",

            localField: "_id",

            foreignField: "_id",

            as: "game",
          },
        },

        {
          $unwind: "$game",
        },

        {
          $project: {
            _id: 0,

            name: "$game.name",

            users: 1,

            value: "$users",
          },
        },

        {
          $sort: {
            users: -1,
          },
        },

        {
          $limit: 8,
        },
      ]);

    /* ========================================================
       REQUESTS BY GAME
    ======================================================== */

    const requestsByGame =
      await PartnerRequest.aggregate([
        {
          $group: {
            _id: "$game",

            requests: {
              $sum: 1,
            },
          },
        },

        {
          $lookup: {
            from: "games",

            localField: "_id",

            foreignField: "_id",

            as: "game",
          },
        },

        {
          $unwind: "$game",
        },

        {
          $project: {
            _id: 0,

            name: "$game.name",

            requests: 1,

            value: "$requests",
          },
        },

        {
          $sort: {
            requests: -1,
          },
        },

        {
          $limit: 8,
        },
      ]);

    /* ========================================================
       RECENT USERS
    ======================================================== */

    const recentUsers = await User.find({
      role: "user",
    })
      .select(
        "name email image location skillLevel role createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

    /* ========================================================
       RECENT REQUESTS
    ======================================================== */

    const recentRequests =
      await PartnerRequest.find()
        .populate(
          "sender",
          "name image"
        )
        .populate(
          "receiver",
          "name image"
        )
        .populate(
          "game",
          "name image"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    /* ========================================================
       FINAL RESPONSE
    ======================================================== */

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalAdmins,
        totalGames,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        rejectedRequests,
      },

      analytics: {
        userGrowth,
        requestGrowth,
        requestStatus,
        gamePreferences,
        requestsByGame,
      },

      recent: {
        users: recentUsers,
        requests: recentRequests,
      },
    });
  } catch (error) {
    console.error(
      "Get admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while fetching admin dashboard",
    });
  }
};
/* ============================================================
   GET ALL USERS
============================================================ */

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("preferredGames", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get admin users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching users",
    });
  }
};

/* ============================================================
   GET SINGLE USER
============================================================ */

export const getAdminUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    )
      .select("-password")
      .populate("preferredGames", "name");

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
    console.error(
      "Get admin user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching user",
    });
  }
};

/* ============================================================
   CHANGE USER ROLE
============================================================ */

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,

      message:
        "User role updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating user role",
    });
  }
};

/* ============================================================
   DELETE USER
============================================================ */

export const deleteAdminUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own admin account",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete admin user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting user",
    });
  }
};

/* ============================================================
   GET ALL PARTNER REQUESTS
============================================================ */

export const getAdminRequests = async (
  req,
  res
) => {
  try {
    const requests = await PartnerRequest.find()
      .populate(
        "sender",
        "name email profileImage"
      )
      .populate(
        "receiver",
        "name email profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get admin requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching requests",
    });
  }
};

/* ============================================================
   UPDATE REQUEST STATUS
============================================================ */

export const updateAdminRequestStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status",
      });
    }

    const request =
      await PartnerRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Partner request not found",
      });
    }

    request.status = status;

    await request.save();

    const updatedRequest =
      await PartnerRequest.findById(
        request._id
      )
        .populate(
          "sender",
          "name email profileImage"
        )
        .populate(
          "receiver",
          "name email profileImage"
        );

    return res.status(200).json({
      success: true,
      message:
        "Request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(
      "Update admin request status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating request status",
    });
  }
};

/* ============================================================
   DELETE PARTNER REQUEST
============================================================ */

export const deleteAdminRequest = async (
  req,
  res
) => {
  try {
    const request =
      await PartnerRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Partner request not found",
      });
    }

    await PartnerRequest.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Partner request deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete admin request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting request",
    });
  }
};

/* ============================================================
   GET ALL GAMES
============================================================ */

export const getAdminGames = async (
  req,
  res
) => {
  try {
    const games = await Game.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: games.length,
      games,
    });
  } catch (error) {
    console.error(
      "Get admin games error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching games",
    });
  }
};

/* ============================================================
   GET SINGLE GAME
============================================================ */

export const getAdminGameById = async (
  req,
  res
) => {
  try {
    const game = await Game.findById(
      req.params.id
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    return res.status(200).json({
      success: true,
      game,
    });
  } catch (error) {
    console.error(
      "Get admin game error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching game",
    });
  }
};

/* ============================================================
   CREATE GAME
============================================================ */

export const createAdminGame = async (
  req,
  res
) => {
  try {
    const {
      name,
      type,
      description,
      image,
      isActive,
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message:
          "Game name and type are required",
      });
    }

    const existingGame =
      await Game.findOne({
        name: {
          $regex: `^${name.trim()}$`,
          $options: "i",
        },
      });

    if (existingGame) {
      return res.status(409).json({
        success: false,
        message: "Game already exists",
      });
    }

    const game = await Game.create({
      name: name.trim(),
      type: type.trim(),
      description:
        description?.trim() || "",
      image: image || "",
      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Game created successfully",
      game,
    });
  } catch (error) {
    console.error(
      "Create admin game error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating game",
    });
  }
};

/* ============================================================
   UPDATE GAME
============================================================ */

export const updateAdminGame = async (
  req,
  res
) => {
  try {
    const {
      name,
      type,
      description,
      image,
      isActive,
    } = req.body;

    const game = await Game.findById(
      req.params.id
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if (name !== undefined) {
      game.name = name.trim();
    }

    if (type !== undefined) {
      game.type = type.trim();
    }

    if (description !== undefined) {
      game.description =
        description.trim();
    }

    if (image !== undefined) {
      game.image = image;
    }

    if (isActive !== undefined) {
      game.isActive = isActive;
    }

    await game.save();

    return res.status(200).json({
      success: true,
      message:
        "Game updated successfully",
      game,
    });
  } catch (error) {
    console.error(
      "Update admin game error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating game",
    });
  }
};

/* ============================================================
   DELETE GAME
============================================================ */

export const deleteAdminGame = async (
  req,
  res
) => {
  try {
    const game = await Game.findById(
      req.params.id
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    await Game.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Game deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete admin game error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting game",
    });
  }
};