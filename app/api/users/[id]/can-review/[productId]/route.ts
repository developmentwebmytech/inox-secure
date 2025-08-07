import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import {Order} from "@/models/Order"
import Review from "@/lib/models/Review"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string; productId: string } }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.id !== params.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user_id: params.id,
      "items.product_id": params.productId,
      status: "delivered",
    })

    // Check if user already reviewed this product
    const hasReviewed = await Review.findOne({
      product_id: params.productId,
      user_id: params.id,
    })

    const canReview = hasPurchased && !hasReviewed

    return NextResponse.json({ canReview, hasPurchased: !!hasPurchased, hasReviewed: !!hasReviewed })
  } catch (error) {
    console.error("Error checking review eligibility:", error)
    return NextResponse.json({ error: "Failed to check review eligibility" }, { status: 500 })
  }
}
