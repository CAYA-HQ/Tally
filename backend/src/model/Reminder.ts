import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      minlength: [2, "Reminder title must be at least 2 characters long"],
      maxlength: [100, "Reminder title must be at most 100 characters long"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [
        1000,
        "Reminder description must be at most 1000 characters long",
      ],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
    status: {
      type: String,
      enum: ["In Progress", "Completed", "Deleted"],
      default: "In Progress",
    },
    type: {
      type: String,
      enum: ["task", "inventory_alert"],
      default: "task",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Reminder = mongoose.model("Reminder", reminderSchema);

// userID -> For multi-tenant support
// status -> To match Order.jsx (Completed, Deleted)k values
// type -> To match 'Low Stock Types' and
// isRead -> Just for notes sake
