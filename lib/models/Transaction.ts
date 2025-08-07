import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  type: { type: String, enum: ["deposit", "withdrawal", "coupon_redemption", "commission"], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  description: { type: String },
  referenceId: { type: String },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema)
