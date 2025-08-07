import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function GET() {
  try {
    await connectDB()
    const bookings = await Booking.find()
      .populate({
        path: "service",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
