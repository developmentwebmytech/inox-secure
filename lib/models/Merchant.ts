import mongoose from "mongoose"

// 🧩 Define wallet as a sub-schema
const walletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  lockedAmount: { type: Number, default: 0 },
  maturityDate: { type: Date },
}, { _id: false }) // Prevents _id in nested wallet object

// 🧾 Main Merchant Schema
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
  mode: { type: String, enum: ["online", "offline"], default: "offline" },

  // ✅ Use wallet sub-schema here
  wallet: { type: walletSchema, default: () => ({}) },

  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

// ✅ Export the model
export const Merchant = mongoose.models.Merchant || mongoose.model("Merchant", merchantSchema)
