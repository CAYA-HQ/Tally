import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
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
      enum: ['whatsapp', 'email', 'push']
    }],

    title: {
      type: String,
      trim: true,
      required: true,
    },

    reminder: {
      type: String,
      trim: true,
      required: true,
    },

    alertAt: {
      type: Date,
      required: true,
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
    enum: ["none", "daily", "weekly", "monthly"],
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
  AlertSchema
);