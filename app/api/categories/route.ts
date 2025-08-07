import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Category } from "@/models/Category"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
