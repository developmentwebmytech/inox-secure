import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const product = await Product.findById(params.id).populate("category", "name").populate("brand", "name")

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()

    // Regenerate variants if options changed
    if (body.options && body.options.length > 0) {
      const existingProduct = await Product.findById(params.id)
      if (existingProduct && JSON.stringify(existingProduct.options) !== JSON.stringify(body.options)) {
        body.variants = generateVariants(body.options, body.basePrice || existingProduct.variants[0]?.price || 0)
      }
    }

    const product = await Product.findByIdAndUpdate(params.id, body, { new: true })
      .populate("category", "name")
      .populate("brand", "name")

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

function generateVariants(options: any[], basePrice: number) {
  if (options.length === 0) return []

  const combinations = generateCombinations(options)

  return combinations.map((combination, index) => ({
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
    return options[0].values.map((value: string) => [{ optionName: options[0].name, value }])
  }

  const result: any[] = []
  const firstOption = options[0]
  const restCombinations = generateCombinations(options.slice(1))

  for (const value of firstOption.values) {
    for (const restCombination of restCombinations) {
      result.push([{ optionName: firstOption.name, value }, ...restCombination])
    }
  }

  return result
}
