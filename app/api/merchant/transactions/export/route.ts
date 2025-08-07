import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/Transaction"
import { Merchant } from "@/lib/models/Merchant"
import { jwtVerify } from "jose"
import { getServerSession } from "next-auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session: any = await getServerSession()
    if (!session || session.user.role !== "merchant") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    const merchant = await Merchant.findOne({ userId: payload.userId })
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    const transactions = await Transaction.find({ merchantId: merchant._id }).sort({ createdAt: -1 })

    // Create CSV content
    const csvHeader = "Date,Type,Amount,Status,Description,Reference ID,Balance Before,Balance After\n"
    const csvContent = transactions
      .map((transaction) => {
        return [
          new Date(transaction.createdAt).toLocaleDateString(),
          transaction.type,
          transaction.amount,
          transaction.status,
          `"${transaction.description}"`,
          transaction.referenceId,
          transaction.balanceBefore,
          transaction.balanceAfter,
        ].join(",")
      })
      .join("\n")

    const csv = csvHeader + csvContent

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export transactions error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
