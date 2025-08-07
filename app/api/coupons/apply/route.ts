import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Coupon from "@/models/Coupon"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { code, cartTotal } = await request.json()

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      is_active: true,
      start_date: { $lte: new Date() },
      expiry_date: { $gte: new Date() },
    })

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 })
    }

    if (coupon.usage_limit > 0 && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ error: "Coupon usage limit exceeded" }, { status: 400 })
    }

    if (cartTotal < coupon.minimum_purchase) {
      return NextResponse.json(
        {
          error: `Minimum purchase amount is ₹${coupon.minimum_purchase}`,
        },
        { status: 400 },
      )
    }

    let discount = 0
    if (coupon.discount_type === "percentage") {
      discount = Math.min((cartTotal * coupon.discount_value) / 100, cartTotal)
    } else {
      discount = Math.min(coupon.discount_value, cartTotal)
    }


    return NextResponse.json({
      valid: true,
      discount,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
    })
  } catch (error) {
    console.error("Error applying coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
