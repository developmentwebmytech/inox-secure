import mongoose, { Schema, type Document } from "mongoose"

export interface IWalletTransaction extends Document {
  merchant_id: mongoose.Types.ObjectId
  amount: number
  currency: string
  payment_method: "phonepe" | "bank_transfer" | "other"
  transaction_id?: string // PhonePe transaction ID or bank ref
  status: "pending" | "completed" | "failed" | "refunded"
  type: "topup" | "withdrawal"
  description?: string
  phonepe_payload?: any // Store PhonePe specific data
  createdAt: Date
  updatedAt: Date
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    merchant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    payment_method: { type: String, enum: ["phonepe", "bank_transfer", "other"], required: true },
    transaction_id: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    type: { type: String, enum: ["topup", "withdrawal"], required: true },
    description: { type: String },
    phonepe_payload: { type: Object },
  },
  { timestamps: true },
)

export default mongoose.models.WalletTransaction ||
  mongoose.model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema)
