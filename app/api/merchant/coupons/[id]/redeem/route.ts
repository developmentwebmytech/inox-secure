import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CouponCode } from "@/lib/models/CouponCode"
import { Merchant } from "@/lib/models/Merchant"
import { Transaction } from "@/lib/models/Transaction"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    // Verify merchant token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "merchant") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user
    

    const { customerName, customerPhone, orderAmount } = await request.json()

    // Validate input
    if (!customerName || !customerPhone || !orderAmount) {
      return NextResponse.json({ message: "Customer name, phone, and order amount are required" }, { status: 400 })
    }

    // Find merchant
    const merchant = await Merchant.findOne({ userId: payload.id })
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    // Find coupon
    const coupon = await CouponCode.findOne({ _id: params.id, merchantId: merchant._id })
    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    // Validate coupon
    const now = new Date()
    if (!coupon.isActive) {
      return NextResponse.json({ message: "Coupon is not active" }, { status: 400 })
    }

    if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
      return NextResponse.json({ message: "Coupon is not valid at this time" }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ message: "Coupon usage limit exceeded" }, { status: 400 })
    }

    const orderAmountNum = Number.parseFloat(orderAmount)
    if (isNaN(orderAmountNum) || orderAmountNum <= 0) {
      return NextResponse.json({ message: "Invalid order amount" }, { status: 400 })
    }

    if (orderAmountNum < coupon.minOrderAmount) {
      return NextResponse.json({ message: `Minimum order amount is ₹${coupon.minOrderAmount}` }, { status: 400 })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmountNum * coupon.discountValue) / 100
    } else {
      discountAmount = coupon.discountValue
    }

    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount
    }

    // Round discount to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100

    // Update coupon
    coupon.usedCount += 1
    coupon.redemptions.push({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderAmount: orderAmountNum,
      discountAmount,
      redeemedAt: new Date(),
      redeemedByMerchant: payload.id, // The merchant who processed the redemption
    })

    await coupon.save()

    // Create transaction record
    const transaction = new Transaction({
      merchantId: merchant._id,
      type: "coupon_redemption",
      amount: discountAmount,
      status: "completed",
      description: `Coupon ${coupon.code} redeemed for customer ${customerName}`,
      referenceId: coupon.code,
      balanceBefore: merchant.wallet.balance,
      balanceAfter: merchant.wallet.balance, // No wallet change for coupon redemption
    })

    await transaction.save()

    return NextResponse.json({
      message: "Coupon redeemed successfully",
      discountAmount,
      finalAmount: orderAmountNum - discountAmount,
      couponCode: coupon.code,
      customerName,
    })
  } catch (error) {
    console.error("Coupon redemption error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
