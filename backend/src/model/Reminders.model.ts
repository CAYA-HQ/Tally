import mongoose from "mongoose";

const RemindersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
      required: true,
    },

    note: {
      type: String,
      trim: true,
      required: true,
    },

    mode: {
      type: String,
      enum: ["One-time", "Recurring"] as const,
      trim: true,
      default: "One-time",  
    },

    date: {
      type: String,
      trim: true,
    },

    time: {
      type: String,
      trim: true,
    },

    frequency: {
      type: String,
      enum: ['none', "Daily", "Weekly", "Monthly"] as const,
      trim: true,
      default: "none",
    },

    weekday: {
      type: String,
      trim: true,
    },

    monthDays: {
      type: Number,
      min: 1,
      max: 31,
    },

    alertAt: {
      type: Date,
    },

   sent: {
    type: Boolean,
    default: false
   },
   
   jobId: {
    type: String,
    trim: true
   },

   timezone: {
    type: String,
    trim: true,
    required: true,
   },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Alert = mongoose.model(
  "Alert",
  RemindersSchema
);