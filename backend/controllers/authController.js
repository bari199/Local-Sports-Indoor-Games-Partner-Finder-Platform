import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Game from "../models/Game.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

// =====================================================
// REGISTER USER
// =====================================================

export const registerUser = async (req, res) => {
  try {
    console.log("========== REGISTER USER ==========");

    const {
      name,
      email,
      password,
      location,
      preferredGames,
      skillLevel,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // =================================================
    // CHECK EXISTING USER
    // =================================================

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // =================================================
    // VALIDATE PREFERRED GAMES
    // =================================================

    let validPreferredGames = [];

    if (preferredGames !== undefined) {
      let gamesInput = preferredGames;

      // FormData হলে string আসতে পারে
      if (typeof gamesInput === "string") {
        try {
          gamesInput = JSON.parse(gamesInput);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid preferredGames JSON",
          });
        }
      }

      if (!Array.isArray(gamesInput)) {
        return res.status(400).json({
          success: false,
          message: "Preferred games must be an array",
        });
      }

      if (gamesInput.length > 0) {
        const games = await Game.find({
          _id: {
            $in: gamesInput,
          },
          isActive: true,
        });

        if (games.length !== gamesInput.length) {
          return res.status(400).json({
            success: false,
            message: "One or more selected games are invalid",
          });
        }

        validPreferredGames = gamesInput;
      }
    }

    // =================================================
    // VALIDATE SKILL LEVEL
    // =================================================

    const allowedSkills = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    if (
      skillLevel !== undefined &&
      !allowedSkills.includes(skillLevel)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill level",
      });
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // =================================================
    // CREATE USER
    // =================================================

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      location: location?.trim() || "",
      preferredGames: validPreferredGames,
      skillLevel: skillLevel || "Beginner",
    });

    // =================================================
    // REGISTER PROFILE IMAGE
    // =================================================

    if (req.file) {
      console.log(
        "========== REGISTER IMAGE =========="
      );

      if (!req.file.buffer) {
        await User.findByIdAndDelete(user._id);

        return res.status(400).json({
          success: false,
          message: "Uploaded image buffer is missing",
        });
      }

      console.log(
        "========== UPLOADING IMAGE =========="
      );

      const uploadResult = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "local-sports/users",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  console.error(
                    "========== CLOUDINARY ERROR =========="
                  );

                  console.error(
                    "Cloudinary error:",
                    error
                  );

                  console.error(
                    "Cloudinary message:",
                    error?.message
                  );

                  console.error(
                    "Cloudinary HTTP code:",
                    error?.http_code
                  );

                  reject(error);
                  return;
                }

                resolve(result);
              }
            );

          uploadStream.end(req.file.buffer);
        }
      );

      // =================================================
      // VERIFY CLOUDINARY RESULT
      // =================================================

      if (
        !uploadResult ||
        !uploadResult.secure_url
      ) {
        await User.findByIdAndDelete(user._id);

        return res.status(500).json({
          success: false,
          message:
            "Cloudinary did not return an image URL",
        });
      }

      console.log(
        "Cloudinary upload successful"
      );

      console.log(
        "Cloudinary URL:",
        uploadResult.secure_url
      );

      // =================================================
      // SAVE IMAGE
      // =================================================

      user.image =
        uploadResult.secure_url;

      await user.save();
    }

    // =================================================
    // GENERATE TOKEN
    // =================================================

    const token = generateToken(
      user._id
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        image: user.image,
        preferredGames:
          user.preferredGames,
        skillLevel: user.skillLevel,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "========== REGISTER ERROR =========="
    );

    console.error("Error:", error);
    console.error(
      "Message:",
      error?.message
    );
    console.error(
      "HTTP Code:",
      error?.http_code
    );

    if (error?.http_code) {
      return res.status(
        error.http_code >= 400 &&
        error.http_code < 600
          ? error.http_code
          : 500
      ).json({
        success: false,
        message:
          error.message ||
          "Cloudinary upload failed",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Server error during registration",
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const isPasswordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token =
      generateToken(user._id);

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
        preferredGames:
          user.preferredGames,
        skillLevel:
          user.skillLevel,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login",
    });
  }
};

// =====================================================
// LOGOUT USER
// =====================================================

export const logoutUser = async (
  req,
  res
) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// =====================================================
// GET MY PROFILE
// =====================================================

export const getMyProfile = async (
  req,
  res
) => {
  try {
    console.log(
      "========== GET MY PROFILE =========="
    );

    const user =
      await User.findById(
        req.user._id
      )
        .select("-password")
        .populate(
          "preferredGames",
          "name type image description"
        );

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
      "========== GET PROFILE ERROR =========="
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Server error while fetching profile",
    });
  }
};

// =====================================================
// UPDATE MY PROFILE
// =====================================================


// =====================================================
// UPDATE MY PROFILE
// =====================================================

