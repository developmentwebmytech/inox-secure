import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CouponCode } from "@/lib/models/CouponCode"
import { Merchant } from "@/lib/models/Merchant"
import { generateCouponCode } from "@/lib/utils/coupon"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user
    const {
      merchantId,
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
    } = await request.json()

    // Verify merchant belongs to this agent
    const merchant = await Merchant.findOne({ _id: merchantId, agentId: payload.id }).populate("userId")
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found or unauthorized" }, { status: 404 })
    }

    // Generate unique coupon code
    let couponCode
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      couponCode = generateCouponCode(merchant.businessName)
      const existing = await CouponCode.findOne({ code: couponCode })
      if (!existing) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      return NextResponse.json({ message: "Failed to generate unique coupon code" }, { status: 500 })
    }

    const newCoupon = new CouponCode({
      code: couponCode,
      merchantId,
      title,
      description,
      discountType,
      discountValue: Number.parseFloat(discountValue),
      minOrderAmount: minOrderAmount ? Number.parseFloat(minOrderAmount) : 0,
      maxDiscount: maxDiscount ? Number.parseFloat(maxDiscount) : null,
      usageLimit: usageLimit ? Number.parseInt(usageLimit) : null,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      createdBy: payload.id,
      createdByRole: "agent",
    })

    await newCoupon.save()

    return NextResponse.json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    })
  } catch (error) {
    console.error("Agent coupon creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    // Get all merchants for this agent
    const merchants = await Merchant.find({ agentId: payload.id }).select("_id")
    const merchantIds = merchants.map((m) => m._id)

    const coupons = await CouponCode.find({ merchantId: { $in: merchantIds } })
      .populate("merchantId", "businessName userId")
      .populate("merchantId.userId", "name")
      .sort({ createdAt: -1 })

    return NextResponse.json({ coupons })
  } catch (error) {
    console.error("Fetch agent coupons error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
