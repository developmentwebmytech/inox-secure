"use client"

import { useWishlist } from "@/contexts/WishlistContext"
import { useCart } from "@/contexts/CartContext"
import { Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function AccountWishlist() {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <p className="text-gray-600">Items you've saved for later</p>
      </div>

      {wishlistState.items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Your wishlist is empty</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistState.items.map((item) => (
            <Card key={item.id}>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(item.productId)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <div className="aspect-square relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                  {item.compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{item.compareAtPrice.toLocaleString()}</span>
                  )}
                </div>

                <Button
                  className={`w-full ${
                    item.inStock ? "bg-[#0042adef] hover:bg-[#0042ad]" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!item.inStock}
                  onClick={() => handleAddToCart(item)}
                >
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
