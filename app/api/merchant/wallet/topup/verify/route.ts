import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/lib/models/WalletTransaction";
import { Merchant } from "@/lib/models/Merchant";
import { getPhonePeClient } from "@/lib/phonepeClient";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "Transaction ID missing" },
        { status: 400 }
      );
    }

    const walletTransaction = await WalletTransaction.findById(transactionId);

    if (!walletTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    if (walletTransaction.status === "completed") {
      return NextResponse.json({
        success: true,
        status: "completed",
        message: "Payment already completed",
      });
    }

    // Check status with PhonePe if still pending
    const phonepeClient = getPhonePeClient();
    const statusCheck: any = await phonepeClient.getOrderStatus(transactionId);
    console.log("statusCheck", statusCheck);
    const state = statusCheck?.state;
    const paymentInfo = statusCheck?.paymentDetails?.[0]
    console.log(state);
    if (state === "COMPLETED") {
      walletTransaction.status = "completed";
      walletTransaction.transaction_id = paymentInfo.transactionId;
      await walletTransaction.save();

      // Update merchant's wallet balance
      const merchant = await Merchant.findOne({userId: walletTransaction.merchant_id});
      if (merchant) {
        merchant.wallet.balance += walletTransaction.amount;
        await merchant.save();
      }

      return NextResponse.json({
        success: true,
        status: "completed",
        message: "Payment successful",
      });
    } else if (state === "FAILED") {
      walletTransaction.status = "failed";
      walletTransaction.description = `PhonePe payment failed: ${
        statusCheck.message || statusCheck.data.code
      }`;
      await walletTransaction.save();
      return NextResponse.json({
        success: false,
        status: "failed",
        message: statusCheck.message || "Payment failed",
      });
    } else {
      // Still pending or other status
      return NextResponse.json({
        success: true,
        status: "pending",
        message: "Payment status pending",
      });
    }
  } catch (error) {
    console.error("Error verifying PhonePe top-up:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
