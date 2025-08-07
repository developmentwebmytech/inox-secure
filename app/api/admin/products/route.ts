import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { Category } from "@/lib/models/Category"
import { Brand } from "@/lib/models/Brand"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("per_page") || "10", 10)
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find()
        .populate("category", "name")
        .populate("brand", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(),
    ])

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      total,
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Clean empty fields
    if (!body.category || body.category === "none") delete body.category
    if (!body.brand || body.brand === "none") delete body.brand

    // Handle variants
    if (body.options?.length > 0) {
      if (!body.variants || body.variants.length === 0) {
        body.variants = generateVariants(body.options, 0)
      }
    } else if (!body.variants || body.variants.length === 0) {
      body.variants = [getDefaultVariant()]
    }

    const product = new Product(body)
    await product.save()

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("brand", "name")

    return NextResponse.json(populatedProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

function getDefaultVariant() {
  return {
    title: "Default Title",
    price: 0,
    compareAtPrice: null,
    costPerItem: null,
    profit: null,
    margin: null,
    sku: "",
    barcode: "",
    inventoryQuantity: 0,
    trackQuantity: true,
    continueSellingWhenOutOfStock: false,
    weight: 0,
    weightUnit: "kg",
    requiresShipping: true,
    taxable: true,
    images: [],
    optionValues: [],
    isActive: true,
  }
}

function generateVariants(options: any[], basePrice: number) {
  const combinations = generateCombinations(options)

  return combinations.map((combination) => ({
    title: combination.map((opt: any) => opt.value).join(" / "),
    price: basePrice,
    compareAtPrice: null,
    costPerItem: null,
    profit: null,
    margin: null,
    sku: "",
    barcode: "",
    inventoryQuantity: 0,
    trackQuantity: true,
    continueSellingWhenOutOfStock: false,
    weight: 0,
    weightUnit: "kg",
    requiresShipping: true,
    taxable: true,
    images: [],
    optionValues: combination,
    isActive: true,
  }))
}

function generateCombinations(options: any[]): any[] {
  if (options.length === 0) return []
  if (options.length === 1) {
    return options[0].values
      .filter((value: string) => value.trim())
      .map((value: string) => [{ optionName: options[0].name, value }])
  }

  const result: any[] = []
  const firstOption = options[0]
  const restCombinations = generateCombinations(options.slice(1))

  for (const value of firstOption.values.filter((v: string) => v.trim())) {
    for (const rest of restCombinations) {
      result.push([{ optionName: firstOption.name, value }, ...rest])
    }
  }

  return result
}
