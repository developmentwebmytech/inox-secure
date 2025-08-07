import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import City from "@/models/City"

export async function GET() {
  try {
    await connectDB()
    const cities = await City.find().sort({ name: 1 })
    return NextResponse.json(cities)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()

    // Check if city already exists
    const existingCity = await City.findOne({
      name: { $regex: new RegExp(`^${data.name}$`, "i") },
      state: { $regex: new RegExp(`^${data.state}$`, "i") },
    })

    if (existingCity) {
      return NextResponse.json({ error: "City already exists in this state" }, { status: 400 })
    }

    const city = new City(data)
    await city.save()

    return NextResponse.json({ message: "City added successfully", city })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add city" }, { status: 500 })
  }
}
