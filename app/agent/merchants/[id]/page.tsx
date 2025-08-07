"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Building, Phone, Mail, Wallet, MapPin } from "lucide-react"
import Link from "next/link"

interface MerchantDetails {
  _id: string
  businessName: string
  businessType: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  gstNumber?: string
  panNumber?: string
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
  updatedAt: string
  stats: {
    totalDeposits: number
    totalTransactions: number
    totalCouponsRedeemed: number
    lastTransactionDate?: string
  }
}

export default function MerchantDetailsPage() {
  const params = useParams()
  const [merchant, setMerchant] = useState<MerchantDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMerchantDetails()
  }, [])

  const fetchMerchantDetails = async () => {
    try {
      const response = await fetch(`/api/agent/merchants/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMerchant(data.merchant)
      }
    } catch (error) {
      console.error("Failed to fetch merchant details:", error)
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

  if (loading) {
    return <div className="p-6">Loading merchant details...</div>
  }

  if (!merchant) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Merchant not found</p>
          <Link href="/agent/merchants">
            <Button className="mt-4">Back to Merchants</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/agent/merchants">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Merchant Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{merchant.businessName}</h2>
                <Badge className={getStatusColor(merchant.status)}>{merchant.status.toUpperCase()}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Type</label>
                  <p className="font-medium">{merchant.businessType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="font-medium">{new Date(merchant.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Business Address</label>
                <p className="font-medium flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                  {merchant.businessAddress}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Phone</label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {merchant.businessPhone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Email</label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {merchant.businessEmail}
                  </p>
                </div>
              </div>

              {(merchant.gstNumber || merchant.panNumber) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {merchant.gstNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">GST Number</label>
                      <p className="font-medium">{merchant.gstNumber}</p>
                    </div>
                  )}
                  {merchant.panNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">PAN Number</label>
                      <p className="font-medium">{merchant.panNumber}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Owner Name</label>
                  <p className="font-medium">{merchant.userId.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Owner Email</label>
                  <p className="font-medium">{merchant.userId.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Owner Phone</label>
                <p className="font-medium">{merchant.userId.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">₹{merchant.wallet.balance.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deposits</span>
                <span className="font-semibold">₹{merchant.stats.totalDeposits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Transactions</span>
                <span className="font-semibold">{merchant.stats.totalTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coupons Redeemed</span>
                <span className="font-semibold">{merchant.stats.totalCouponsRedeemed}</span>
              </div>
              {merchant.stats.lastTransactionDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Transaction</span>
                  <span className="font-semibold">
                    {new Date(merchant.stats.lastTransactionDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {merchant.status === "approved" && (
            <div className="space-y-3">
              <Link href="/agent/deposits/collect">
                <Button className="w-full">Collect Deposit</Button>
              </Link>
              <Link href={`/agent/merchants/${merchant._id}/transactions`}>
                <Button variant="outline" className="w-full bg-transparent">
                  View Transactions
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
