import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      url: {
        type: String,
        default: ""
      },    

      public_id: {
        type: String,
        default: ""
      }
    },
    
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please enter a valid email address"],
    },

    password: {
      type: String,
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
      required: function (this: any) {
      return this.authProvider === "local";
      },
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Invalid phone number"],
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified:{
      type: Boolean,
      default: false,
    },

    usage: String,

    business: {
      storeName: String,
      address: String,
      businessType: String,
      country: String,
      city: String,
      businessPhone: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{7,14}$/, "Invalid phone number"],
      },
    },

    inventory: {
      inventoryName: String,
      inventoryType: String,
      category: String,
      currency: String,
      unit: Number,
      inventoryStock: [{
        stockId: String,
        stock: String,
        quantity: Number,
        boughtPrice: Number,
        sellingPrice: Number,
        date: Date,
      },]
    },

    reminder: [{
      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
      },

      date: {
        type: Date,
      },

      createdAt: {
        type: Date,
      },

      completed: {
        type: Boolean,
        default: false,
      },
    },
    ],

    notifications: [{
      message: {
        type: String,
      },

      date: {
        type: Date,
      },

      time: {
        type: Date,
      },

      category: {
        type: String,
      },

      read: {
        type: Boolean,
        default: false,
      },
    },
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.model("User", userSchema);