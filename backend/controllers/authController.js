// import bcrypt from "bcryptjs";
// import mongoose from "mongoose";

// import User from "../models/User.js";
// import Game from "../models/Game.js";
// import generateToken from "../utils/generateToken.js";
// import cloudinary from "../config/cloudinary.js";

// // =====================================================
// // CONSTANTS
// // =====================================================

// const ALLOWED_SKILLS = [
//   "Beginner",
//   "Intermediate",
//   "Advanced",
// ];

// const ALLOWED_AVAILABILITY = [
//   "Available",
//   "Not Available",
// ];

// const USER_POPULATE_FIELDS =
//   "name type image description";

// // =====================================================
// // HELPER: SEND ERROR
// // =====================================================

// const sendError = (
//   res,
//   error,
//   defaultMessage = "Server error"
// ) => {
//   console.error(
//     "========== SERVER ERROR =========="
//   );

//   console.error("Error:", error);
//   console.error("Message:", error?.message);
//   console.error(
//     "HTTP Code:",
//     error?.http_code
//   );

//   console.error(
//     "=================================="
//   );

//   const cloudinaryStatus =
//     Number(error?.http_code) >= 400 &&
//     Number(error?.http_code) < 600
//       ? Number(error.http_code)
//       : null;

//   return res.status(cloudinaryStatus || 500).json({
//     success: false,
//     message:
//       error?.message || defaultMessage,
//   });
// };

// // =====================================================
// // HELPER: NORMALIZE AVAILABILITY
// // =====================================================

// const normalizeAvailability = (value) => {
//   // Missing / null / undefined
//   if (
//     value === undefined ||
//     value === null ||
//     value === ""
//   ) {
//     return "Available";
//   }

//   // IMPORTANT:
//   // Availability must NEVER be an array.
//   if (Array.isArray(value)) {
//     console.error(
//       "Invalid availability array received:",
//       value
//     );

//     throw new Error(
//       "Availability must be a string: Available or Not Available"
//     );
//   }

//   const normalized = String(value).trim();

//   if (
//     !ALLOWED_AVAILABILITY.includes(
//       normalized
//     )
//   ) {
//     throw new Error(
//       "Invalid availability status"
//     );
//   }

//   return normalized;
// };

// // =====================================================
// // HELPER: NORMALIZE SKILL LEVEL
// // =====================================================

// const normalizeSkillLevel = (value) => {
//   if (
//     value === undefined ||
//     value === null ||
//     value === ""
//   ) {
//     return "Beginner";
//   }

//   if (Array.isArray(value)) {
//     throw new Error(
//       "Skill level must be a string"
//     );
//   }

//   const normalized = String(value).trim();

//   if (
//     !ALLOWED_SKILLS.includes(normalized)
//   ) {
//     throw new Error(
//       "Invalid skill level"
//     );
//   }

//   return normalized;
// };

// // =====================================================
// // HELPER: PARSE PREFERRED GAMES
// // =====================================================

// const parsePreferredGames = (value) => {
//   let games = value;

//   // FormData sends arrays as JSON strings
//   if (typeof games === "string") {
//     try {
//       games = JSON.parse(games);
//     } catch (error) {
//       throw new Error(
//         "Invalid preferredGames JSON"
//       );
//     }
//   }

//   // Fallback for comma-separated values
//   if (typeof games === "string") {
//     games = games
//       .split(",")
//       .map((game) => game.trim())
//       .filter(Boolean);
//   }

//   if (!Array.isArray(games)) {
//     throw new Error(
//       "preferredGames must be an array"
//     );
//   }

//   // Remove duplicates and empty values
//   games = [
//     ...new Set(
//       games
//         .map((game) => String(game).trim())
//         .filter(Boolean)
//     ),
//   ];

//   // Validate ObjectIds
//   const invalidIds = games.filter(
//     (id) =>
//       !mongoose.Types.ObjectId.isValid(id)
//   );

//   if (invalidIds.length > 0) {
//     throw new Error(
//       "One or more selected games have invalid IDs"
//     );
//   }

//   return games;
// };

// // =====================================================
// // HELPER: VALIDATE GAMES
// // =====================================================

// const validateGames = async (gameIds) => {
//   if (
//     !gameIds ||
//     gameIds.length === 0
//   ) {
//     return [];
//   }

