"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { ProductQuickView } from "./ProductQuickView"
import { useProductAction } from "@/contexts/ProductActionContext"

interface ProductCardProps {
  product: {
    _id: string
    title: string
    slug: string
    images: Array<{ url: string; altText?: string }>
    variants: Array<{
      _id: string
      title: string
      price: number
      compareAtPrice?: number
      inventoryQuantity: number
    }>
    isHotDeal?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { showProductAction } = useProductAction()

  const mainVariant = product.variants[0]
  const isInWishlistState = isInWishlist(product._id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      productId: product._id,
      variantId: mainVariant._id,
      name: product.title,
      price: mainVariant.price,
      image: product.images[0]?.url || "",
      quantity: 1,
    })

    // Show the big product action toast
    showProductAction(
      {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: mainVariant.price,
        compareAtPrice: mainVariant.compareAtPrice,
        image: product.images[0]?.url || "",
        quantity: 1,
      },
      "cart",
    )
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlistState) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist({
        id: product._id,
        productId: product._id,
        name: product.title,
        price: mainVariant.price,
        compareAtPrice: mainVariant.compareAtPrice,
        image: product.images[0]?.url || "",
        inStock: mainVariant.inventoryQuantity > 0,
      })

      // Show the big product action toast for wishlist
      showProductAction(
        {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: mainVariant.price,
          compareAtPrice: mainVariant.compareAtPrice,
          image: product.images[0]?.url || "",
        },
        "wishlist",
      )
    }
  }

  return (
    <>
      <div className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        {product.isHotDeal && <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">Trending</Badge>}

        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <Image
              src={product.images[0]?.url || "/placeholder.svg"}
              alt={product.images[0]?.altText || product.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-[#0042adef]">{product.title}</h3>
          </Link>

          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-900">₹{mainVariant.price.toLocaleString()}</span>
            {mainVariant.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">₹{mainVariant.compareAtPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className={`${isInWishlistState ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${isInWishlistState ? "fill-current" : ""}`} />
            </Button>

            <Button
              size="icon"
              className="bg-[#0042adef] hover:bg-[#0042ad] text-white rounded-full"
              onClick={handleAddToCart}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ProductQuickView product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  )
}
