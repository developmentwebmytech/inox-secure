import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import {Merchant} from "@/lib/models/Merchant"
import WalletTransaction from "@/lib/models/WalletTransaction"
import { getPhonePeClient } from "@/lib/phonepeClient"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const data = await request.json()
    const { response } = data // PhonePe sends the response object directly

    if (!response) {
      return NextResponse.json({ success: false, message: "Invalid callback data" }, { status: 400 })
    }

    const phonepeClient = getPhonePeClient()
    const decodedResponse = Buffer.from(response, "base64").toString("utf8")
    const responseJson = JSON.parse(decodedResponse)

    const { merchantId, transactionId, amount, state, code } = responseJson.data

    // Verify the payment status with PhonePe
    const statusCheck:any = await phonepeClient.getOrderStatus(transactionId)

    if (statusCheck.success && statusCheck.data.state === "COMPLETED") {
      const walletTransaction = await WalletTransaction.findById(transactionId)

      if (!walletTransaction) {
        return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 })
      }

      if (walletTransaction.status === "completed") {
        return NextResponse.json({ success: true, message: "Transaction already completed" })
      }

      walletTransaction.status = "completed"
      walletTransaction.transaction_id = statusCheck.data.transactionId // PhonePe's transaction ID
      walletTransaction.phonepe_payload = responseJson // Store full payload for debugging
      await walletTransaction.save()

      // Update merchant's wallet balance
      const merchant = await Merchant.findById(walletTransaction.merchant_id)
      if (merchant) {
        merchant.wallet.balance += walletTransaction.amount
        await merchant.save()
      }

      return NextResponse.json({ success: true, message: "Payment successful and wallet updated" })
    } else {
      // Payment failed or pending
      const walletTransaction = await WalletTransaction.findById(transactionId)
      if (walletTransaction && walletTransaction.status === "pending") {
        walletTransaction.status = "failed"
        walletTransaction.description = `PhonePe payment failed: ${statusCheck.message || code}`
        walletTransaction.phonepe_payload = responseJson
        await walletTransaction.save()
      }
      return NextResponse.json({ success: false, message: statusCheck.message || "Payment failed" }, { status: 200 })
    }
  } catch (error) {
    console.error("Error in PhonePe callback:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
