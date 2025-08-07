"use client"

import { useEffect, useState } from "react"
import { X, ShoppingCart, Heart, Eye, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"

interface ProductActionToastProps {
  product: {
    _id: string
    title: string
    slug: string
    price: number
    compareAtPrice?: number
    image: string
    quantity?: number
  } | null
  action: "cart" | "wishlist" | null
  isVisible: boolean
  onClose: () => void
}

export function ProductActionToast({ product, action, isVisible, onClose }: ProductActionToastProps) {
  const { state: cartState } = useCart()
  const { state: wishlistState } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        onClose()
      }, 8000) // Auto close after 8 seconds
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
    }
  }, [isVisible, onClose])

  if (!isVisible || !product) return null

  const discountPercentage = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-300" onClick={onClose} />

      {/* Toast Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-green-50">
            <div className="flex items-center gap-3">
              {action === "cart" ? (
                <>
                  <div className="p-2 bg-green-100 rounded-full">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Added to Cart!</h3>
                    <p className="text-sm text-green-600">Item successfully added</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-red-100 rounded-full">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Added to Wishlist!</h3>
                    <p className="text-sm text-red-600">Item saved for later</p>
                  </div>
                </>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="flex-1 p-6 space-y-6">
            {/* Product Info */}
            <div className="flex gap-4">
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">{product.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.compareAtPrice && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.compareAtPrice.toLocaleString()}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {discountPercentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                {product.quantity && <p className="text-sm text-gray-600 mt-1">Quantity: {product.quantity}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {action === "cart" ? (
                <>
                  <Link href="/checkout" onClick={onClose}>
                    <Button className="w-full bg-[#0042adef] hover:bg-[#0042ad] text-white h-12 text-base">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={onClose}>
                    <Button variant="outline" className="w-full h-12 text-base bg-transparent">
                      <Eye className="h-5 w-5 mr-2" />
                      View Cart ({cartState.itemCount} items)
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/wishlist" onClick={onClose}>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-base">
                      <Heart className="h-5 w-5 mr-2" />
                      View Wishlist ({wishlistState.itemCount} items)
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base bg-transparent"
                    onClick={() => {
                      // Add to cart functionality
                      onClose()
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </>
              )}
            </div>

            {/* Product Link */}
            <Link href={`/products/${product.slug}`} onClick={onClose}>
              <Button variant="ghost" className="w-full text-[#0042adef] hover:bg-blue-50">
                <Eye className="h-4 w-4 mr-2" />
                View Product Details
              </Button>
            </Link>

              /
            {/* Cart/Wishlist Summary changes for delievery charges */}
            {action === "cart" ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium mb-3">Cart Summary</h5>

                {/* Shipping Calculation */}
                {(() => {
                  const isShippingFree = cartState.total >= 19999;
                  const shippingCharge = isShippingFree ? 0 : 199;
                  const finalTotal = cartState.total + shippingCharge;

                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Items ({cartState.itemCount})</span>
                        <span>₹{cartState.total.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className={isShippingFree ? "text-green-600" : "text-red-600"}>
                          {isShippingFree ? "Free" : `₹${shippingCharge}`}
                        </span>
                      </div>

                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        🚚 {isShippingFree ? "Free delivery on orders above ₹19,999" : "₹199 delivery charge on orders below ₹19,999"}
                      </p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium mb-2">Wishlist</h5>
                <p className="text-sm text-gray-600">
                  You have {wishlistState.itemCount} item{wishlistState.itemCount !== 1 ? "s" : ""} saved for later
                </p>
                <p className="text-xs text-gray-500 mt-2">💝 Items in wishlist are saved across devices</p>
              </div>
            )}


            {/* Recommendations */}
            <div className="border-t pt-4">
              <h5 className="font-medium mb-3 text-gray-900">You might also like</h5>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">Related Product {item}</p>
                      <p className="text-sm text-gray-600">₹{(15000 + item * 1000).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50">
            <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-800" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
