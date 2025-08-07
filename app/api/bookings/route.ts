import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()

    const booking = new Booking(data)
    await booking.save()

    return NextResponse.json({ message: "Booking created successfully", booking })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
