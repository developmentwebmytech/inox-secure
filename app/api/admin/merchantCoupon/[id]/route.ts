import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CouponCode } from "@/lib/models/CouponCode"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const coupon = await CouponCode.findById(params.id)
      .populate("merchantId", "businessName userId")
      .populate("merchantId.userId", "name email")

    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    return NextResponse.json({ coupon })
  } catch (error) {
    console.error("Fetch coupon error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const {
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      isActive,
    } = await request.json()

    const coupon = await CouponCode.findById(params.id)
    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    // Update coupon fields
    coupon.title = title
    coupon.description = description
    coupon.discountType = discountType
    coupon.discountValue = Number.parseFloat(discountValue)
    coupon.minOrderAmount = minOrderAmount ? Number.parseFloat(minOrderAmount) : 0
    coupon.maxDiscount = maxDiscount ? Number.parseFloat(maxDiscount) : null
    coupon.usageLimit = usageLimit ? Number.parseInt(usageLimit) : null
    coupon.validFrom = new Date(validFrom)
    coupon.validUntil = new Date(validUntil)
    coupon.isActive = isActive

    await coupon.save()

    return NextResponse.json({ message: "Coupon updated successfully" })
  } catch (error) {
    console.error("Update coupon error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { isActive } = await request.json()

    const coupon = await CouponCode.findById(params.id)
    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    coupon.isActive = isActive
    await coupon.save()

    return NextResponse.json({ message: "Coupon status updated successfully" })
  } catch (error) {
    console.error("Update coupon status error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const coupon = await CouponCode.findById(params.id)
    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    await CouponCode.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Coupon deleted successfully" })
  } catch (error) {
    console.error("Delete coupon error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
