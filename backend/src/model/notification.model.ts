import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "general",
      index: true,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Notification = mongoose.model(
  "Notification",
  notificationSchema
);
