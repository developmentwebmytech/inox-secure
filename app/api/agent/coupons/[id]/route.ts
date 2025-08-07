import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CouponCode } from "@/lib/models/CouponCode"
import { Merchant } from "@/lib/models/Merchant"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    const { isActive } = await request.json()

    // Find coupon and verify ownership
    const coupon = await CouponCode.findById(params.id).populate("merchantId")
    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findOne({ _id: coupon.merchantId._id, agentId: payload.id })
    if (!merchant) {
      return NextResponse.json({ message: "Unauthorized to modify this coupon" }, { status: 403 })
    }

    coupon.isActive = isActive
    await coupon.save()

    return NextResponse.json({ message: "Coupon updated successfully" })
  } catch (error) {
    console.error("Update coupon error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await  connectDB()

    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    // Find coupon and verify ownership
    const coupon = await CouponCode.findById(params.id).populate("merchantId")
    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findOne({ _id: coupon.merchantId._id, agentId: payload.id })
    if (!merchant) {
      return NextResponse.json({ message: "Unauthorized to delete this coupon" }, { status: 403 })
    }

    await CouponCode.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Coupon deleted successfully" })
  } catch (error) {
    console.error("Delete coupon error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
