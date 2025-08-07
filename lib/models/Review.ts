import mongoose, { Schema, type Document } from "mongoose"

export interface IReview extends Document {
  product_id: mongoose.Types.ObjectId
  user_id?: mongoose.Types.ObjectId
  admin_id?: mongoose.Types.ObjectId
  name: string
  email: string
  rating: number
  title: string
  comment: string
  verified_purchase: boolean
  is_verified: boolean
  is_admin_review: boolean
  helpful_count: number
  images?: string[]
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    verified_purchase: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    is_admin_review: { type: Boolean, default: false },
    helpful_count: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true },
)

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
