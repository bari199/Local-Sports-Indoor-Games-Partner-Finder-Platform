const adminMiddleware = (req, res, next) => {
  try {
    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Only admin can continue
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while checking admin access",
    });
  }
};

export default adminMiddleware;