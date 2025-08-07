import { notFound } from "next/navigation"

import { CheckCircle, Package, Truck, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"

interface OrderConfirmationPageProps {
  params: {
    orderNumber: string
  }
}

async function getOrder(orderNumber: string) {
  await connectDB()

  const order = await Order.findOne({ order_number: orderNumber }).populate("user_id").lean()

  if (!order) {
    return null
  }

  return JSON.parse(JSON.stringify(order))
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await getOrder(params.orderNumber)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Order Number</h3>
                  <p className="text-gray-600">{order.order_number}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Date</h3>
                  <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Total Amount</h3>
                  <p className="text-2xl font-bold text-[#0042adef]">₹{order.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-gray-600">
                    <p>{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.address_line1}</p>
                    {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} -{" "}
                      {order.shipping_address.postal_code}
                    </p>
                    <p>📞 {order.shipping_address.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <Badge className="bg-orange-100 text-orange-800">Cash on Delivery</Badge>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Estimated delivery: 3-7 business days</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>Free delivery on orders above ₹499</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account">
              <Button className="bg-[#0042adef] hover:bg-[#0042ad]">View Order History</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

    </div>
  )
}
