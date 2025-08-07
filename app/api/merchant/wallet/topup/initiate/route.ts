import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import {Merchant} from "@/lib/models/Merchant"
import WalletTransaction from "@/lib/models/WalletTransaction"
import { getPhonePeClient } from "@/lib/phonepeClient"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // Assuming you have this
import { StandardCheckoutPayRequest } from "pg-sdk-node";
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "merchant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const merchantId = session.user.id
    console.log("Merchant ID:", merchantId)
    const { amount } = await request.json()

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const merchant = await Merchant.findOne({ userId: merchantId })
    console.log(merchant)
    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    const transaction = new WalletTransaction({
      merchant_id: merchantId,
      amount: amount,
      currency: "INR",
      payment_method: "phonepe",
      status: "pending",
      type: "topup",
      description: `Wallet top-up by merchant ${merchant.businessName}`,
    })
    await transaction.save()

    const phonepeClient = getPhonePeClient()
    const merchantTransactionId = transaction._id.toString() // Use our internal transaction ID
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/merchant/wallet/topup/verify?transactionId=${transaction._id}`
    const paymentPayload:any = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantTransactionId)
      .amount(Number(amount * 100))
      .redirectUrl(redirectUrl)
      .build()


    const response:any = await phonepeClient.pay(paymentPayload)

    if (response.redirectUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: response.redirectUrl,
        transactionId: transaction._id,
      })
    } else {
      transaction.status = "failed"
      transaction.description = `PhonePe initiation failed: ${response.message}`
      await transaction.save()
      return NextResponse.json({ error: response.message || "PhonePe initiation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error initiating PhonePe top-up:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
