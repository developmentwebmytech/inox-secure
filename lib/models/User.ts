import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user","admin", "agent", "merchant"], default: "user", required: true },
  name: { type: String, required: true },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)
