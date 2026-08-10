import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    preferredGames: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],

    skillLevel: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    availability: [
      {
        type: String,
        trim: true,
      },
    ],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;