import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Service from "@/models/Service"
import { generateSlug } from "@/lib/utils"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await   connectDB()
    const data = await request.json()

    // Get current service
    const currentService = await Service.findById(params.id)
    if (!currentService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // If name changed, update slug
    if (data.name && data.name !== currentService.name) {
      const baseSlug = generateSlug(data.name)
      let slug = baseSlug
      let counter = 1

      // Check if slug already exists (excluding current service)
      while (await Service.findOne({ slug, _id: { $ne: params.id } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      data.slug = slug
    }

    const service = await Service.findByIdAndUpdate(params.id, data, { new: true })

    return NextResponse.json({ message: "Service updated successfully", service })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const service = await Service.findByIdAndDelete(params.id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
