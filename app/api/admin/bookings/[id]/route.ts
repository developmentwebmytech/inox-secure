import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const data = await request.json()

    const booking = await Booking.findByIdAndUpdate(params.id, data, { new: true })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Booking updated successfully", booking })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
