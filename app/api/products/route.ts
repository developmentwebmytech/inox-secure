import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"
import { Category } from "@/models/Category"
import "@/models/Brand"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
  
    const query: any = { status: "active" }

    // Update: Handle category filtering via slug
    if (category) {
      const slugs = category.split(",")
      const categoryDocs = await Category.find({ slug: { $in: slugs } })
      const categoryIds = categoryDocs.map((cat) => cat._id)
      query.category = { $in: categoryIds }
    }

    if (brand) {
      if (brand.includes(",")) {
        const brandIds = brand.split(",")
        query.brand = { $in: brandIds }
      } else {
        query.brand = brand
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (minPrice || maxPrice) {
      query["variants.price"] = {}
      if (minPrice) query["variants.price"].$gte = Number.parseInt(minPrice)
      if (maxPrice) query["variants.price"].$lte = Number.parseInt(maxPrice)
    }

    const skip = (page - 1) * limit

    const products = await Product.find(query)
      .populate("category")
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
