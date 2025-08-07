import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import {Order} from "@/models/Order"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string; orderId: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = session.user

    // Check if user is accessing their own order
    if (decoded.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const order = await Order.findOne({
      _id: params.orderId,
      user_id: params.id,
    }).lean()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
