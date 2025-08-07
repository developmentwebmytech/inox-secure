import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import City from "@/models/City"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const data = await request.json()

    const city = await City.findByIdAndUpdate(params.id, data, { new: true })

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "City updated successfully", city })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update city" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const city = await City.findByIdAndDelete(params.id)

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "City deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete city" }, { status: 500 })
  }
}
