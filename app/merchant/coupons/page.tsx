"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Users, TrendingUp, Gift } from "lucide-react"

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
  redemptions: Array<{
    customerName: string
    customerPhone: string
    orderAmount: number
    discountAmount: number
    redeemedAt: string
  }>
  createdByRole: string
}

export default function MerchantCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [redeemForm, setRedeemForm] = useState({
    customerName: "",
    customerPhone: "",
    orderAmount: "",
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/merchant/coupons")
      const data = await response.json()
      setCoupons(data.coupons || [])
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async (couponId: string) => {
    setRedeemLoading(true)
    try {
      const response = await fetch(`/api/merchant/coupons/${couponId}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(redeemForm),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Coupon redeemed successfully! Discount: ₹${data.discountAmount}`)
        setRedeemForm({ customerName: "", customerPhone: "", orderAmount: "" })
        fetchCoupons()
      } else {
        alert(data.message || "Failed to redeem coupon")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setRedeemLoading(false)
    }
  }

  const calculateDiscount = (coupon: Coupon, orderAmount: number) => {
    if (orderAmount < coupon.minOrderAmount) return 0

    let discount = 0
    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100
    } else {
      discount = coupon.discountValue
    }

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }

    return discount
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

  const activeCoupons = coupons.filter((c) => c.isActive && new Date(c.validUntil) > new Date())
  const totalRedemptions = coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0)
  const totalDiscountGiven = coupons.reduce(
    (sum, coupon) => sum + coupon?.redemptions?.reduce((redemptionSum, r) => redemptionSum + r.discountAmount, 0),
    0,
  )

  if (loading) {
    return <div className="p-6">Loading coupons...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Coupons</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {activeCoupons.length} Active Coupons
        </Badge>
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

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coupons.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No coupons available</p>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{coupon.code}</h3>
                      <Badge className={getStatusColor(coupon.isActive, coupon.validUntil)}>
                        {getStatusText(coupon.isActive, coupon.validUntil)}
                      </Badge>
                      <Badge variant="outline">By {coupon.createdByRole === "admin" ? "Admin" : "Agent"}</Badge>
                    </div>
                    <p className="font-medium">{coupon.title}</p>
                    {coupon.description && <p className="text-sm text-gray-600">{coupon.description}</p>}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-gray-600">
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
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={
                            !coupon.isActive ||
                            new Date(coupon.validUntil) < new Date() ||
                            (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
                          }
                          onClick={() => setSelectedCoupon(coupon)}
                        >
                          Redeem for Customer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Redeem Coupon: {selectedCoupon?.code}</DialogTitle>
                        </DialogHeader>
                        {selectedCoupon && (
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-semibold">{selectedCoupon.title}</h4>
                              <p className="text-sm text-gray-600">
                                {selectedCoupon.discountValue}
                                {selectedCoupon.discountType === "percentage" ? "% off" : "₹ off"}
                                {selectedCoupon.minOrderAmount > 0 &&
                                  ` on orders above ₹${selectedCoupon.minOrderAmount}`}
                              </p>
                            </div>

                            <div>
                              <Label htmlFor="customerName">Customer Name</Label>
                              <Input
                                id="customerName"
                                value={redeemForm.customerName}
                                onChange={(e) => setRedeemForm((prev) => ({ ...prev, customerName: e.target.value }))}
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="customerPhone">Customer Phone</Label>
                              <Input
                                id="customerPhone"
                                value={redeemForm.customerPhone}
                                onChange={(e) => setRedeemForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="orderAmount">Order Amount (₹)</Label>
                              <Input
                                id="orderAmount"
                                type="number"
                                value={redeemForm.orderAmount}
                                onChange={(e) => setRedeemForm((prev) => ({ ...prev, orderAmount: e.target.value }))}
                                required
                              />
                            </div>

                            {redeemForm.orderAmount && (
                              <div className="p-4 bg-green-50 rounded-lg">
                                <p className="font-semibold">
                                  Discount Amount: ₹
                                  {calculateDiscount(selectedCoupon, Number.parseFloat(redeemForm.orderAmount))}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Final Amount: ₹
                                  {Number.parseFloat(redeemForm.orderAmount) -
                                    calculateDiscount(selectedCoupon, Number.parseFloat(redeemForm.orderAmount))}
                                </p>
                              </div>
                            )}

                            <Button
                              onClick={() => handleRedeem(selectedCoupon._id)}
                              disabled={
                                redeemLoading ||
                                !redeemForm.customerName ||
                                !redeemForm.customerPhone ||
                                !redeemForm.orderAmount ||
                                Number.parseFloat(redeemForm.orderAmount) < selectedCoupon.minOrderAmount
                              }
                              className="w-full"
                            >
                              {redeemLoading ? "Redeeming..." : "Redeem Coupon"}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm">
                      View History ({coupon.usedCount})
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
