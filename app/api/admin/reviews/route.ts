import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Review from "@/lib/models/Review"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"
    const search = searchParams.get("search") || ""

    const filter: any = {}

    if (status === "pending") {
      filter.is_verified = false
      filter.is_admin_review = false
    } else if (status === "approved") {
      filter.is_verified = true
    } else if (status === "rejected") {
      filter.is_verified = false
      filter.is_admin_review = false
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ]
    }

    const reviews = await Review.find(filter)
      .populate("product_id", "title images")
      .populate("user_id", "name email")
      .sort({ createdAt: -1 })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching admin reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { product_id, rating, title, comment } = await request.json()

    const review = new Review({
      product_id,
      admin_id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      rating,
      title,
      comment,
      verified_purchase: false,
      is_verified: true,
      is_admin_review: true,
    })

    await review.save()

    return NextResponse.json({ message: "Admin review added successfully", review })
  } catch (error) {
    console.error("Error creating admin review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
