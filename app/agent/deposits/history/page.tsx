"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download, Calendar } from "lucide-react"
import Link from "next/link"

interface DepositHistory {
  _id: string
  merchantId: {
    businessName: string
    userId: {
      name: string
    }
  }
  amount: number
  status: string
  receiptNumber: string
  notes: string
  maturityDate: string
  createdAt: string
}

export default function DepositsHistoryPage() {
  const [deposits, setDeposits] = useState<DepositHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    setDateFrom(thirtyDaysAgo.toISOString().split("T")[0])
    setDateTo(today.toISOString().split("T")[0])

    fetchDeposits()
  }, [])

  const fetchDeposits = async (from?: string, to?: string) => {
    try {
      const params = new URLSearchParams()
      if (from) params.append("from", from)
      if (to) params.append("to", to)

      const response = await fetch(`/api/agent/deposits?${params}`)
      const data = await response.json()
      setDeposits(data.deposits || [])
    } catch (error) {
      console.error("Failed to fetch deposit history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = () => {
    setLoading(true)
    fetchDeposits(dateFrom, dateTo)
  }

  const downloadHistory = async () => {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append("from", dateFrom)
      if (dateTo) params.append("to", dateTo)

      const response = await fetch(`/api/agent/deposits/export?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `deposit-history-${dateFrom}-to-${dateTo}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download history:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalAmount = deposits.reduce((sum, deposit) => sum + deposit.amount, 0)
  const confirmedAmount = deposits
    .filter((deposit) => deposit.status === "confirmed")
    .reduce((sum, deposit) => sum + deposit.amount, 0)

  if (loading) {
    return <div className="p-6">Loading deposit history...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/agent/deposits">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deposits
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Deposit Collection History</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deposits.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{confirmedAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deposits.length > 0
                ? Math.round((deposits.filter((d) => d.status === "confirmed").length / deposits.length) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filter by Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <Button onClick={handleDateFilter}>Apply Filter</Button>
            <Button variant="outline" onClick={downloadHistory}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Records ({deposits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deposits.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No deposits found for the selected period</p>
            ) : (
              deposits.map((deposit) => (
                <div key={deposit._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{deposit.merchantId.businessName}</h3>
                      <Badge className={getStatusColor(deposit.status)}>{deposit.status.toUpperCase()}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <p>Merchant: {deposit.merchantId.userId.name}</p>
                        <p>Receipt: {deposit.receiptNumber}</p>
                        <p>Collection Date: {new Date(deposit.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p>Maturity Date: {new Date(deposit.maturityDate).toLocaleDateString()}</p>
                        <p>Time: {new Date(deposit.createdAt).toLocaleTimeString()}</p>
                        {deposit.notes && <p>Notes: {deposit.notes}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-green-600">₹{deposit.amount.toLocaleString()}</p>
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
