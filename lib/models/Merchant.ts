import mongoose from "mongoose"

const merchantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  address: { type: String, required: true },
  gstNumber: { type: String },
  panNumber: { type: String },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String,
  },
  wallet: {
    balance: { type: Number, default: 0 },
    lockedAmount: { type: Number, default: 0 },
    maturityDate: { type: Date },
  },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

export const Merchant = mongoose.models.Merchant || mongoose.model("Merchant", merchantSchema)
