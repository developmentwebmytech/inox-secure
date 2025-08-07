import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Brand } from "@/lib/models/Brand"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const brand = await Brand.findById(params.id)
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brand" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const brand = await Brand.findByIdAndUpdate(params.id, body, { new: true })
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const brand = await Brand.findByIdAndDelete(params.id)
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Brand deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 })
  }
}
