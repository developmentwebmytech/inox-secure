"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Coupon {
  _id: string
  code: string
  title: string
  description: string
  discountType: string
  discountValue: number
  usageLimit: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  merchantId: {
    businessName: string
    userId: {
      name: string
    }
  }
  createdAt: string
}

export default function AgentCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/agent/coupons")
      const data = await response.json()
      setCoupons(data.coupons || [])
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
      toast.error("Failed to fetch coupons")
    } finally {
      setLoading(false)
    }
  }

  const toggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/agent/coupons/${couponId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Coupon ${!currentStatus ? "activated" : "deactivated"} successfully`)
        fetchCoupons()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update coupon")
      }
    } catch (error) {
      console.error("Failed to toggle coupon status:", error)
      toast.error("Failed to update coupon")
    }
  }

  const deleteCoupon = async (couponId: string, usedCount: number) => {
    if (usedCount > 0) {
      toast.error("Cannot delete coupon that has been redeemed")
      return
    }

    if (!confirm("Are you sure you want to delete this coupon?")) return

    try {
      const response = await fetch(`/api/agent/coupons/${couponId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Coupon deleted successfully")
        fetchCoupons()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to delete coupon")
      }
    } catch (error) {
      console.error("Failed to delete coupon:", error)
      toast.error("Failed to delete coupon")
    }
  }

  const getStatusColor = (isActive: boolean, validUntil: string) => {
    const isExpired = new Date(validUntil) < new Date()
    if (isExpired) return "bg-red-100 text-red-800"
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getStatusText = (isActive: boolean, validUntil: string) => {
    const isExpired = new Date(validUntil) < new Date()
    if (isExpired) return "EXPIRED"
    return isActive ? "ACTIVE" : "INACTIVE"
  }

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.merchantId.businessName.toLowerCase().includes(searchTerm.toLowerCase())

    const isExpired = new Date(coupon.validUntil) < new Date()
    let matchesStatus = true

    if (statusFilter === "active") matchesStatus = coupon.isActive && !isExpired
    else if (statusFilter === "inactive") matchesStatus = !coupon.isActive && !isExpired
    else if (statusFilter === "expired") matchesStatus = isExpired

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="p-6">Loading coupons...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <Link href="/agent/coupons/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{coupons.length}</div>
            <p className="text-sm text-gray-600">Total Coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {coupons.filter((c) => c.isActive && new Date(c.validUntil) > new Date()).length}
            </div>
            <p className="text-sm text-gray-600">Active Coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</div>
            <p className="text-sm text-gray-600">Total Redemptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {coupons.filter((c) => new Date(c.validUntil) < new Date()).length}
            </div>
            <p className="text-sm text-gray-600">Expired Coupons</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search coupons..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>My Coupons ({filteredCoupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No coupons found</p>
                <Link href="/agent/coupons/create">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Coupon
                  </Button>
                </Link>
              </div>
            ) : (
              filteredCoupons.map((coupon) => (
                <div key={coupon._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{coupon.code}</h3>
                      <Badge className={getStatusColor(coupon.isActive, coupon.validUntil)}>
                        {getStatusText(coupon.isActive, coupon.validUntil)}
                      </Badge>
                      {coupon.usedCount > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {coupon.usedCount} Redeemed
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{coupon.title}</p>
                    <p className="text-sm text-gray-600">Merchant: {coupon.merchantId.businessName}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        Discount: {coupon.discountValue}
                        {coupon.discountType === "percentage" ? "%" : "₹"}
                      </span>
                      <span>
                        Used: {coupon.usedCount}/{coupon.usageLimit || "∞"}
                      </span>
                      <span>Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                      disabled={new Date(coupon.validUntil) < new Date()}
                    >
                      {coupon.isActive ? (
                        <ToggleRight className="w-4 h-4 mr-2" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-2" />
                      )}
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCoupon(coupon._id, coupon.usedCount)}
                      disabled={coupon.usedCount > 0}
                      title={coupon.usedCount > 0 ? "Cannot delete redeemed coupon" : "Delete coupon"}
                    >
                      {coupon.usedCount > 0 ? (
                        <AlertCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
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
