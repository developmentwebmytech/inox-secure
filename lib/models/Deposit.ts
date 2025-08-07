import mongoose from "mongoose"

const depositSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["manual", "online"], default: "manual" },
  status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
  receiptNumber: { type: String, unique: true },
  notes: { type: String },
  maturityDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

export const Deposit = mongoose.models.Deposit || mongoose.model("Deposit", depositSchema)