//   const games = await Game.find({
//     _id: {
//       $in: gameIds,
//     },
//     isActive: true,
//   }).select("_id");

//   if (
//     games.length !== gameIds.length
//   ) {
//     throw new Error(
//       "One or more selected games are invalid"
//     );
//   }

//   return gameIds;
// };

// // =====================================================
// // HELPER: CLOUDINARY UPLOAD
// // =====================================================

// const uploadImageToCloudinary = async (
//   buffer
// ) => {
//   if (!buffer) {
//     throw new Error(
//       "Uploaded image buffer is missing"
//     );
//   }

//   return new Promise(
//     (resolve, reject) => {
//       const uploadStream =
//         cloudinary.uploader.upload_stream(
//           {
//             folder:
//               "local-sports/users",
//             resource_type: "image",
//           },
//           (error, result) => {
//             if (error) {
//               console.error(
//                 "========== CLOUDINARY ERROR =========="
//               );

//               console.error(
//                 "Cloudinary error:",
//                 error
//               );

//               console.error(
//                 "Message:",
//                 error?.message
//               );

//               console.error(
//                 "HTTP Code:",
//                 error?.http_code
//               );

//               console.error(
//                 "======================================"
//               );

//               reject(error);
//               return;
//             }

//             if (
//               !result?.secure_url
//             ) {
//               reject(
//                 new Error(
//                   "Cloudinary did not return a secure image URL"
//                 )
//               );

//               return;
//             }

//             resolve(result);
//           }
//         );

//       uploadStream.end(buffer);
//     }
//   );
// };

// // =====================================================
// // REGISTER USER
// // =====================================================

// export const registerUser = async (
//   req,
//   res
// ) => {
//   let createdUser = null;

//   try {
//     console.log(
//       "========== REGISTER USER =========="
//     );

//     console.log(
//       "Request body:",
//       req.body
//     );

//     // =================================================
//     // GET BODY
//     // =================================================

//     const {
//       name,
//       email,
//       password,
//       location,
//       preferredGames,
//       availability,
//       skillLevel,
//     } = req.body;

//     // =================================================
//     // BASIC VALIDATION
//     // =================================================

//     if (
//       !name ||
//       !email ||
//       !password
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Name, email and password are required",
//       });
//     }

//     const cleanName =
//       String(name).trim();

//     const normalizedEmail =
//       String(email)
//         .toLowerCase()
//         .trim();

//     if (!cleanName) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Name cannot be empty",
//       });
//     }

//     if (!normalizedEmail) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Email cannot be empty",
//       });
//     }

//     if (
//       String(password).length < 6
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password must be at least 6 characters",
//       });
//     }

//     // =================================================
//     // CHECK EXISTING USER
//     // =================================================

//     const existingUser =
//       await User.findOne({
//         email: normalizedEmail,
//       });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "User already exists with this email",
//       });
//     }

//     // =================================================
//     // AVAILABILITY
//     // =================================================

//     let validAvailability;

//     try {
//       validAvailability =
//         normalizeAvailability(
//           availability
//         );
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }

//     console.log(
//       "Registration availability:",
//       validAvailability
//     );

//     console.log(
//       "Registration availability type:",
//       typeof validAvailability
//     );

//     // =================================================
//     // SKILL LEVEL
//     // =================================================

//     let validSkillLevel;

//     try {
//       validSkillLevel =
//         normalizeSkillLevel(
//           skillLevel
//         );
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }

//     // =================================================
//     // PREFERRED GAMES
//     // =================================================

//     let validPreferredGames = [];

//     if (
//       preferredGames !== undefined
//     ) {
//       try {
//         const parsedGames =
//           parsePreferredGames(
//             preferredGames
//           );

//         validPreferredGames =
//           await validateGames(
//             parsedGames
//           );
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           message: error.message,
//         });
//       }
//     }

//     // =================================================
//     // HASH PASSWORD
//     // =================================================

//     const hashedPassword =
//       await bcrypt.hash(
//         String(password),
//         10
//       );

//     // =================================================
//     // CREATE USER
//     // =================================================

//     createdUser =
//       await User.create({
//         name: cleanName,

//         email: normalizedEmail,

//         password: hashedPassword,

//         location:
//           location !== undefined
//             ? String(location).trim()
//             : "",

//         preferredGames:
//           validPreferredGames,

