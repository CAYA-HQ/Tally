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

    whatsappNumber: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Invalid phone number"],
    },

    alertMode: [{
      type: String,
      enum: ['whatsapp', 'email', 'push'],
      default: ['email'],
    }],

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
      enum: ['', "Daily", "weekly", "monthly"] as const,
      trim: true,
      default: " ",
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

   repeatType: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"] as const,
    default: "none",
   },
   
   repeatDays: [{
    type: Number,
    min: 0,
    max: 6,
   }],

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