export const updateMyProfile = async (req, res) => {
  try {
    console.log(
      "========== UPDATE PROFILE =========="
    );

    console.log(
      "User ID:",
      req.user?._id
    );

    console.log(
      "Body:",
      req.body
    );

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

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // UPDATE NAME
    // =================================================

    if (
      req.body.name !== undefined
    ) {
      const newName = String(
        req.body.name
      ).trim();

      if (!newName) {
        return res.status(400).json({
          success: false,
          message:
            "Name cannot be empty",
        });
      }

      user.name = newName;
    }

    // =================================================
    // UPDATE LOCATION
    // =================================================

    if (
      req.body.location !== undefined
    ) {
      user.location = String(
        req.body.location
      ).trim();
    }

    // =================================================
    // UPDATE SKILL LEVEL
    // =================================================

    if (
      req.body.skillLevel !== undefined
    ) {
      const allowedSkills = [
        "Beginner",
        "Intermediate",
        "Advanced",
      ];

      const newSkillLevel = String(
        req.body.skillLevel
      ).trim();

      if (
        !allowedSkills.includes(
          newSkillLevel
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid skill level",
        });
      }

      user.skillLevel =
        newSkillLevel;
    }

    // =================================================
    // UPDATE PREFERRED GAMES
    // =================================================

    if (
      req.body.preferredGames !==
      undefined
    ) {
      let preferredGames =
        req.body.preferredGames;

      console.log(
        "Raw preferredGames:",
        preferredGames
      );

      // -------------------------------------------------
      // FormData থেকে string আসবে
      // -------------------------------------------------

      if (
        typeof preferredGames ===
        "string"
      ) {
        try {
          preferredGames =
            JSON.parse(
              preferredGames
            );
        } catch (error) {
          console.error(
            "preferredGames parse error:",
            error
          );

          return res.status(400).json({
            success: false,
            message:
              "Invalid preferredGames JSON",
          });
        }
      }

      // -------------------------------------------------
      // Must be array
      // -------------------------------------------------

      if (
        !Array.isArray(
          preferredGames
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "preferredGames must be an array",
        });
      }

      // -------------------------------------------------
      // Empty selection
      // -------------------------------------------------

      if (
        preferredGames.length ===
        0
      ) {
        user.preferredGames = [];
      } else {
        // -------------------------------------------------
        // Validate selected games
        // -------------------------------------------------

        const games =
          await Game.find({
            _id: {
              $in: preferredGames,
            },
            isActive: true,
          });

        if (
          games.length !==
          preferredGames.length
        ) {
          return res.status(400).json({
            success: false,
            message:
              "One or more selected games are invalid",
          });
        }

        user.preferredGames =
          preferredGames;
      }
    }

    // =================================================
    // UPDATE PROFILE IMAGE
    // =================================================

    if (req.file) {
      console.log(
        "========== PROFILE IMAGE UPDATE =========="
      );

      // -------------------------------------------------
      // Check image buffer
      // -------------------------------------------------

      if (!req.file.buffer) {
        return res.status(400).json({
          success: false,
          message:
            "Uploaded image buffer is missing",
        });
      }

      console.log(
        "Uploading new profile image to Cloudinary..."
      );

      // -------------------------------------------------
      // Upload to Cloudinary
      // -------------------------------------------------

      const uploadResult =
        await new Promise(
          (resolve, reject) => {
            const uploadStream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "local-sports/users",
                  resource_type:
                    "image",
                },
                (
                  error,
                  result
                ) => {
                  if (error) {
                    console.error(
                      "========== CLOUDINARY ERROR =========="
                    );

                    console.error(
                      "Cloudinary error:",
                      error
                    );

                    console.error(
                      "Cloudinary message:",
                      error?.message
                    );

                    console.error(
                      "Cloudinary HTTP code:",
                      error?.http_code
                    );

                    reject(error);
                    return;
                  }

                  resolve(result);
                }
              );

            uploadStream.end(
              req.file.buffer
            );
          }
        );

      // -------------------------------------------------
      // Verify Cloudinary result
      // -------------------------------------------------

      if (
        !uploadResult ||
        !uploadResult.secure_url
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Cloudinary did not return an image URL",
        });
      }

      console.log(
        "Cloudinary upload successful"
      );

      console.log(
        "New image URL:",
        uploadResult.secure_url
      );

      // -------------------------------------------------
      // Save new image URL
      // -------------------------------------------------

      user.image =
        uploadResult.secure_url;
    }

    // =================================================
    // SAVE USER
    // =================================================

    await user.save();

    console.log(
      "User profile saved successfully"
    );

    // =================================================
    // FETCH UPDATED USER
    // =================================================

    const updatedUser =
      await User.findById(
        user._id
      )
        .select("-password")
        .populate(
          "preferredGames",
          "name type image description"
        );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "========== UPDATE PROFILE ERROR =========="
    );

    console.error(
      "Error:",
      error
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "HTTP Code:",
      error?.http_code
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Server error while updating profile",
    });
  }
};
