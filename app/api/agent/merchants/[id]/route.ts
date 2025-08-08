import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Merchant } from "@/lib/models/Merchant"
import { User } from "@/lib/models/User"
import { Deposit } from "@/lib/models/Deposit"
import { Transaction } from "@/lib/models/Transaction"
import { CouponCode } from "@/lib/models/CouponCode"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    // Find agent
    const agent = await User.findById(payload.id)
    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 })
    }

    const merchant = await Merchant.findOne({
      _id: params.id,
      agentId: agent._id,
    }).populate("userId", "name email phone")

    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    console.log("Locked Amount:", merchant.wallet.lockedAmount)
    console.log("Maturity Date:", merchant.wallet.maturityDate)
    console.log("Current Date:", new Date())
    console.log(
      "Maturity Date reached:",
      merchant.wallet.maturityDate && merchant.wallet.maturityDate <= new Date()
    )

    if (
      merchant.wallet.lockedAmount > 0 &&
      merchant.wallet.maturityDate &&
      merchant.wallet.maturityDate <= new Date()
    ) {
      console.log(`🔓 Unlocking ₹${merchant.wallet.lockedAmount}...`)

      merchant.wallet.balance += merchant.wallet.lockedAmount
      merchant.wallet.lockedAmount = 0
      merchant.wallet.maturityDate = null

      await merchant.save()
      console.log("✅ Wallet unlocked and updated.")
    } else {
      console.log("⏳ Not matured yet or nothing to unlock.")
    }


    // Get merchant statistics
    const [totalDeposits, totalTransactions, totalCouponsRedeemed, lastTransaction] = await Promise.all([
      Deposit.aggregate([
        { $match: { merchantId: merchant._id, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.countDocuments({ merchantId: merchant._id }),
      CouponCode.countDocuments({
        merchantId: merchant._id,
        usedCount: { $gt: 0 },
      }),
      Transaction.findOne({ merchantId: merchant._id }).sort({ createdAt: -1 }),
    ])

    const stats = {
      totalDeposits: totalDeposits[0]?.total || 0,
      totalTransactions,
      totalCouponsRedeemed,
      lastTransactionDate: lastTransaction?.createdAt,
    }

    return NextResponse.json({
      merchant: {
        ...merchant.toObject(),
        stats,
      },
    })
  } catch (error) {
    console.error("Fetch merchant details error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = session.user;

    // Find agent
    const agent = await User.findById(payload.id);
    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 });
    }

    // Find and delete merchant only if belongs to agent
    const merchant = await Merchant.findOneAndDelete({
      _id: params.id,
      agentId: agent._id,
    });

    if (!merchant) {
      return NextResponse.json(
        { message: "Merchant not found" },
        { status: 404 }
      );
    }

    // Optionally delete linked user account too
    await User.findByIdAndDelete(merchant.userId);

    return NextResponse.json({
      message: "Merchant deleted successfully",
      deletedMerchantId: params.id,
    });
  } catch (error) {
    console.error("Delete merchant error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
