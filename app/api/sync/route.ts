import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Cart from "@//models/cart"
import Wishlist from "@/models/Wishlist"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getUser(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const payload = session?.user
    return payload
  } catch {
    return null
  }
}

// POST - Sync local cart and wishlist with database after login
export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cartItems, wishlistItems } = await request.json()

    await connectDB()

    // Sync Cart
    if (cartItems && cartItems.length > 0) {
      let cart = await Cart.findOne({ user_id: user.id })

      if (!cart) {
        cart = new Cart({
          user_id: user.id,
          items: [],
          total: 0,
        })
      }

      // Merge local cart with database cart
      for (const localItem of cartItems) {
        const existingItemIndex = cart.items.findIndex(
          (item) =>
            item.product_id.toString() === localItem.productId && item.variation_id.toString() === localItem.variantId,
        )

        if (existingItemIndex > -1) {
          // Update quantity (take the higher value)
          cart.items[existingItemIndex].quantity = Math.max(cart.items[existingItemIndex].quantity, localItem.quantity)
        } else {
          // Add new item
          cart.items.push({
            product_id: localItem.productId,
            variation_id: localItem.variantId,
            quantity: localItem.quantity,
            price: localItem.price,
            added_at: new Date(),
          })
        }
      }

      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      await cart.save()
    }

    // Sync Wishlist
    if (wishlistItems && wishlistItems.length > 0) {
      let wishlist = await Wishlist.findOne({ user_id: user.id })

      if (!wishlist) {
        wishlist = new Wishlist({
          user_id: user.id,
          items: [],
        })
      }

      // Merge local wishlist with database wishlist
      for (const localItem of wishlistItems) {
        const existingItem = wishlist.items.find((item) => item.product_id.toString() === localItem.productId)

        if (!existingItem) {
          wishlist.items.push({
            product_id: localItem.productId,
            name: localItem.name,
            price: localItem.price,
            compareAtPrice: localItem.compareAtPrice,
            image: localItem.image,
            inStock: localItem.inStock,
            added_at: new Date(),
          })
        }
      }

      await wishlist.save()
    }

    return NextResponse.json({ message: "Sync completed successfully" })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Failed to sync data" }, { status: 500 })
  }
}
