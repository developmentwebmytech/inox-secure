"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Download } from "lucide-react"
import Link from "next/link"

interface Transaction {
  _id: string
  type: "deposit" | "withdrawal" | "coupon_redemption"
  amount: number
  description: string
  status: "completed" | "pending" | "failed"
  createdAt: string
  couponCode?: string
  customerName?: string
  customerPhone?: string
}

interface MerchantInfo {
  _id: string
  businessName: string
  businessType: string
  userId: {
    name: string
    email: string
  }
}

export default function MerchantTransactionsPage() {
  const params = useParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [merchant, setMerchant] = useState<MerchantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [transactionsRes, merchantRes] = await Promise.all([
        fetch(`/api/agent/merchants/${params.id}/transactions`),
        fetch(`/api/agent/merchants/${params.id}`),
      ])

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData.transactions)
      }

      if (merchantRes.ok) {
        const merchantData = await merchantRes.json()
        setMerchant(merchantData.merchant)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/agent/merchants/${params.id}/transactions/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${merchant?.businessName || "merchant"}-transactions.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-blue-100 text-blue-800"
      case "withdrawal":
        return "bg-orange-100 text-orange-800"
      case "coupon_redemption":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.couponCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  const completedTransactions = filteredTransactions.filter((t) => t.status === "completed").length

  if (loading) {
    return <div className="p-6">Loading transactions...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/agent/merchants/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          {merchant && <p className="text-gray-600">{merchant.businessName}</p>}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredTransactions.length}</div>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{completedTransactions}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">₹{totalAmount.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {filteredTransactions.filter((t) => t.type === "coupon_redemption").length}
            </div>
            <p className="text-sm text-gray-600">Coupon Redemptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="coupon_redemption">Coupon Redemptions</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No transactions found</div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(transaction.type)}>
                          {transaction.type.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status.toUpperCase()}</Badge>
                      </div>
                      <p className="font-medium">{transaction.description}</p>
                      {transaction.couponCode && (
                        <p className="text-sm text-gray-600">Coupon: {transaction.couponCode}</p>
                      )}
                      {transaction.customerName && (
                        <p className="text-sm text-gray-600">
                          Customer: {transaction.customerName}
                          {transaction.customerPhone && ` (${transaction.customerPhone})`}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "deposit"
                            ? "text-green-600"
                            : transaction.type === "withdrawal"
                              ? "text-red-600"
                              : "text-blue-600"
                        }`}
                      >
                        {transaction.type === "withdrawal" ? "-" : "+"}₹{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
