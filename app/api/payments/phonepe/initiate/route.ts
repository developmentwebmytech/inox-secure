import { type NextRequest, NextResponse } from "next/server";
import { getPhonePeClient } from "@/lib/phonepeClient";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { StandardCheckoutPayRequest } from "pg-sdk-node";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    const { orderId, amount, userPhone } = await request.json();

    // Validate order exists and belongs to user
    const order = await Order.findOne({
      order_number: orderId,
      ...(session?.user?.id && { user_id: session.user.id }),
    });
    console.log(" order", order);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_status === "completed") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    const phonepeClient = getPhonePeClient();
    const merchantTransactionId = `TXN_${orderId}_${Date.now()}`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?txnId=${merchantTransactionId}&orderId=${orderId}`;
    
    const paymentPayload = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantTransactionId)
      .amount(Number(amount * 100))
      .redirectUrl(redirectUrl)
      .build();
    
    const response: any = await phonepeClient.pay(paymentPayload as any);

    if (response.redirectUrl) {
      // Update order with transaction ID
      await Order.findOneAndUpdate(
        { order_number: orderId },
        {
          payment_status: "processing",
          $set: { "payment_details.transaction_id": merchantTransactionId },
        }
      );

      return NextResponse.json({
        success: true,
        redirectUrl: response.redirectUrl,
        transactionId: merchantTransactionId,
      });
    } else {
      return NextResponse.json(
        { error: response.message || "Payment initiation failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("PhonePe payment initiation error:", error);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
