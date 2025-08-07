import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deposit } from "@/lib/models/Deposit"
import { Merchant } from "@/lib/models/Merchant"
import { Transaction } from "@/lib/models/Transaction"
import { calculateMaturityDate } from "@/lib/utils/coupon"
import { sendEmail } from "@/lib/utils/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload:any = session.user

    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const query: any = { agentId: payload.id }

    if (from || to) {
      query.createdAt = {}
      if (from) query.createdAt.$gte = new Date(from)
      if (to) query.createdAt.$lte = new Date(to + "T23:59:59.999Z")
    }

    const deposits = await Deposit.find(query)
      .populate("merchantId", "businessName userId")
      .populate("merchantId.userId", "name email")
      .sort({ createdAt: -1 })

    return NextResponse.json({ deposits })
  } catch (error) {
    console.error("Fetch agent deposits error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload: any = session.user

    const { merchantId, amount, notes } = await request.json()

    // Find merchant
    const merchant = await Merchant.findById(merchantId).populate("userId")
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    if (merchant.agentId.toString() !== payload.id) {
      return NextResponse.json({ message: "Unauthorized to collect deposit for this merchant" }, { status: 403 })
    }

    // Generate receipt number
    const receiptNumber = `RCP${Date.now()}`
    const maturityDate = calculateMaturityDate(new Date())

    // Create deposit record
    const newDeposit = new Deposit({
      merchantId,
      agentId: payload.id,
      amount: Number.parseFloat(amount),
      receiptNumber,
      notes,
      maturityDate,
      status: "confirmed",
    })

    await newDeposit.save()

    // Update merchant wallet
    const balanceBefore = merchant.wallet.balance
    merchant.wallet.balance += Number.parseFloat(amount)
    merchant.wallet.lockedAmount += Number.parseFloat(amount)
    merchant.wallet.maturityDate = maturityDate
    await merchant.save()

    // Create transaction record
    const transaction = new Transaction({
      merchantId,
      type: "deposit",
      amount: Number.parseFloat(amount),
      status: "completed",
      description: `Manual deposit collected by agent - ${receiptNumber}`,
      referenceId: receiptNumber,
      balanceBefore,
      balanceAfter: merchant.wallet.balance,
    })

    await transaction.save()

    // Send confirmation email
    const emailHtml = `
      <h2>Deposit Confirmation</h2>
      <p>Dear ${merchant.userId.name},</p>
      <p>Your deposit has been successfully collected:</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Receipt Number:</strong> ${receiptNumber}</p>
      <p><strong>Maturity Date:</strong> ${maturityDate.toLocaleDateString()}</p>
      <p>Your funds will be available for redemption after the 3-month maturity period.</p>
      <p>Best regards,<br>Platform Team</p>
    `

    await sendEmail(merchant.userId.email, "Deposit Confirmation", emailHtml)

    return NextResponse.json({
      message: "Deposit collected successfully",
      deposit: newDeposit,
    })
  } catch (error) {
    console.error("Deposit collection error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