//         skillLevel:
//           validSkillLevel,

//         // IMPORTANT
//         availability:
//           validAvailability,
//       });

//     // =================================================
//     // VERIFY CREATED USER
//     // =================================================

//     console.log(
//       "========== CREATED USER =========="
//     );

//     console.log(
//       "Created user ID:",
//       createdUser._id
//     );

//     console.log(
//       "Created availability:",
//       createdUser.availability
//     );

//     console.log(
//       "Created availability type:",
//       typeof createdUser.availability
//     );

//     console.log(
//       "=================================="
//     );

//     // =================================================
//     // PROFILE IMAGE
//     // =================================================

//     if (req.file) {
//       console.log(
//         "========== REGISTER IMAGE =========="
//       );

//       try {
//         const uploadResult =
//           await uploadImageToCloudinary(
//             req.file.buffer
//           );

//         createdUser.image =
//           uploadResult.secure_url;

//         await createdUser.save();

//         console.log(
//           "Cloudinary upload successful:",
//           uploadResult.secure_url
//         );
//       } catch (uploadError) {
//         await User.findByIdAndDelete(
//           createdUser._id
//         );

//         return sendError(
//           res,
//           uploadError,
//           "Profile image upload failed"
//         );
//       }
//     }

//     // =================================================
//     // GENERATE TOKEN
//     // =================================================

//     const token =
//       generateToken(
//         createdUser._id
//       );

//     // =================================================
//     // RESPONSE
//     // =================================================

//     return res.status(201).json({
//       success: true,

//       message:
//         "User registered successfully",

//       token,

//       user: {
//         id: createdUser._id,

//         name: createdUser.name,

//         email: createdUser.email,

//         location:
//           createdUser.location,

//         image:
//           createdUser.image,

//         preferredGames:
//           createdUser.preferredGames,

//         availability:
//           createdUser.availability,

//         skillLevel:
//           createdUser.skillLevel,

//         role:
//           createdUser.role,
//       },
//     });
//   } catch (error) {
//     // =================================================
//     // CLEANUP
//     // =================================================

//     if (createdUser?._id) {
//       try {
//         await User.findByIdAndDelete(
//           createdUser._id
//         );
//       } catch (cleanupError) {
//         console.error(
//           "User cleanup failed:",
//           cleanupError
//         );
//       }
//     }

//     return sendError(
//       res,
//       error,
//       "Server error during registration"
//     );
//   }
// };

// // =====================================================
// // LOGIN USER
// // =====================================================

// export const loginUser = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       email,
//       password,
//     } = req.body;

//     // =================================================
//     // VALIDATION
//     // =================================================

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Email and password are required",
//       });
//     }

//     const normalizedEmail =
//       String(email)
//         .toLowerCase()
//         .trim();

//     // =================================================
//     // FIND USER
//     // =================================================

//     const user =
//       await User.findOne({
//         email: normalizedEmail,
//       });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Invalid email or password",
//       });
//     }

//     // =================================================
//     // PASSWORD
//     // =================================================

//     const isPasswordMatch =
//       await bcrypt.compare(
//         String(password),
//         user.password
//       );

//     if (!isPasswordMatch) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Invalid email or password",
//       });
//     }

//     // =================================================
//     // NORMALIZE LEGACY AVAILABILITY
//     // =================================================

//     let loginAvailability =
//       user.availability;

//     if (
//       Array.isArray(
//         loginAvailability
//       )
//     ) {
//       loginAvailability =
//         "Available";
//     }

//     if (
//       !ALLOWED_AVAILABILITY.includes(
//         loginAvailability
//       )
//     ) {
//       loginAvailability =
//         "Available";
//     }

//     // =================================================
//     // GENERATE TOKEN
//     // =================================================

//     const token =
//       generateToken(user._id);

//     // =================================================
//     // RESPONSE
//     // =================================================

//     return res.status(200).json({
//       success: true,

//       message:
//         "Login successful",

//       token,

//       user: {
//         id: user._id,

//         name: user.name,

//         email: user.email,

//         location: user.location,

//         image: user.image,

//         preferredGames:
//           user.preferredGames,

//         availability:
//           loginAvailability,

//         skillLevel:
//           user.skillLevel,

//         role: user.role,
//       },
//     });
//   } catch (error) {
//     return sendError(
//       res,
//       error,
//       "Server error during login"
//     );
//   }
// };

