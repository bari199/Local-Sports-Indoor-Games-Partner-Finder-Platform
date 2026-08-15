import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";

/* ============================================================
   ADMIN SEED DATA
   Credentials come from environment variables.
============================================================ */

const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

/* ============================================================
   VALIDATE ENVIRONMENT VARIABLES
============================================================ */

if (!adminName || !adminEmail || !adminPassword) {
  console.error(
    "❌ Missing admin environment variables."
  );

  console.error(`
Required variables:

ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
  `);

  process.exit(1);
}

/* ============================================================
   CREATE ADMIN
============================================================ */

const createAdmin = async () => {
  try {
    await connectDB();

    console.log("========================================");
    console.log("       SPORTS CONNECT ADMIN SEED");
    console.log("========================================");

    const normalizedEmail = adminEmail
      .toLowerCase()
      .trim();

    /* ========================================================
       CHECK EXISTING USER
    ======================================================== */

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    /* ========================================================
       EXISTING ADMIN
    ======================================================== */

    if (existingUser && existingUser.role === "admin") {
      console.log("");
      console.log("⚠️ Admin account already exists.");
      console.log(`Email: ${existingUser.email}`);
      console.log("");

      await mongoose.connection.close();
      process.exit(0);
    }

    /* ========================================================
       EXISTING USER → PROMOTE TO ADMIN
    ======================================================== */

    if (existingUser) {
      existingUser.role = "admin";

      await existingUser.save();

      console.log("");
      console.log("✅ Existing user promoted to admin.");
      console.log(`Email: ${existingUser.email}`);
      console.log("");

      await mongoose.connection.close();
      process.exit(0);
    }

    /* ========================================================
       HASH PASSWORD
    ======================================================== */

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      12
    );

    /* ========================================================
       CREATE ADMIN
    ======================================================== */

    const admin = await User.create({
      name: adminName,
      email: normalizedEmail,
      password: hashedPassword,
      location: "Kolkata",
      skillLevel: "Advanced",
      preferredGames: [],
      role: "admin",
    });

    /* ========================================================
       SUCCESS
    ======================================================== */

    console.log("");
    console.log("✅ Admin created successfully!");
    console.log("----------------------------------------");
    console.log(`Name  : ${admin.name}`);
    console.log(`Email : ${admin.email}`);
    console.log(`Role  : ${admin.role}`);
    console.log("----------------------------------------");
    console.log("");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ Admin seed failed:");
    console.error(error.message);
    console.error("");

    await mongoose.connection.close();

    process.exit(1);
  }
};

createAdmin();