import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CouponCode } from "@/lib/models/CouponCode"
import { Merchant } from "@/lib/models/Merchant"
import { generateCouponCode } from "@/lib/utils/coupon"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"



export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const coupons = await CouponCode.find({})
      .populate("merchantId", "businessName userId")
      .populate("merchantId.userId", "name email")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })

    return NextResponse.json({ coupons })
  } catch (error) {
    console.error("Fetch admin coupons error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
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

    // Get merchant details for code generation
    const merchant = await Merchant.findById(merchantId).populate("userId")
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
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
      createdByRole: "admin",
    })

    await newCoupon.save()

    return NextResponse.json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    })
  } catch (error) {
    console.error("Admin coupon creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
