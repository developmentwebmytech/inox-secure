import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deposit } from "@/lib/models/Deposit"
import { Merchant } from "@/lib/models/Merchant"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"


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

    const deposits = await Deposit.find({ merchantId: merchant._id })
      .populate("agentId", "name email")
      .sort({ createdAt: -1 })

    return NextResponse.json({ deposits })
  } catch (error) {
    console.error("Fetch deposits error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
