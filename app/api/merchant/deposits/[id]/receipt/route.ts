import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deposit } from "@/lib/models/Deposit"
import { Merchant } from "@/lib/models/Merchant"
import { jwtVerify } from "jose"
import { getServerSession } from "next-auth"
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const deposit = await Deposit.findOne({ _id: params.id, merchantId: merchant._id })
      .populate("agentId", "name email")
      .populate("merchantId", "businessName userId")

    if (!deposit) {
      return NextResponse.json({ message: "Deposit not found" }, { status: 404 })
    }

    // Generate simple text receipt (in production, you'd use a PDF library)
    const receiptContent = `
DEPOSIT RECEIPT
===============

Receipt Number: ${deposit.receiptNumber}
Date: ${new Date(deposit.createdAt).toLocaleDateString()}
Time: ${new Date(deposit.createdAt).toLocaleTimeString()}

Merchant Details:
Business Name: ${deposit.merchantId.businessName}
Owner: ${deposit.merchantId.userId.name}

Deposit Details:
Amount: ₹${deposit.amount.toLocaleString()}
Status: ${deposit.status.toUpperCase()}
Maturity Date: ${new Date(deposit.maturityDate).toLocaleDateString()}

Collected By:
Agent: ${deposit.agentId.name}
Email: ${deposit.agentId.email}

Notes: ${deposit.notes || "N/A"}

Thank you for your business!
    `

    return new NextResponse(receiptContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="receipt-${deposit.receiptNumber}.txt"`,
      },
    })
  } catch (error) {
    console.error("Receipt generation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
