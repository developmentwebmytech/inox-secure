"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, TrendingUp } from "lucide-react"

interface CollectionReport {
  _id: string
  merchantId: {
    businessName: string
    userId: {
      name: string
    }
  }
  amount: number
  receiptNumber: string
  status: string
  createdAt: string
  notes: string
}

interface ReportSummary {
  totalCollections: number
  totalAmount: number
  confirmedAmount: number
  pendingAmount: number
}

export default function CollectionReportsPage() {
  const [reports, setReports] = useState<CollectionReport[]>([])
  const [summary, setSummary] = useState<ReportSummary>({
    totalCollections: 0,
    totalAmount: 0,
    confirmedAmount: 0,
    pendingAmount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    setDateFrom(thirtyDaysAgo.toISOString().split("T")[0])
    setDateTo(today.toISOString().split("T")[0])

    fetchReports()
  }, [])

  const fetchReports = async (from?: string, to?: string) => {
    try {
      const params = new URLSearchParams()
      if (from) params.append("from", from)
      if (to) params.append("to", to)

      const response = await fetch(`/api/agent/reports/collections?${params}`)
      const data = await response.json()

      setReports(data.reports || [])
      setSummary(
        data.summary || {
          totalCollections: 0,
          totalAmount: 0,
          confirmedAmount: 0,
          pendingAmount: 0,
        },
      )
    } catch (error) {
      console.error("Failed to fetch collection reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = () => {
    setLoading(true)
    fetchReports(dateFrom, dateTo)
  }

  const downloadReport = async () => {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append("from", dateFrom)
      if (dateTo) params.append("to", dateTo)

      const response = await fetch(`/api/agent/reports/collections/export?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `collection-report-${dateFrom}-to-${dateTo}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download report:", error)
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

  if (loading) {
    return <div className="p-6">Loading collection reports...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Collection Reports</h1>
        <Button onClick={downloadReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCollections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{summary.confirmedAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{summary.pendingAmount.toLocaleString()}</div>
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
          </div>
        </CardContent>
      </Card>

      {/* Collections List */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Details ({reports.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No collections found for the selected period</p>
            ) : (
              reports.map((report) => (
                <div key={report._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{report.merchantId.businessName}</h3>
                      <Badge className={getStatusColor(report.status)}>{report.status.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Merchant: {report.merchantId.userId.name}</p>
                    <p className="text-sm text-gray-600">Receipt: {report.receiptNumber}</p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(report.createdAt).toLocaleDateString()} at{" "}
                      {new Date(report.createdAt).toLocaleTimeString()}
                    </p>
                    {report.notes && <p className="text-sm text-gray-600">Notes: {report.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{report.amount.toLocaleString()}</p>
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
