
import { ProductsClient } from "@/components/ProductsClient"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"
import { Category } from "@/models/Category"
import { Brand } from "@/models/Brand"

async function getProducts(searchParams: any) {
  await connectDB()

  const query: any = { status: "active" }

  if (searchParams.category) {
    query.category = searchParams.category
  }

  if (searchParams.brand) {
    query.brand = searchParams.brand
  }

  const products = await Product.find(query).populate("category").populate("brand").limit(20).lean()

  return JSON.parse(JSON.stringify(products))
}

async function getFilters() {
  await connectDB()

  const categories = await Category.find({ isActive: true }).lean()
  const brands = await Brand.find({ isActive: true }).lean()

  return {
    categories: JSON.parse(JSON.stringify(categories)),
    brands: JSON.parse(JSON.stringify(brands)),
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const products = await getProducts(searchParams)
  const filters = await getFilters()

  return (
    <div className="min-h-screen bg-gray-50">

      <ProductsClient initialProducts={products} categories={filters.categories} brands={filters.brands} />

    </div>
  )
}
