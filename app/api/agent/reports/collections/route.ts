import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
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

    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const query: any = { agentId: payload.id }

    if (from || to) {
      query.createdAt = {}
      if (from) query.createdAt.$gte = new Date(from)
      if (to) query.createdAt.$lte = new Date(to + "T23:59:59.999Z")
    }

    const reports = await Deposit.find(query)
      .populate("merchantId", "businessName userId")
      .populate("merchantId.userId", "name")
      .sort({ createdAt: -1 })

    // Calculate summary
    const summary = {
      totalCollections: reports.length,
      totalAmount: reports.reduce((sum, report) => sum + report.amount, 0),
      confirmedAmount: reports
        .filter((report) => report.status === "confirmed")
        .reduce((sum, report) => sum + report.amount, 0),
      pendingAmount: reports
        .filter((report) => report.status === "pending")
        .reduce((sum, report) => sum + report.amount, 0),
    }

    return NextResponse.json({ reports, summary })
  } catch (error) {
    console.error("Fetch collection reports error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
