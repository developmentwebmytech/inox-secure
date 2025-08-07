"use client"

import { useWishlist } from "@/contexts/WishlistContext"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { state: wishlistState, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      variantId: "default",
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">My Wishlist</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Items you've saved for later</p>

          {wishlistState.items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4 text-base">Your wishlist is empty</div>
              <Link href="/products">
                <Button className="bg-[#0042adef] hover:bg-[#0042ad]">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistState.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                      onClick={() => removeFromWishlist(item.productId)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>

                    {/* ✅ Responsive image wrapper */}
                    <div className="aspect-square relative w-full">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base line-clamp-2">{item.name}</h3>

                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <Button
                      className={`w-full text-sm sm:text-base ${
                        item.inStock
                          ? "bg-[#0042adef] hover:bg-[#0042ad]"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item)}
                    >
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
