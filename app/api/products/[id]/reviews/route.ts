import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Review from "@/lib/models/Review"
import {Order} from "@/models/Order"
import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get verified reviews only
    const reviews = await Review.find({
      product_id: params.id,
      is_verified: true,
    })
      .populate("user_id", "name")
      .populate("admin_id", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get review statistics
    const stats = await Review.aggregate([
      { $match: { product_id: new mongoose.Types.ObjectId(params.id), is_verified: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ])

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    if (stats[0]?.ratingDistribution) {
      stats[0].ratingDistribution.forEach((rating: number) => {
        ratingCounts[rating as keyof typeof ratingCounts]++
      })
    }

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews: stats[0]?.totalReviews || 0,
        averageRating: stats[0]?.averageRating || 0,
        ratingDistribution: ratingCounts,
      },
      pagination: {
        page,
        limit,
        hasMore: reviews.length === limit,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { rating, title, comment, images } = await request.json()

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user_id: session.user.id,
      "items.product_id": params.id,
      status: "delivered",
    })

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product_id: params.id,
      user_id: session.user.id,
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    const review = new Review({
      product_id: params.id,
      user_id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      rating,
      title,
      comment,
      images: images || [],
      verified_purchase: !!hasPurchased,
      is_verified: false, // Requires admin verification
      is_admin_review: false,
    })

    await review.save()

    return NextResponse.json({
      message: "Review submitted successfully. It will be visible after admin verification.",
      review,
    })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
