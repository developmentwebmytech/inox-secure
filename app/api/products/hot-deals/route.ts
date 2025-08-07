import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "8")

    const hotDeals = await Product.find({
      status: "active",
      isHotDeal: true,
    })
      .populate("category")
      .populate("brand")
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      products: hotDeals,
      total: hotDeals.length,
    })
  } catch (error) {
    console.error("Error fetching hot deals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
