import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"

export async function GET() {
  try {
    await connectDB()

    // Fetch products with limited fields and variant info
    const products = await Product.find({})
      .select("title variants") // 'title' instead of 'name' based on new schema
      .limit(5)
      .lean()

    // Optional: Sort variants inside each product by createdAt descending
    const formattedProducts:any = products.map(product => {
      const sortedVariants:any = (product.variants || []).sort(
        (a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      return {
        ...product,
        variants: sortedVariants.map((variant:any) => ({
          price: variant.price,
          images: variant.images,
          createdAt: variant.createdAt,
        })),
      }
    })

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
