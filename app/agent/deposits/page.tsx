"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Deposit {
  _id: string
  merchantId: {
    businessName: string
    userId: {
      name: string
      email: string
    }
  }
  amount: number
  status: string
  receiptNumber: string
  notes: string
  maturityDate: string
  createdAt: string
}

export default function AgentDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      const response = await fetch("/api/agent/deposits")
      const data = await response.json()
      setDeposits(data.deposits || [])
    } catch (error) {
      console.error("Failed to fetch deposits:", error)
    } finally {
      setLoading(false)
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

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch =
      deposit.merchantId.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.merchantId.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || deposit.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = filteredDeposits.reduce((sum, deposit) => sum + deposit.amount, 0)
  const confirmedAmount = filteredDeposits
    .filter((deposit) => deposit.status === "confirmed")
    .reduce((sum, deposit) => sum + deposit.amount, 0)

  if (loading) {
    return <div className="p-6">Loading deposits...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deposit Management</h1>
        <Link href="/agent/deposits/collect">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Collect Deposit
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDeposits.length}</div>
            <p className="text-xs text-muted-foreground">All time deposits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All deposits combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{confirmedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by merchant, receipt number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deposits List */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit History ({filteredDeposits.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDeposits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No deposits found</p>
                <Link href="/agent/deposits/collect">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Collect First Deposit
                  </Button>
                </Link>
              </div>
            ) : (
              filteredDeposits.map((deposit) => (
                <div key={deposit._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{deposit.merchantId.businessName}</h3>
                      <Badge className={getStatusColor(deposit.status)}>{deposit.status.toUpperCase()}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <p>Merchant: {deposit.merchantId.userId.name}</p>
                        <p>Email: {deposit.merchantId.userId.email}</p>
                        <p>Receipt: {deposit.receiptNumber}</p>
                      </div>
                      <div>
                        <p>Collected: {new Date(deposit.createdAt).toLocaleDateString()}</p>
                        <p>Maturity: {new Date(deposit.maturityDate).toLocaleDateString()}</p>
                        {deposit.notes && <p>Notes: {deposit.notes}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-green-600">₹{deposit.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{new Date(deposit.createdAt).toLocaleTimeString()}</p>
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
