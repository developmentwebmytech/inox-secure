"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Eye } from "lucide-react"
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
  wallet: {
    balance: number
  }
  createdAt: string
}

export default function AgentMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchMerchants()
  }, [])

  const fetchMerchants = async () => {
    try {
      const response = await fetch("/api/agent/merchants")
      const data = await response.json()
      setMerchants(data.merchants || [])
    } catch (error) {
      console.error("Failed to fetch merchants:", error)
    } finally {
      setLoading(false)
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

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.userId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="p-6">Loading merchants...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Merchants</h1>
        <Link href="/agent/merchants/add">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Merchant
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-medium mb-4">All Merchants ({merchants.length})</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                    <p className="text-sm text-gray-600">Owner: {merchant.userId.name}</p>
                    <p className="text-sm text-gray-600">Email: {merchant.userId.email}</p>
                    <p className="text-sm text-gray-600">Phone: {merchant.userId.phone}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Wallet: ₹{merchant.wallet.balance.toLocaleString()}</span>
                      <span>Registered: {new Date(merchant.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/agent/merchants/${merchant._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {merchant.status === "approved" && (
                      <Link href="/agent/deposits/collect">
                        <Button size="sm">Collect Deposit</Button>
                      </Link>
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
