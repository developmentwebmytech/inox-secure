import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Service from "@/models/Service"
import ServiceCategory from "@/models/ServiceCategory" // Make sure this is the correct import

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")

    const query: any = { isActive: true }

    // Category filter using slug
    if (categorySlug && categorySlug !== "all") {
      const categoryDoc = await ServiceCategory.findOne({ slug: categorySlug })
      if (!categoryDoc) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }
      query.category = categoryDoc._id
    }

    const services = await Service.find(query)
      .populate("category", "name")
      .sort({ popular: -1, rating: -1 })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
