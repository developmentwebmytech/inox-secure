import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Brand } from "@/models/Brand"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean()

    return NextResponse.json(brands)
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