// // =====================================================
// // LOGOUT USER
// // =====================================================

// export const logoutUser = async (
//   req,
//   res
// ) => {
//   return res.status(200).json({
//     success: true,
//     message:
//       "Logout successful",
//   });
// };

// // =====================================================
// // GET MY PROFILE
// // =====================================================

// export const getMyProfile = async (
//   req,
//   res
// ) => {
//   try {
//     console.log(
//       "========== GET MY PROFILE =========="
//     );

//     if (!req.user?._id) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authentication required",
//       });
//     }

//     const user =
//       await User.findById(
//         req.user._id
//       )
//         .select("-password")
//         .populate(
//           "preferredGames",
//           USER_POPULATE_FIELDS
//         );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "User not found",
//       });
//     }

//     // =================================================
//     // LEGACY DATA PROTECTION
//     // =================================================

//     if (
//       Array.isArray(
//         user.availability
//       )
//     ) {
//       console.warn(
//         "Legacy availability array detected. Converting to Available."
//       );

//       user.availability =
//         "Available";

//       await user.save();
//     }

//     // =================================================
//     // RESPONSE
//     // =================================================

//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     return sendError(
//       res,
//       error,
//       "Server error while fetching profile"
//     );
//   }
// };

// // =====================================================
// // UPDATE MY PROFILE
// // =====================================================

// export const updateMyProfile = async (
//   req,
//   res
// ) => {
//   try {
//     console.log(
//       "========== UPDATE PROFILE =========="
//     );

//     // =================================================
//     // AUTH CHECK
//     // =================================================

//     if (!req.user?._id) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authentication required",
//       });
//     }

//     console.log(
//       "User ID:",
//       req.user._id
//     );

//     console.log(
//       "Request body:",
//       req.body
//     );

//     console.log(
//       "Request body availability:",
//       req.body?.availability
//     );

//     console.log(
//       "Request availability type:",
//       typeof req.body?.availability
//     );

//     console.log(
//       "File:",
//       req.file
//         ? {
//             name:
//               req.file.originalname,
//             type:
//               req.file.mimetype,
//             size:
//               req.file.size,
//           }
//         : "No new image"
//     );

//     // =================================================
//     // FIND USER
//     // =================================================

//     const user =
//       await User.findById(
//         req.user._id
//       );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "User not found",
//       });
//     }

//     // =================================================
//     // REPAIR OLD AVAILABILITY DATA
//     // =================================================

//     if (
//       Array.isArray(
//         user.availability
//       )
//     ) {
//       console.warn(
//         "Existing database availability is an array:",
//         user.availability
//       );

//       user.availability =
//         "Available";
//     }

//     // =================================================
//     // UPDATE NAME
//     // =================================================

//     if (
//       req.body.name !== undefined
//     ) {
//       const newName =
//         String(
//           req.body.name
//         ).trim();

//       if (!newName) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Name cannot be empty",
//         });
//       }

//       user.name = newName;
//     }

//     // =================================================
//     // UPDATE LOCATION
//     // =================================================

//     if (
//       req.body.location !==
//       undefined
//     ) {
//       user.location =
//         String(
//           req.body.location
//         ).trim();
//     }

//     // =================================================
//     // UPDATE SKILL LEVEL
//     // =================================================

//     if (
//       req.body.skillLevel !==
//       undefined
//     ) {
//       let newSkillLevel;

//       try {
//         newSkillLevel =
//           normalizeSkillLevel(
//             req.body.skillLevel
//           );
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           message:
//             error.message,
//         });
//       }

//       user.skillLevel =
//         newSkillLevel;
//     }

//     // =================================================
//     // UPDATE AVAILABILITY
//     // =================================================

//     if (
//       req.body.availability !==
//       undefined
//     ) {
//       let newAvailability;

//       try {
//         newAvailability =
//           normalizeAvailability(
//             req.body.availability
//           );
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           message:
//             error.message,
//         });
//       }

//       console.log(
//         "New availability:",
//         newAvailability
//       );

//       console.log(
//         "New availability type:",
//         typeof newAvailability
//       );

//       user.availability =
//         newAvailability;
//     }

//     // =================================================
//     // UPDATE PREFERRED GAMES
//     // =================================================

