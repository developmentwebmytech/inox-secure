import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Cart from "@/models/cart"
import { getServerSession } from "next-auth"

// DELETE - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    await Cart.findOneAndUpdate({ user_id: session.user.id }, { items: [], total: 0 }, { upsert: true })

    return NextResponse.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
