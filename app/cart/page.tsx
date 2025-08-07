"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return
    setIsUpdating(id)
    try {
      await updateQuantity(id, quantity)
      toast.success("Cart updated successfully")
    } catch (error) {
      toast.error("Failed to update cart")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id)
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      toast.success("Cart cleared successfully")
    } catch (error) {
      toast.error("Failed to clear cart")
    }
  }

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          {state.items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {state.items.length === 0 ? (
          // Empty cart
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Cart Items ({state.itemCount})</h2>

                  <div className="space-y-6">
                    {state.items.map((item: any, index) => (
                      <div key={item.id}>
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                            <Image
                              src={item.image || "/placeholder.svg?height=120&width=120"}
                              alt={item.name}
                              fill
                              className="object-contain rounded-lg"
                              sizes="(max-width: 640px) 112px, 128px"
                            />
                          </div>


                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{item.name}</h3>

                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                              {item.size && <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>}
                              {item.color && <span className="bg-gray-100 px-2 py-1 rounded">Color: {item.color}</span>}
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                In Stock: {item.stock}
                              </span>
                            </div>

                            <div className="flex flex-wrap justify-between items-center gap-4">
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 border-blue-200 hover:bg-blue-50 bg-transparent"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={isUpdating === item.id || item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>

                                <span className="w-10 text-center font-medium">{item.quantity}</span>

                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 border-blue-200 hover:bg-blue-50 bg-transparent"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={isUpdating === item.id || item.quantity >= item.stock}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <p className="text-base font-semibold text-gray-900">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">₹{item.price.toLocaleString()} each</p>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {index < state.items.length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky top-8">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                      <span className="font-medium">₹{state.total.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">
                        {state.total >= 499 ? "Free" : "₹50"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{Math.round(state.total * 0.18).toLocaleString()}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-base sm:text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        ₹
                        {(
                          state.total +
                          (state.total >= 499 ? 0 : 50) +
                          Math.round(state.total * 0.18)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link href="/checkout">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">Proceed to Checkout</Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 bg-transparent">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {state.total >= 499
                        ? "🎉 You qualify for free shipping!"
                        : `Add ₹${(499 - state.total).toLocaleString()} more for free shipping`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>


  )
}
