import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Coupon from "@/models/Coupon"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { code } = await request.json()

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    // Only increment if there's a limit and we haven't reached it
    if (coupon.usage_limit === 0 || coupon.usage_count < coupon.usage_limit) {
      await Coupon.findByIdAndUpdate(coupon._id, {
        $inc: { usage_count: 1 },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording coupon usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}