//     if (
//       req.body.preferredGames !==
//       undefined
//     ) {
//       try {
//         const parsedGames =
//           parsePreferredGames(
//             req.body.preferredGames
//           );

//         const validGames =
//           await validateGames(
//             parsedGames
//           );

//         user.preferredGames =
//           validGames;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           message:
//             error.message,
//         });
//       }
//     }

//     // =================================================
//     // UPDATE IMAGE
//     // =================================================

//     if (req.file) {
//       console.log(
//         "========== PROFILE IMAGE UPDATE =========="
//       );

//       if (!req.file.buffer) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Uploaded image buffer is missing",
//         });
//       }

//       try {
//         const uploadResult =
//           await uploadImageToCloudinary(
//             req.file.buffer
//           );

//         user.image =
//           uploadResult.secure_url;

//         console.log(
//           "New image URL:",
//           uploadResult.secure_url
//         );
//       } catch (uploadError) {
//         return sendError(
//           res,
//           uploadError,
//           "Profile image upload failed"
//         );
//       }
//     }

//     // =================================================
//     // FINAL AVAILABILITY CHECK BEFORE SAVE
//     // =================================================

//     if (
//       !ALLOWED_AVAILABILITY.includes(
//         user.availability
//       )
//     ) {
//       console.error(
//         "Invalid availability before save:",
//         user.availability
//       );

//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid availability value before save",
//       });
//     }

//     console.log(
//       "========== BEFORE SAVE =========="
//     );

//     console.log(
//       "Availability:",
//       user.availability
//     );

//     console.log(
//       "Availability type:",
//       typeof user.availability
//     );

//     console.log(
//       "================================="
//     );

//     // =================================================
//     // SAVE
//     // =================================================

//     await user.save();

//     // =================================================
//     // VERIFY DIRECTLY AFTER SAVE
//     // =================================================

//     const savedUser =
//       await User.findById(
//         user._id
//       );

//     console.log(
//       "========== AFTER SAVE =========="
//     );

//     console.log(
//       "Saved availability:",
//       savedUser?.availability
//     );

//     console.log(
//       "Saved availability type:",
//       typeof savedUser?.availability
//     );

//     console.log(
//       "================================"
//     );

//     // =================================================
//     // EXTRA SAFETY CHECK
//     // =================================================

//     if (
//       !savedUser ||
//       !ALLOWED_AVAILABILITY.includes(
//         savedUser.availability
//       )
//     ) {
//       console.error(
//         "DATABASE RETURNED INVALID AVAILABILITY:",
//         savedUser?.availability
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Profile saved but availability was stored incorrectly",
//       });
//     }

//     // =================================================
//     // GET UPDATED USER WITH POPULATION
//     // =================================================

//     const updatedUser =
//       await User.findById(
//         user._id
//       )
//         .select("-password")
//         .populate(
//           "preferredGames",
//           USER_POPULATE_FIELDS
//         );

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Updated user could not be found",
//       });
//     }

//     // =================================================
//     // FINAL DEBUG
//     // =================================================

//     console.log(
//       "========== UPDATED USER =========="
//     );

//     console.log(
//       "ID:",
//       updatedUser._id
//     );

//     console.log(
//       "Availability:",
//       updatedUser.availability
//     );

//     console.log(
//       "Availability type:",
//       typeof updatedUser.availability
//     );

//     console.log(
//       "=================================="
//     );

//     // =================================================
//     // RESPONSE
//     // =================================================

//     return res.status(200).json({
//       success: true,

//       message:
//         "Profile updated successfully",

//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error(
//       "========== UPDATE PROFILE ERROR =========="
//     );

//     console.error(
//       "Error:",
//       error
//     );

//     console.error(
//       "Message:",
//       error?.message
//     );

//     console.error(
//       "Stack:",
//       error?.stack
//     );

//     return sendError(
//       res,
//       error,
//       "Server error while updating profile"
//     );
//   }
// };




import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/User.js";
import Game from "../models/Game.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

// =====================================================
// CONSTANTS
// =====================================================

const ALLOWED_SKILLS = ["Beginner", "Intermediate", "Advanced"];

const ALLOWED_AVAILABILITY = ["Available", "Not Available"];

const USER_POPULATE_FIELDS = "name type image description";

// =====================================================
// HELPER: SEND ERROR
// =====================================================

