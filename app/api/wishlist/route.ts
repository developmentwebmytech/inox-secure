import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Wishlist from "@/models/Wishlist"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import "@/models/Product"

async function getUser(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const payload = session?.user
    return payload
  } catch {
    return null
  }
}

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const wishlist = await Wishlist.findOne({ user_id: user.id }).populate({
      path: "items.product_id",
      select: "name price compareAtPrice images inStock",
    })

    if (!wishlist) {
      return NextResponse.json({
        items: [],
        itemCount: 0,
      })
    }

    const formattedItems = wishlist.items.map((item) => ({
      id: item._id,
      productId: item.product_id._id,
      name: item.name,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      image: item.image,
      inStock: item.inStock,
      added_at: item.added_at,
    }))

    return NextResponse.json({
      items: formattedItems,
      itemCount: formattedItems.length,
    })
  } catch (error) {
    console.error("Wishlist fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, name, price, compareAtPrice, image, inStock } = await request.json()

    if (!productId || !name || !price || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    let wishlist = await Wishlist.findOne({ user_id: user.id })

    if (!wishlist) {
      wishlist = new Wishlist({
        user_id: user.id,
        items: [],
      })
    }

    // Check if item already exists
    const existingItem = wishlist.items.find((item) => item.product_id.toString() === productId)

    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 400 })
    }

    // Add new item
    wishlist.items.push({
      product_id: productId,
      name,
      price,
      compareAtPrice,
      image,
      inStock: inStock ?? true,
      added_at: new Date(),
    })

    await wishlist.save()

    return NextResponse.json({ message: "Item added to wishlist successfully" })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    return NextResponse.json({ error: "Failed to add item to wishlist" }, { status: 500 })
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    await connectDB()

    const wishlist = await Wishlist.findOne({ user_id: user.id })
    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    wishlist.items = wishlist.items.filter((item) => item.product_id.toString() !== productId)

    await wishlist.save()

    return NextResponse.json({ message: "Item removed from wishlist" })
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    return NextResponse.json({ error: "Failed to remove item from wishlist" }, { status: 500 })
  }
}
