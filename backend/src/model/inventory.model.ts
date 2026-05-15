import mongoose from "mongoose";

const inventoryStockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    stock: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    quantity: {
      type: Number,
      trim: true,
    },

    boughtPrice: {
      type: Number,
    },

    sellingPrice: {
      type: Number,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Inventory = mongoose.model(
  "inventoryStock",
  inventoryStockSchema
);