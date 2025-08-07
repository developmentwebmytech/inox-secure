"use client"

import { useState } from "react"
import { X, Minus, Plus, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useProductAction } from "@/contexts/ProductActionContext"

interface ProductQuickViewProps {
  product: {
    _id: string
    title: string
    slug: string
    description: string
    images: Array<{ url: string; altText?: string }>
    variants: Array<{
      _id: string
      title: string
      price: number
      compareAtPrice?: number
      inventoryQuantity: number
    }>
    brand?: { name: string }
    category?: { name: string }
  }
  isOpen: boolean
  onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const { addToCart, state: cartState } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { showProductAction } = useProductAction()

  if (!isOpen) return null

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.title,
      price: selectedVariant.price,
      image: product.images[0]?.url || "",
      quantity,
    })

    // Show the big product action toast
    showProductAction(
      {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice,
        image: product.images[0]?.url || "",
        quantity,
      },
      "cart",
    )

    onClose()
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist({
        id: product._id,
        productId: product._id,
        name: product.title,
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice,
        image: product.images[0]?.url || "",
        inStock: selectedVariant.inventoryQuantity > 0,
      })

      // Show the big product action toast for wishlist
      showProductAction(
        {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: selectedVariant.price,
          compareAtPrice: selectedVariant.compareAtPrice,
          image: product.images[0]?.url || "",
        },
        "wishlist",
      )
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]?.url || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                  {product.brand && <p className="text-sm text-gray-600">Brand: {product.brand.name}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">₹{selectedVariant.price.toLocaleString()}</span>
                  {selectedVariant.compareAtPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{selectedVariant.compareAtPrice.toLocaleString()}
                      </span>
                      <Badge variant="destructive">
                        {Math.round((1 - selectedVariant.price / selectedVariant.compareAtPrice) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                <p className="text-gray-600 text-sm">{product.description}</p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Availability:</p>
                  <Badge variant={selectedVariant.inventoryQuantity > 0 ? "default" : "destructive"}>
                    {selectedVariant.inventoryQuantity > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Quantity:</p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-[#0042adef] hover:bg-[#0042ad]"
                    onClick={handleAddToCart}
                    disabled={selectedVariant.inventoryQuantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" onClick={handleWishlistToggle}>
                    <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product._id) ? "fill-current text-red-500" : ""}`} />
                    {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cart Total:</span>
              <span className="text-lg font-bold">₹{cartState.total.toLocaleString()}</span>
            </div>
            <div className="flex space-x-3">
              <Link href="/cart" className="flex-1" onClick={onClose}>
                <Button variant="outline" className="w-full bg-transparent">
                  View Cart ({cartState.itemCount})
                </Button>
              </Link>
              <Link href="/checkout" className="flex-1" onClick={onClose}>
                <Button className="w-full bg-[#0042adef] hover:bg-[#0042ad]">Checkout</Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 text-center">Free delivery on orders above ₹499</p>
          </div>
        </div>
      </div>
    </div>
  )
}
