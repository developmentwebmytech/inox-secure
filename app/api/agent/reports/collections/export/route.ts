import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deposit } from "@/lib/models/Deposit"
import { jwtVerify } from "jose"
import { getServerSession } from "next-auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session: any = await getServerSession()
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

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
      .populate("merchantId.userId", "name")
      .sort({ createdAt: -1 })

    // Create CSV content
    const csvHeader = "Date,Time,Merchant Business,Merchant Name,Amount,Receipt Number,Status,Notes\n"
    const csvContent = deposits
      .map((deposit) => {
        return [
          new Date(deposit.createdAt).toLocaleDateString(),
          new Date(deposit.createdAt).toLocaleTimeString(),
          `"${deposit.merchantId.businessName}"`,
          `"${deposit.merchantId.userId.name}"`,
          deposit.amount,
          deposit.receiptNumber,
          deposit.status,
          `"${deposit.notes || ""}"`,
        ].join(",")
      })
      .join("\n")

    const csv = csvHeader + csvContent

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="collection-report-${from || "all"}-to-${to || "all"}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export collection report error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
