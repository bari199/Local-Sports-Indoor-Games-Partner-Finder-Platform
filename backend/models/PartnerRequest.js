import mongoose from "mongoose";

const partnerRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const PartnerRequest = mongoose.model(
  "PartnerRequest",
  partnerRequestSchema
);

export default PartnerRequest;