import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Service from "@/models/Service"
import { generateSlug } from "@/lib/utils"

export async function GET() {
  try {
    await connectDB()
    const services = await Service.find().populate("category", "name").sort({ createdAt: -1 })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await   connectDB()
    const data = await request.json()

    // Generate slug from name
    const baseSlug = generateSlug(data.name)
    let slug = baseSlug
    let counter = 1

    // Check if slug already exists and make it unique
    while (await Service.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const serviceData = { ...data, slug }
    const service = new Service(serviceData)
    await service.save()

    return NextResponse.json({ message: "Service created successfully", service })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
