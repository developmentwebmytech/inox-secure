import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import {Order} from "@/models/Order"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = session.user

    // Check if user is accessing their own orders
    if (decoded.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Build query
    const query: any = { user_id: params.id }

    if (status && status !== "all") {
      query.status = status
    }

    if (search) {
      query.$or = [
        { order_number: { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ]
    }

    // Get total count
    const total = await Order.countDocuments(query)

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }

    return NextResponse.json({
      orders,
      pagination,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
