import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import ServiceCategory from "@/models/ServiceCategory"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const data = await request.json()

    const category = await ServiceCategory.findByIdAndUpdate(params.id, data, { new: true })

    if (!category) {
      return NextResponse.json({ error: "Service category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service category updated successfully", category })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const category = await ServiceCategory.findByIdAndDelete(params.id)

    if (!category) {
      return NextResponse.json({ error: "Service category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service category deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service category" }, { status: 500 })
  }
}
