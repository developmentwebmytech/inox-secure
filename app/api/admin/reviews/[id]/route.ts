import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Review from "@/lib/models/Review"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { action } = await request.json()

    const updateData = action === "approve" ? { is_verified: true } : { is_verified: false }

    const review = await Review.findByIdAndUpdate(params.id, updateData, { new: true })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ message: `Review ${action}d successfully`, review })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}
