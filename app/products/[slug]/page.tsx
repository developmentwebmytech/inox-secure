import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/components/ProductDetailClient"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  await connectDB()

  const product = await Product.findOne({ slug }).populate("category").populate("brand").lean()

  if (!product) {
    return null
  }

  return JSON.parse(JSON.stringify(product))
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  await connectDB()

  const products = await Product.find({
    category: categoryId,
    _id: { $ne: currentProductId },
    status: "active",
  })
    .populate("category")
    .populate("brand")
    .limit(4)
    .lean()

  return JSON.parse(JSON.stringify(products))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category?._id, product._id)

  return (
    <div className="min-h-screen bg-gray-50">
      
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      
    </div>
  )
}
