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
      default: 0,
    },

    updatedQuantity: {
      type: Number,
      default: 0,
    },

    boughtPrice: {
      type: Number,
    },

    sellingPrice: {
      type: Number,
    },
    category: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
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