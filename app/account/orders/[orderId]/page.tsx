"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  MapPin,
  CreditCard,
  ShoppingCart,
  Star,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Image from "next/image"

interface OrderItem {
  product_id: string
  variation_id: string
  name: string
  quantity: number
  price: number
  image?: string
  size?: string
  color?: string
}

interface Address {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

interface Order {
  _id: string
  order_number: string
  total: number
  subtotal: number
  discount: number
  status: string
  payment_status: string
  payment_method: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  shipping_address: Address
  billing_address: Address
  tracking_number?: string
  shipping_carrier?: string
  estimated_delivery?: string
  coupon_code?: string
}

interface StatusStep {
  key: string
  label: string
  description: string
  icon: React.ReactNode
}

interface ReviewForm {
  rating: number
  title: string
  comment: string
}

export default function OrderDetailsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [animatedSteps, setAnimatedSteps] = useState<number>(0)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null)
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 5,
    title: "",
    comment: "",
  })
  const [reviewableItems, setReviewableItems] = useState<Set<string>>(new Set())

  const statusSteps: StatusStep[] = [
    {
      key: "pending",
      label: "Order Placed",
      description: "Your order has been received and is being processed",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      key: "confirmed",
      label: "Order Confirmed",
      description: "Your order has been confirmed and payment verified",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      key: "processing",
      label: "Processing",
      description: "Your order is being prepared for shipment",
      icon: <Package className="h-5 w-5" />,
    },
    {
      key: "shipped",
      label: "Shipped",
      description: "Your order is on its way to you",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      key: "delivered",
      label: "Delivered",
      description: "Your order has been successfully delivered",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ]

  useEffect(() => {
    if (session?.user?.id && params.orderId) {
      fetchOrderDetails()
    }
  }, [session, params.orderId])

  useEffect(() => {
    if (order) {
      animateStatusSteps()
      if (order.status === "delivered") {
        checkReviewableItems()
      }
    }
  }, [order])

  const checkReviewableItems = async () => {
    if (!order || !session?.user?.id) return

    const reviewable = new Set<string>()

    for (const item of order.items) {
      try {
        const response = await fetch(`/api/users/${session.user.id}/can-review/${item.product_id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.canReview) {
            reviewable.add(item.product_id)
          }
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error)
      }
    }

    setReviewableItems(reviewable)
  }

  const animateStatusSteps = () => {
    if (!order) return

    const currentStepIndex = getCurrentStepIndex(order.status)
    let step = 0

    const animateSteps = () => {
      if (step <= currentStepIndex) {
        setAnimatedSteps(step + 1)
        step++
        setTimeout(animateSteps, 800)
      }
    }

    setTimeout(animateSteps, 500)
  }

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${session?.user?.id}/orders/${params.orderId}`)

      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        toast.error("Failed to fetch order details")
        router.push("/account/orders")
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error)
      toast.error("Failed to fetch order details")
      router.push("/account/orders")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStepIndex = (status: string): number => {
    const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"]
    const index = statusOrder.indexOf(status)
    return index === -1 ? 0 : index
  }

  const getStepStatus = (
    stepIndex: number,
    currentStatus: string,
  ): "completed" | "current" | "upcoming" | "cancelled" => {
    if (currentStatus === "cancelled" || currentStatus === "returned") {
      return stepIndex === 0 ? "completed" : "cancelled"
    }

    const currentStepIndex = getCurrentStepIndex(currentStatus)

    if (stepIndex < currentStepIndex) return "completed"
    if (stepIndex === currentStepIndex) return "current"
    return "upcoming"
  }

  const handleDownloadInvoice = async () => {
    if (!order) return

    try {
      const response = await fetch(`/api/users/${session?.user?.id}/orders/${order._id}/invoice`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `invoice-${order.order_number}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success("Invoice downloaded successfully")
      } else {
        toast.error("Failed to download invoice")
      }
    } catch (error) {
      console.error("Failed to download invoice:", error)
      toast.error("Failed to download invoice")
    }
  }

  const handleOpenReviewDialog = (item: OrderItem) => {
    setSelectedProduct(item)
    setReviewForm({ rating: 5, title: "", comment: "" })
    setReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedProduct || !session?.user?.id) return

    try {
      const response = await fetch(`/api/products/${selectedProduct.product_id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      })

      if (response.ok) {
        toast.success("Review submitted successfully! It will be visible after admin verification.")
        setReviewDialogOpen(false)
        setSelectedProduct(null)
        setReviewForm({ rating: 5, title: "", comment: "" })
        // Remove from reviewable items
        setReviewableItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(selectedProduct.product_id)
          return newSet
        })
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "returned":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
        className={interactive ? "p-1 hover:scale-110 transition-transform" : ""}
        disabled={!interactive}
      >
        <Star
          className={`h-5 w-5 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
        />
      </button>
    ))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push("/account/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/account/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
            <p className="text-gray-600">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadInvoice} className="gap-2">
          <Download className="h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Animated Order Status Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={getPaymentStatusColor(order.payment_status)}>
                    Payment: {order.payment_status}
                  </Badge>
                </div>

                {/* Animated Status Flow */}
                <div className="relative">
                  {statusSteps.map((step, index) => {
                    const stepStatus = getStepStatus(index, order.status)
                    const isAnimated = index < animatedSteps
                    const isVisible = stepStatus !== "cancelled"

                    if (!isVisible) return null

                    return (
                      <div key={step.key} className="relative flex items-start pb-8 last:pb-0">
                        {/* Connecting Line */}
                        {index < statusSteps.length - 1 && isVisible && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200">
                            <div
                              className={`w-full transition-all duration-1000 ease-out ${
                                stepStatus === "completed" && isAnimated
                                  ? "h-full bg-green-500"
                                  : stepStatus === "current" && isAnimated
                                    ? "h-1/2 bg-blue-500"
                                    : "h-0"
                              }`}
                            />
                          </div>
                        )}

                        {/* Step Circle */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-800 ease-out transform ${
                            !isAnimated ? "scale-0 opacity-0" : "scale-100 opacity-100"
                          } ${
                            stepStatus === "completed"
                              ? "bg-green-500 border-green-500 text-white"
                              : stepStatus === "current"
                                ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                                : "bg-gray-100 border-gray-300 text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </div>

                        {/* Step Content */}
                        <div
                          className={`ml-4 flex-1 transition-all duration-800 delay-200 ease-out transform ${
                            !isAnimated ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-semibold ${
                                stepStatus === "completed" || stepStatus === "current"
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </h3>
                            {stepStatus === "completed" && (
                              <span className="text-sm text-gray-500">
                                {index === 0
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : index === getCurrentStepIndex(order.status)
                                    ? new Date(order.updatedAt).toLocaleDateString()
                                    : ""}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              stepStatus === "completed" || stepStatus === "current" ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {step.description}
                          </p>

                          {/* Special content for shipped status */}
                          {step.key === "shipped" && stepStatus === "completed" && order.tracking_number && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Truck className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Tracking Information</span>
                              </div>
                              <p className="text-sm text-blue-800">
                                Tracking: <span className="font-mono">{order.tracking_number}</span>
                              </p>
                              {order.shipping_carrier && (
                                <p className="text-sm text-blue-800">Carrier: {order.shipping_carrier}</p>
                              )}
                              {order.estimated_delivery && (
                                <p className="text-sm text-blue-800">
                                  Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Cancelled/Returned Status */}
                {(order.status === "cancelled" || order.status === "returned") && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-900">
                        Order {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-red-800">
                      {order.status === "cancelled"
                        ? "Your order has been cancelled. If you were charged, a refund will be processed within 3-5 business days."
                        : "Your order has been returned. A refund will be processed within 3-5 business days."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</p>

                      {/* Review Button for Delivered Orders */}
                      {order.status === "delivered" && reviewableItems.has(item.product_id) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          onClick={() => handleOpenReviewDialog(item)}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
                <p className="text-sm text-gray-600">Phone: {order.shipping_address.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString()}</span>
                  </div>
                  {order.coupon_code && (
                    <div className="text-sm text-gray-600">
                      Coupon: <span className="font-mono">{order.coupon_code}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{Math.round((order.total - order.discount) * 0.18).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium">{order.payment_method.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge variant="outline" className={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.billing_address.full_name}</p>
                <p>{order.billing_address.address_line1}</p>
                {order.billing_address.address_line2 && <p>{order.billing_address.address_line2}</p>}
                <p>
                  {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                </p>
                <p>{order.billing_address.country}</p>
                <p className="text-gray-600">Phone: {order.billing_address.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Write a Review
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-white rounded overflow-hidden">
                  {selectedProduct.image ? (
                    <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-gray-400 m-3" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{selectedProduct.name}</h4>
                  <p className="text-xs text-gray-600">₹{selectedProduct.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-1">
                  {renderStars(reviewForm.rating, true, (rating) => setReviewForm({ ...reviewForm, rating }))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <Input
                  placeholder="Summarize your review"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!reviewForm.title.trim() || !reviewForm.comment.trim()}
                >
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setReviewDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">Your review will be visible after admin verification</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
