import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "agent", "merchant"],
      default: "user",
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["home", "office", "other"],
          default: "home",
        },
        fullName: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.models.User || mongoose.model("User", UserSchema)