const sendError = (res, error, defaultMessage = "Server error") => {
  console.error("========== SERVER ERROR ==========");
  console.error("Error:", error);
  console.error("Message:", error?.message);
  console.error("HTTP Code:", error?.http_code);
  console.error("==================================");

  const cloudinaryStatus =
    Number(error?.http_code) >= 400 && Number(error?.http_code) < 600
      ? Number(error.http_code)
      : null;

  return res.status(cloudinaryStatus || 500).json({
    success: false,
    message: error?.message || defaultMessage,
  });
};

// =====================================================
// HELPER: NORMALIZE SKILL LEVEL
// =====================================================

const normalizeSkillLevel = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Beginner";
  }

  if (Array.isArray(value)) {
    throw new Error("Skill level must be a string");
  }

  const normalized = String(value).trim();

  if (!ALLOWED_SKILLS.includes(normalized)) {
    throw new Error("Invalid skill level");
  }

  return normalized;
};

// =====================================================
// HELPER: PARSE PREFERRED GAMES
// =====================================================

const parsePreferredGames = (value) => {
  let games = value;

  if (typeof games === "string") {
    try {
      games = JSON.parse(games);
    } catch (error) {
      throw new Error("Invalid preferredGames JSON");
    }
  }

  if (typeof games === "string") {
    games = games
      .split(",")
      .map((game) => game.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(games)) {
    throw new Error("preferredGames must be an array");
  }

  games = [
    ...new Set(games.map((game) => String(game).trim()).filter(Boolean)),
  ];

  const invalidIds = games.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );

  if (invalidIds.length > 0) {
    throw new Error("One or more selected games have invalid IDs");
  }

  return games;
};

// =====================================================
// HELPER: VALIDATE GAMES
// =====================================================

const validateGames = async (gameIds) => {
  if (!gameIds || gameIds.length === 0) {
    return [];
  }

  const games = await Game.find({
    _id: { $in: gameIds },
    isActive: true,
  }).select("_id");

  if (games.length !== gameIds.length) {
    throw new Error("One or more selected games are invalid");
  }

  return gameIds;
};

// =====================================================
// HELPER: CLOUDINARY UPLOAD
// =====================================================

const uploadImageToCloudinary = async (buffer) => {
  if (!buffer) {
    throw new Error("Uploaded image buffer is missing");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "local-sports/users",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("========== CLOUDINARY ERROR ==========");
          console.error("Cloudinary error:", error);
          console.error("Message:", error?.message);
          console.error("HTTP Code:", error?.http_code);
          console.error("======================================");

          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary did not return a secure image URL"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// =====================================================
// REGISTER USER
// =====================================================

export const registerUser = async (req, res) => {
  let createdUser = null;

  try {
    console.log("========== REGISTER USER ==========");
    console.log("Request body:", req.body);

    const { name, email, password, location, preferredGames, skillLevel } =
      req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const cleanName = String(name).trim();
    const normalizedEmail = String(email).toLowerCase().trim();

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be empty",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // =================================================
    // CHECK EXISTING USER
    // =================================================

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // =================================================
    // SKILL LEVEL
    // =================================================

    let validSkillLevel;

    try {
      validSkillLevel = normalizeSkillLevel(skillLevel);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // =================================================
    // PREFERRED GAMES
    // =================================================

    let validPreferredGames = [];

    if (preferredGames !== undefined) {
      try {
        const parsedGames = parsePreferredGames(preferredGames);
        validPreferredGames = await validateGames(parsedGames);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword = await bcrypt.hash(String(password), 10);

    // =================================================
    // CREATE USER
    // =================================================

    createdUser = await User.create({
      name: cleanName,
      email: normalizedEmail,
      password: hashedPassword,
      location: location !== undefined ? String(location).trim() : "",
      preferredGames: validPreferredGames,
      skillLevel: validSkillLevel,
    });

    console.log("========== CREATED USER ==========");
    console.log("Created user ID:", createdUser._id);
    console.log("Created availability:", createdUser.availability);
    console.log("==================================");

    // =================================================
    // PROFILE IMAGE
    // =================================================

    if (req.file) {
      console.log("========== REGISTER IMAGE ==========");

      try {
        const uploadResult = await uploadImageToCloudinary(req.file.buffer);

        createdUser.image = uploadResult.secure_url;

        await createdUser.save();

        console.log(
          "Cloudinary upload successful:",
          uploadResult.secure_url
        );
      } catch (uploadError) {
        await User.findByIdAndDelete(createdUser._id);

        return sendError(res, uploadError, "Profile image upload failed");
      }
    }

    // =================================================
    // GENERATE TOKEN
    // =================================================

    const token = generateToken(createdUser._id);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        location: createdUser.location,
        image: createdUser.image,
        preferredGames: createdUser.preferredGames,
        availability: createdUser.availability,
        skillLevel: createdUser.skillLevel,
        role: createdUser.role,
      },
    });
  } catch (error) {
    if (createdUser?._id) {
      try {
        await User.findByIdAndDelete(createdUser._id);
      } catch (cleanupError) {
        console.error("User cleanup failed:", cleanupError);
      }
    }

    return sendError(res, error, "Server error during registration");
  }
};

// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      String(password),
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // =================================================
    // NORMALIZE LEGACY AVAILABILITY
    // =================================================

    let loginAvailability = user.availability;

    if (Array.isArray(loginAvailability)) {
      loginAvailability = "Available";
    }

    if (!ALLOWED_AVAILABILITY.includes(loginAvailability)) {
      loginAvailability = "Available";
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        image: user.image,
        preferredGames: user.preferredGames,
        availability: loginAvailability,
        skillLevel: user.skillLevel,
        role: user.role,
      },
    });
  } catch (error) {
    return sendError(res, error, "Server error during login");
  }
};

