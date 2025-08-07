import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Cart from "@/models/cart"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import "@/models/Product"

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const cart = await Cart.findOne({ user_id: session.user.id })
      .populate({
        path: "items.product_id",
        select: "name price images category",
      })
      .populate({
        path: "items.variation_id",
        select: "size color stock",
      })

    if (!cart) {
      return NextResponse.json({
        items: [],
        total: 0,
        itemCount: 0,
      })
    }

    // Calculate total and format response
    const formattedItems = cart.items.map((item:any) => ({
      id: item._id,
      product_id: item.product_id._id,
      variation_id: item.variation_id._id,
      name: item.product_id.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product_id.images?.[0] || null,
      size: item.variation_id.size,
      color: item.variation_id.color,
      stock: item.variation_id.stock,
      added_at: item.added_at,
    }))

    const total = formattedItems.reduce((sum :any, item :any) => sum + item.price * item.quantity, 0)
    const itemCount = formattedItems.reduce((sum :any, item :any) => sum + item.quantity, 0)

    return NextResponse.json({
      items: formattedItems,
      total,
      itemCount,
    })
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { product_id, variation_id, quantity, price } = await request.json()

    if (!product_id || !variation_id || !quantity || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    let cart = await Cart.findOne({ user_id: session.id })

    if (!cart) {
      cart = new Cart({
        user_id: session.id,
        items: [],
        total: 0,
      })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item:any) => item.product_id.toString() === product_id && item.variation_id.toString() === variation_id,
    )

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.items.push({
        product_id,
        variation_id,
        quantity,
        price,
        added_at: new Date(),
      })
    }

    // Calculate new total
    cart.total = cart.items.reduce((sum:any, item:any) => sum + item.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Item added to cart successfully" })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { item_id, quantity } = await request.json()

    if (!item_id || quantity < 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    await connectDB()

    const cart = await Cart.findOne({ user_id: session.user.id })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items = cart.items.filter((item:any) => item._id.toString() !== item_id)
    } else {
      // Update quantity
      const itemIndex = cart.items.findIndex((item:any) => item._id.toString() === item_id)
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity
      }
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum:any, item:any) => sum + item.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Cart updated successfully" })
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const item_id = searchParams.get("item_id")

    if (!item_id) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 })
    }

    await connectDB()

    const cart = await Cart.findOne({ user_id: session.user.id })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    cart.items = cart.items.filter((item:any) => item._id.toString() !== item_id)
    cart.total = cart.items.reduce((sum:any, item:any) => sum + item.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Remove from cart error:", error)
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 })
  }
}
