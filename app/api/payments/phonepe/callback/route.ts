import { type NextRequest, NextResponse } from "next/server"
import { getPhonePeClient } from "@/lib/phonepeClient"
import { connectDB } from "@/lib/mongodb"
import {Order} from "@/models/Order"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    // PhonePe callback sends data in a 'response' field which is base64 encoded
    const encodedResponse = body.response
    if (!encodedResponse) {
      return NextResponse.json({ success: false, message: "Invalid callback payload" }, { status: 400 })
    }

    const decodedResponse = JSON.parse(Buffer.from(encodedResponse, "base64").toString("utf8"))
    const merchantTransactionId = decodedResponse.data.merchantTransactionId
    const transactionId = decodedResponse.data.transactionId // PhonePe's transaction ID

    const phonepeClient = getPhonePeClient()
    const statusResponse:any = await phonepeClient.getOrderStatus(merchantTransactionId)

    if (statusResponse.success && statusResponse.data?.state === "COMPLETED") {
      // Update order status
      const order = await Order.findOneAndUpdate(
        { "payment_details.transaction_id": merchantTransactionId },
        {
          payment_status: "completed",
          status: "confirmed",
          $set: {
            "payment_details.phonepe_transaction_id": transactionId,
            "payment_details.payment_method": "phonepe",
            "payment_details.paid_at": new Date(),
            "payment_details.amount": statusResponse.data.amount / 100, // Convert from paise
          },
        },
        { new: true },
      )

      if (order) {
        return NextResponse.json({ success: true, message: "Payment verified successfully" })
      }
    }

    return NextResponse.json({ success: false, message: "Payment verification failed" })
  } catch (error) {
    console.error("PhonePe callback error:", error)
    return NextResponse.json({ success: false, message: "Callback processing failed" })
  }
}
