import User from "../models/User.js";
import Game from "../models/Game.js";
import PartnerRequest from "../models/PartnerRequest.js";

/* ============================================================
   ADMIN DASHBOARD
============================================================ */

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalGames,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
    ] = await Promise.all([
      User.countDocuments(),

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
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching admin dashboard",
    });
  }
};