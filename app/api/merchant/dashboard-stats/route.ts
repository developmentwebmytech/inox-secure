import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Merchant } from "@/lib/models/Merchant"
import { CouponCode } from "@/lib/models/CouponCode"
import { Transaction } from "@/lib/models/Transaction"
import { Deposit } from "@/lib/models/Deposit"
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

    const merchant = await Merchant.findOne({ userId: payload.id })
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    const [activeCoupons, totalTransactions, totalDepositsResult] = await Promise.all([
      CouponCode.countDocuments({ merchantId: merchant._id, isActive: true }),
      Transaction.countDocuments({ merchantId: merchant._id }),
      Deposit.aggregate([
        { $match: { merchantId: merchant._id } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ])

    const totalDeposits = totalDepositsResult[0]?.total || 0

    // Calculate days to maturity
    let daysToMaturity = 0
    if (merchant.wallet.maturityDate) {
      const today = new Date()
      const maturity = new Date(merchant.wallet.maturityDate)
      const diffTime = maturity.getTime() - today.getTime()
      daysToMaturity = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return NextResponse.json({
      walletBalance: merchant.wallet.balance,
      lockedAmount: merchant.wallet.lockedAmount,
      maturityDate: merchant.wallet.maturityDate,
      daysToMaturity: Math.max(0, daysToMaturity),
      totalDeposits,
      activeCoupons,
      totalTransactions,
    })
  } catch (error) {
    console.error("Merchant dashboard stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
