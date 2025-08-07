import mongoose from "mongoose"

const PincodeBlacklistSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      unique: true,
    },
    city: String,
    state: String,
    reason: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.PincodeBlacklist || mongoose.model("PincodeBlacklist", PincodeBlacklistSchema)