// =====================================================
// LOGOUT USER
// =====================================================

export const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// =====================================================
// GET MY PROFILE
// =====================================================

export const getMyProfile = async (req, res) => {
  try {
    console.log("========== GET MY PROFILE ==========");

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("preferredGames", USER_POPULATE_FIELDS);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // LEGACY DATA PROTECTION
    // =================================================

    if (Array.isArray(user.availability)) {
      console.warn(
        "Legacy availability array detected. Converting to Available."
      );

      user.availability = "Available";

      await user.save();
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return sendError(res, error, "Server error while fetching profile");
  }
};

// =====================================================
// UPDATE MY PROFILE
// =====================================================

export const updateMyProfile = async (req, res) => {
  try {
    console.log("========== UPDATE PROFILE ==========");

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    console.log("User ID:", req.user._id);
    console.log("Request body:", req.body);
    console.log(
      "File:",
      req.file
        ? {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
          }
        : "No new image"
    );

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // UPDATE NAME
    // =================================================

    if (req.body.name !== undefined) {
      const newName = String(req.body.name).trim();

      if (!newName) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = newName;
    }

    // =================================================
    // UPDATE LOCATION
    // =================================================

    if (req.body.location !== undefined) {
      user.location = String(req.body.location).trim();
    }

    // =================================================
    // UPDATE SKILL LEVEL
    // =================================================

    if (req.body.skillLevel !== undefined) {
      let newSkillLevel;

      try {
        newSkillLevel = normalizeSkillLevel(req.body.skillLevel);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      user.skillLevel = newSkillLevel;
    }

    // =================================================
    // UPDATE PREFERRED GAMES
    // =================================================

    if (req.body.preferredGames !== undefined) {
      try {
        const parsedGames = parsePreferredGames(req.body.preferredGames);
        const validGames = await validateGames(parsedGames);

        user.preferredGames = validGames;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    // =================================================
    // UPDATE IMAGE
    // =================================================

    if (req.file) {
      console.log("========== PROFILE IMAGE UPDATE ==========");

      if (!req.file.buffer) {
        return res.status(400).json({
          success: false,
          message: "Uploaded image buffer is missing",
        });
      }

      try {
        const uploadResult = await uploadImageToCloudinary(req.file.buffer);

        user.image = uploadResult.secure_url;

        console.log("New image URL:", uploadResult.secure_url);
      } catch (uploadError) {
        return sendError(res, uploadError, "Profile image upload failed");
      }
    }

    // =================================================
    // SAVE
    // =================================================

    await user.save();

    // =================================================
    // GET UPDATED USER WITH POPULATION
    // =================================================

    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("preferredGames", USER_POPULATE_FIELDS);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Updated user could not be found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("========== UPDATE PROFILE ERROR ==========");
    console.error("Error:", error);
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);

    return sendError(res, error, "Server error while updating profile");
  }
};