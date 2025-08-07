import mongoose, { Schema, type Document } from "mongoose"

export interface IWishlistItem {
  product_id: mongoose.Types.ObjectId
  name: string
  price: number
  compareAtPrice?: number
  image: string
  inStock: boolean
  added_at: Date
}

export interface IWishlist extends Document {
  user_id: mongoose.Types.ObjectId
  items: IWishlistItem[]
  createdAt: Date
  updatedAt: Date
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  image: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  added_at: { type: Date, default: Date.now },
})

const WishlistSchema = new Schema<IWishlist>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [WishlistItemSchema],
  },
  { timestamps: true },
)

export default mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema)
