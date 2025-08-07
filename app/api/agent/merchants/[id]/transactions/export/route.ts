import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/Transaction"
import { Merchant } from "@/lib/models/Merchant"
import { User } from "@/lib/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    // Find agent
    const agent = await User.findById(payload.id)
    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 })
    }

    // Find merchant and verify it belongs to this agent
    const merchant = await Merchant.findOne({
      _id: params.id,
      createdBy: agent._id,
    })

    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    // Get all transactions for this merchant
    const transactions = await Transaction.find({
      merchantId: merchant._id,
    }).sort({ createdAt: -1 })

    // Create CSV content
    const csvHeaders = [
      "Date",
      "Type",
      "Description",
      "Amount",
      "Status",
      "Coupon Code",
      "Customer Name",
      "Customer Phone",
    ]

    const csvRows = transactions.map((transaction) => [
      new Date(transaction.createdAt).toLocaleString(),
      transaction.type,
      transaction.description,
      transaction.amount,
      transaction.status,
      transaction.couponCode || "",
      transaction.customerName || "",
      transaction.customerPhone || "",
    ])

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.map((field) => `"${field}"`).join(","))].join(
      "\n",
    )

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${merchant.businessName}-transactions.csv"`,
      },
    })
  } catch (error) {
    console.error("Export transactions error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
