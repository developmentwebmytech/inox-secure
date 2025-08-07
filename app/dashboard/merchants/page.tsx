"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface Merchant {
  _id: string
  businessName: string
  businessType: string
  status: string
  userId: {
    name: string
    email: string
    phone: string
  }
  agentId: {
    name: string
    email: string
  }
  wallet: {
    balance: number
  }
  createdAt: string
}

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchMerchants()
  }, [])

  const fetchMerchants = async () => {
    try {
      const response = await fetch("/api/admin/merchants")
      const data = await response.json()
      setMerchants(data.merchants || [])
    } catch (error) {
      console.error("Failed to fetch merchants:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (merchantId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchMerchants()
      }
    } catch (error) {
      console.error(`Failed to ${action} merchant:`, error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="p-6">Loading merchants...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Merchants Management</h1>
        <Link href="/dashboard/merchants/pending">
          <Button>
            <CheckCircle className="w-4 h-4 mr-2" />
            Pending Approvals
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search merchants..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMerchants.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No merchants found</p>
            ) : (
              filteredMerchants.map((merchant) => (
                <div key={merchant._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{merchant.businessName}</h3>
                      <Badge className={getStatusColor(merchant.status)}>{merchant.status.toUpperCase()}</Badge>
                      <Badge variant="outline">{merchant.businessType}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <p>Owner: {merchant.userId?.name}</p>
                        <p>Email: {merchant.userId?.email}</p>
                        <p>Phone: {merchant.userId?.phone}</p>
                      </div>
                      <div>
                        <p>Agent: {merchant.agentId?.name}</p>
                        <p>Wallet: ₹{merchant.wallet?.balance.toLocaleString()}</p>
                        <p>Registered: {new Date(merchant?.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {merchant.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleStatusChange(merchant._id, "approve")}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusChange(merchant._id, "reject")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
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
