import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import ServiceCategory from "@/models/ServiceCategory"

export async function GET() {
  try {
    await connectDB()
 
    const categories = await ServiceCategory.find({ isActive: true }).sort({ name: 1 })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
