import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import partnerRequestRoutes from "./routes/partnerRequestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

connectDB();

/* ============================================================
   CORS
============================================================ */

const allowedOrigins = [
  "http://localhost:5173",
  "https://local-sports-indoor-games-partner-f-weld.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

app.use(express.json());

/* ============================================================
   HEALTH CHECK
============================================================ */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Local Sports Partner Finder API is running",
  });
});

/* ============================================================
   ROUTES
============================================================ */

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/games", gameRoutes);

app.use("/api/players", playerRoutes);

app.use("/api/requests", partnerRequestRoutes);

/* ============================================================
   ROOT
============================================================ */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Local Sports & Indoor Games Partner Finder Platform API",
  });
});

/* ============================================================
   SERVER
============================================================ */

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});