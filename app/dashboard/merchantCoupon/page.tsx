"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Users, TrendingUp, Gift, Plus, BarChart3, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Coupon {
  _id: string
  code: string
  title: string
  description: string
  discountType: string
  discountValue: number
  minOrderAmount: number
  maxDiscount: number
  usageLimit: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  createdByRole: string
  merchantId: {
    _id: string
    businessName: string
  }
  createdBy: {
    _id: string
    name: string
  }
  redemptions: Array<{
    customerName: string
    customerPhone: string
    orderAmount: number
    discountAmount: number
    redeemedAt: string
  }>
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [creatorFilter, setCreatorFilter] = useState("all")
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  useEffect(() => {
    filterCoupons()
  }, [coupons, searchTerm, statusFilter, typeFilter, creatorFilter])

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/admin/merchantCoupon")
      const data = await response.json()
      setCoupons(data.coupons || [])
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCoupons = () => {
    let filtered = coupons

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coupon.merchantId.businessName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      const now = new Date()
      filtered = filtered.filter((coupon) => {
        const isExpired = new Date(coupon.validUntil) < now
        const isUsedUp = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit

        switch (statusFilter) {
          case "active":
            return coupon.isActive && !isExpired && !isUsedUp
          case "inactive":
            return !coupon.isActive
          case "expired":
            return isExpired
          case "used_up":
            return isUsedUp
          default:
            return true
        }
      })
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((coupon) => coupon.discountType === typeFilter)
    }

    // Creator filter
    if (creatorFilter !== "all") {
      filtered = filtered.filter((coupon) => coupon.createdByRole === creatorFilter)
    }

    setFilteredCoupons(filtered)
  }

  const toggleCouponStatus = async (couponId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/merchantCoupon/${couponId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (response.ok) {
        fetchCoupons()
      } else {
        alert("Failed to update coupon status")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    }
  }

  const deleteCoupon = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return

    try {
      const response = await fetch(`/api/admin/merchantCoupon/${couponId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCoupons()
      } else {
        alert("Failed to delete coupon")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    }
  }

  const getStatusColor = (coupon: Coupon) => {
    const now = new Date()
    const isExpired = new Date(coupon.validUntil) < now
    const isUsedUp = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit

    if (isExpired) return "bg-red-100 text-red-800"
    if (isUsedUp) return "bg-orange-100 text-orange-800"
    return coupon.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getStatusText = (coupon: Coupon) => {
    const now = new Date()
    const isExpired = new Date(coupon.validUntil) < now
    const isUsedUp = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit

    if (isExpired) return "EXPIRED"
    if (isUsedUp) return "USED UP"
    return coupon.isActive ? "ACTIVE" : "INACTIVE"
  }

  const activeCoupons = coupons.filter((c) => {
    const now = new Date()
    const isExpired = new Date(c.validUntil) < now
    const isUsedUp = c.usageLimit && c.usedCount >= c.usageLimit
    return c.isActive && !isExpired && !isUsedUp
  })

  const totalRedemptions = coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0)
  const totalDiscountGiven = coupons.reduce(
    (sum, coupon) => sum + coupon.redemptions.reduce((redemptionSum, r) => redemptionSum + r.discountAmount, 0),
    0,
  )

  if (loading) {
    return <div className="p-6">Loading coupons...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <div className="flex gap-3">
          <Link href="/dashboard/merchantCoupon/analytics">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard/merchantCoupon/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCoupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRedemptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount Given</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDiscountGiven.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="used_up">Used Up</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>

            <Select value={creatorFilter} onValueChange={setCreatorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by creator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Creators</SelectItem>
                <SelectItem value="admin">Admin Created</SelectItem>
                <SelectItem value="agent">Agent Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>Coupons ({filteredCoupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCoupons.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No coupons found</p>
            ) : (
              filteredCoupons.map((coupon) => (
                <div key={coupon._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{coupon.code}</h3>
                      <Badge className={getStatusColor(coupon)}>{getStatusText(coupon)}</Badge>
                      <Badge variant="outline">{coupon.createdByRole === "admin" ? "Admin" : "Agent"}</Badge>
                    </div>
                    <p className="font-medium">{coupon.title}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Merchant: {coupon.merchantId.businessName} | Created by: {coupon.createdBy?.name}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Discount:</span> {coupon.discountValue}
                        {coupon.discountType === "percentage" ? "%" : "₹"}
                      </div>
                      <div>
                        <span className="font-medium">Min Order:</span> ₹{coupon.minOrderAmount}
                      </div>
                      <div>
                        <span className="font-medium">Used:</span> {coupon.usedCount}/{coupon.usageLimit || "∞"}
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span>{" "}
                        {new Date(coupon.validUntil).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Total Discount:</span> ₹
                        {coupon.redemptions.reduce((sum, r) => sum + r.discountAmount, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCoupon(coupon)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Coupon Details: {selectedCoupon?.code}</DialogTitle>
                        </DialogHeader>
                        {selectedCoupon && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Basic Information</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Title:</span> {selectedCoupon.title}
                                  </p>
                                  <p>
                                    <span className="font-medium">Description:</span>{" "}
                                    {selectedCoupon.description || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-medium">Merchant:</span>{" "}
                                    {selectedCoupon.merchantId.businessName}
                                  </p>
                                  <p>
                                    <span className="font-medium">Created by:</span> {selectedCoupon?.createdBy.name} (
                                    {selectedCoupon.createdByRole})
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Discount Details</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Type:</span> {selectedCoupon.discountType}
                                  </p>
                                  <p>
                                    <span className="font-medium">Value:</span> {selectedCoupon.discountValue}
                                    {selectedCoupon.discountType === "percentage" ? "%" : "₹"}
                                  </p>
                                  <p>
                                    <span className="font-medium">Min Order:</span> ₹{selectedCoupon.minOrderAmount}
                                  </p>
                                  <p>
                                    <span className="font-medium">Max Discount:</span>{" "}
                                    {selectedCoupon.maxDiscount ? `₹${selectedCoupon.maxDiscount}` : "No limit"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Usage Statistics</h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-blue-50 rounded">
                                  <div className="font-bold text-lg">{selectedCoupon.usedCount}</div>
                                  <div className="text-gray-600">Times Used</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded">
                                  <div className="font-bold text-lg">
                                    ₹
                                    {selectedCoupon.redemptions
                                      .reduce((sum, r) => sum + r.discountAmount, 0)
                                      .toLocaleString()}
                                  </div>
                                  <div className="text-gray-600">Total Discount</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded">
                                  <div className="font-bold text-lg">
                                    {selectedCoupon.usageLimit
                                      ? `${selectedCoupon.usageLimit - selectedCoupon.usedCount}`
                                      : "∞"}
                                  </div>
                                  <div className="text-gray-600">Remaining Uses</div>
                                </div>
                              </div>
                            </div>

                            {selectedCoupon.redemptions.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Recent Redemptions</h4>
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                  {selectedCoupon.redemptions
                                    .slice(-5)
                                    .reverse()
                                    .map((redemption, index) => (
                                      <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                                        <div className="flex justify-between">
                                          <span>
                                            {redemption.customerName} ({redemption.customerPhone})
                                          </span>
                                          <span>{new Date(redemption.redeemedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-gray-600">
                                          Order: ₹{redemption.orderAmount} | Discount: ₹{redemption.discountAmount}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Link href={`/dashbaord/merchantCoupon/${coupon._id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCouponStatus(coupon._id, !coupon.isActive)}
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </Button>

                    <Button variant="destructive" size="sm" onClick={() => deleteCoupon(coupon._id)}>
                      Delete
                    </Button>
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
