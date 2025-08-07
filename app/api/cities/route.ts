import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import City from "@/models/City"

export async function GET() {
  try {
    await connectDB()
    const cities = await City.find({ isActive: true }).sort({ name: 1 })
    return NextResponse.json(cities)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}
