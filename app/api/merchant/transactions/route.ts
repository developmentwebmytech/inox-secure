import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/Transaction"
import  WalletTransaction  from "@/lib/models/WalletTransaction"
import { Merchant } from "@/lib/models/Merchant"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "merchant") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    // Find merchant
    const merchant = await Merchant.findOne({ userId: payload.id })
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const searchTerm = searchParams.get("search") || ""
    const typeFilter = searchParams.get("type") || "all"
    const statusFilter = searchParams.get("status") || "all"

    const skip = (page - 1) * limit

    const commonQuery = { merchant_id: payload.id }

    // Build query for regular transactions
    const transactionQuery: any = { ...commonQuery }
    if (typeFilter !== "all" && typeFilter !== "wallet_topup") {
      transactionQuery.type = typeFilter
    }
    if (statusFilter !== "all") {
      transactionQuery.status = statusFilter
    }
    if (searchTerm) {
      transactionQuery.$or = [
        { description: { $regex: searchTerm, $options: "i" } },
        { referenceId: { $regex: searchTerm, $options: "i" } },
      ]
    }

    // Build query for wallet transactions
    const walletTransactionQuery: any = { ...commonQuery }
    if (typeFilter !== "all" && typeFilter === "wallet_topup") {
      // Only include wallet topup if specifically filtered
    } else if (typeFilter !== "all" && typeFilter !== "wallet_topup") {
      // Exclude wallet topup if other types are filtered
      walletTransactionQuery._id = null // Ensure no wallet transactions are returned
    }
    if (statusFilter !== "all") {
      walletTransactionQuery.status = statusFilter
    }
    if (searchTerm) {
      walletTransactionQuery.$or = [
        { description: { $regex: searchTerm, $options: "i" } },
        { phonepeTransactionId: { $regex: searchTerm, $options: "i" } },
      ]
    }

    let regularTransactions: any = []
    let walletTransactions :any= []
    let totalRegularTransactions = 0
    let totalWalletTransactions = 0

    if (typeFilter === "all" || (typeFilter !== "all" && typeFilter !== "wallet_topup")) {
      regularTransactions = await Transaction.find(transactionQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
      totalRegularTransactions = await Transaction.countDocuments(transactionQuery)
    }

    if (typeFilter === "all" || typeFilter === "wallet_topup") {
      walletTransactions = await WalletTransaction.find(walletTransactionQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
      totalWalletTransactions = await WalletTransaction.countDocuments(walletTransactionQuery)
    }

    // Map wallet transactions to a similar structure for consistent display
    const mappedWalletTransactions = walletTransactions.map((wt:any) => ({
      _id: wt._id,
      type: "wallet_topup",
      amount: wt.amount,
      status: wt.status,
      description: `Wallet Top-up via ${wt.payment_method}`,
      referenceId: wt.phonepeTransactionId || wt._id.toString(),
      createdAt: wt.createdAt,
    }))

    // Combine all transactions and sort by createdAt (re-sort after fetching paginated data)
    const allTransactions = [...regularTransactions, ...mappedWalletTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    // Calculate total count for pagination
    let totalCount = 0
    if (typeFilter === "all") {
      totalCount = totalRegularTransactions + totalWalletTransactions
    } else if (typeFilter === "wallet_topup") {
      totalCount = totalWalletTransactions
    } else {
      totalCount = totalRegularTransactions
    }

    return NextResponse.json({ transactions: allTransactions, totalCount })
  } catch (error) {
    console.error("Fetch transactions error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
