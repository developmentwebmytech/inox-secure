import { type NextRequest, NextResponse } from "next/server"
import { getPhonePeClient } from "@/lib/phonepeClient"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { transactionId, orderId } = await request.json()

    const phonepeClient = getPhonePeClient()
    const statusResponse: any = await phonepeClient.getOrderStatus(transactionId)

    console.log("statusResponse", statusResponse)

    const order = await Order.findOne({ order_number: orderId })
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const state = statusResponse?.state
    const paymentInfo = statusResponse?.paymentDetails?.[0]

    if (state === "COMPLETED" && paymentInfo) {
      await Order.findOneAndUpdate(
        { order_number: orderId },
        {
          payment_status: "completed",
          status: "confirmed",
          $set: {
            "payment_details.phonepe_transaction_id": paymentInfo.transactionId,
            "payment_details.payment_method": paymentInfo.paymentMode,
            "payment_details.paid_at": new Date(paymentInfo.timestamp),
            "payment_details.amount": paymentInfo.amount / 100,
          },
        }
      )

      return NextResponse.json({
        success: true,
        status: "completed",
        message: "Payment completed successfully",
        order: {
          orderNumber: orderId,
          paymentStatus: "completed",
          transactionId: paymentInfo.transactionId,
        },
      })
    } else if (state === "FAILED") {
      await Order.findOneAndUpdate(
        { order_number: orderId },
        { payment_status: "failed" }
      )

      return NextResponse.json({
        success: false,
        status: "failed",
        message: "Payment failed",
      })
    } else {
      return NextResponse.json({
        success: false,
        status: "pending",
        message: "Payment is still processing",
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
