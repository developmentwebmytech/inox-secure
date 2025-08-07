import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deposit } from "@/lib/models/Deposit"
import { getServerSession } from "next-auth"


export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession()
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload: any = session.user

    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const query: any = { agentId: payload.userId }

    if (from || to) {
      query.createdAt = {}
      if (from) query.createdAt.$gte = new Date(from)
      if (to) query.createdAt.$lte = new Date(to + "T23:59:59.999Z")
    }

    const deposits = await Deposit.find(query)
      .populate("merchantId", "businessName userId")
      .populate("merchantId.userId", "name email")
      .sort({ createdAt: -1 })

    // Create CSV content
    const csvHeader =
      "Date,Time,Merchant Business,Merchant Name,Merchant Email,Amount,Receipt Number,Status,Maturity Date,Notes\n"
    const csvContent = deposits
      .map((deposit) => {
        return [
          new Date(deposit.createdAt).toLocaleDateString(),
          new Date(deposit.createdAt).toLocaleTimeString(),
          `"${deposit.merchantId.businessName}"`,
          `"${deposit.merchantId.userId.name}"`,
          deposit.merchantId.userId.email,
          deposit.amount,
          deposit.receiptNumber,
          deposit.status,
          new Date(deposit.maturityDate).toLocaleDateString(),
          `"${deposit.notes || ""}"`,
        ].join(",")
      })
      .join("\n")

    const csv = csvHeader + csvContent

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="deposit-history-${from || "all"}-to-${to || "all"}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export deposit history error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
