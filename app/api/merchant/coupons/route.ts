import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CouponCode } from "@/lib/models/CouponCode"
import { Merchant } from "@/lib/models/Merchant"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "merchant") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    // Find merchant
    const merchant = await Merchant.findOne({ userId: payload.id })
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    const coupons = await CouponCode.find({ merchantId: merchant._id }).sort({ createdAt: -1 })

    return NextResponse.json({ coupons })
  } catch (error) {
    console.error("Fetch merchant coupons error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
