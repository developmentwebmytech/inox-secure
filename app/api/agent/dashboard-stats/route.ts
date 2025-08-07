import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Merchant } from "@/lib/models/Merchant"
import { Deposit } from "@/lib/models/Deposit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user
     
    const [totalMerchants, pendingMerchants, totalDepositsResult, monthlyCollectionResult] = await Promise.all([
      Merchant.countDocuments({ agentId: payload.id }),
      Merchant.countDocuments({ agentId: payload.id, status: "pending" }),
      Deposit.aggregate([
        { $match: { agentId: payload.id } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Deposit.aggregate([
        {
          $match: {
            agentId: payload.userId,
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ])

    const totalDeposits = totalDepositsResult[0]?.total || 0
    const monthlyCollection = monthlyCollectionResult[0]?.total || 0

    return NextResponse.json({
      totalMerchants,
      pendingMerchants,
      totalDeposits,
      monthlyCollection,
    })
  } catch (error) {
    console.error("Agent dashboard stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
