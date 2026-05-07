import { sleep } from "bun";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: { 
    type: String, required: [true, 'Email is required'], unique: true,
     match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
   },
  phone: { 
    type: String,
    match: [/^(?:\+234|0)[789][01]\d{8}$/, 'Please enter a valid phone number'],
    unique: true,
    sparse: true,
  },
  password: { 
    type: String, sparse: true, sleect: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google', 'apple'], default: 'local' },
},
  { timestamps: true,
    versionKey: false,
    strict: false,
  }
);

userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);