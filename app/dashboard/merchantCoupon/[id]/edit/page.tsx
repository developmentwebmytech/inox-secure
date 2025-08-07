"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
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
  validFrom: string
  validUntil: string
  isActive: boolean
  merchantId: {
    _id: string
    businessName: string
    userId: {
      name: string
    }
  }
}

export default function EditCouponPage() {
  const router = useRouter()
  const params = useParams()
  const couponId = params.id as string

  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchCoupon()
  }, [couponId])

  const fetchCoupon = async () => {
    try {
      const response = await fetch(`/api/admin/merchantCoupon/${couponId}`)
      const data = await response.json()

      if (response.ok) {
        setCoupon(data.coupon)
        setFormData({
          title: data.coupon.title,
          description: data.coupon.description || "",
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue.toString(),
          minOrderAmount: data.coupon.minOrderAmount.toString(),
          maxDiscount: data.coupon.maxDiscount?.toString() || "",
          usageLimit: data.coupon.usageLimit?.toString() || "",
          validFrom: new Date(data.coupon.validFrom).toISOString().slice(0, 16),
          validUntil: new Date(data.coupon.validUntil).toISOString().slice(0, 16),
          isActive: data.coupon.isActive,
        })
      } else {
        setError("Failed to fetch coupon details")
      }
    } catch (error) {
      setError("An error occurred while fetching coupon details")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/admin/merchantCoupon/${couponId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Coupon updated successfully!")
        setTimeout(() => {
          router.push("/dashboard/merchantCoupon")
        }, 2000)
      } else {
        setError(data.message || "Failed to update coupon")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return <div className="p-6">Loading coupon details...</div>
  }

  if (!coupon) {
    return <div className="p-6">Coupon not found</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/merchantCoupon">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Coupons
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Coupon: {coupon.code}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
          <p className="text-sm text-gray-600">
            Merchant: {coupon.merchantId.businessName} ({coupon.merchantId.userId.name})
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div>
              <Label htmlFor="title">Coupon Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the offer..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleInputChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountValue">
                  Discount Value {formData.discountType === "percentage" ? "(%)" : "(₹)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => handleInputChange("discountValue", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => handleInputChange("minOrderAmount", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maxDiscount">Maximum Discount (₹)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => handleInputChange("maxDiscount", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valid From</Label>
                <Input
                  id="validFrom"
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange("validFrom", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => handleInputChange("validUntil", e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Updating Coupon..." : "Update Coupon"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
