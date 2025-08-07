import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Service from "@/models/Service"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
   
    await connectDB()
    const service = await Service.findOne({ slug: params.slug, isActive: true }).populate("category", "name")

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}
