import Game from "../models/Game.js";

export const getGames = async (req, res) => {
  try {
    const games = await Game.find({ isActive: true })
      .select("name type image description")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: games.length,
      games,
    });
  } catch (error) {
    console.error("Get games error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching games",
    });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findOne({
      _id: req.params.id,
      isActive: true,
    }).select("name type image description");

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
    console.error("Get game error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching game",
    });
  }
};