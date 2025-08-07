import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import ServiceCategory from "@/models/ServiceCategory"

export async function GET() {
  try {
    await connectDB()
    const categories = await ServiceCategory.find().sort({ createdAt: -1 })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await  connectDB()
    const data = await request.json()

    const category = new ServiceCategory(data)
    await category.save()

    return NextResponse.json({ message: "Service category created successfully", category })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service category" }, { status: 500 })
  }
}
