import { notFound } from "next/navigation"

import { ProductsClient } from "@/components/ProductsClient"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"
import { Category } from "@/models/Category"
import { Brand } from "@/models/Brand"
import Image from "next/image"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: any
}

async function getCategoryProducts(categorySlug: string, searchParams: any) {
  await connectDB()

  // Find category by name (case insensitive)
  const category = await Category.findOne({
    slug: { $regex: new RegExp(`^${categorySlug}$`, "i") },
  })

  if (!category) {
    return null
  }

  const query: any = { status: "active", category: category._id }

  if (searchParams.brand) {
    query.brand = searchParams.brand
  }

  const products = await Product.find(query).populate("category").populate("brand").limit(20).lean()

  return {
    products: JSON.parse(JSON.stringify(products)),
    category: JSON.parse(JSON.stringify(category)),
  }
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const data = await getCategoryProducts(params.category, searchParams)

  if (!data) {
    notFound()
  }

  const filters = await getFilters()

  // after getting category data
  const getBannerSrc = (category: string) => {
    switch (category.toLowerCase()) {
      case "electronics":
        return {
          desktop: "/electronics.png",
          mobile: "/mobile/electronics.png",
        };
      case "appliances":
        return {
          desktop: "/appliance.png",
          mobile: "/mobile/appliances.png",
        };
      case "it-products":
        return {
          desktop: "/itproduct.png",
          mobile: "/mobile/itproduct.png",
        };
      default:
        return {
          desktop: "/s(3).png",
          mobile: "/mobile/all-product.png",
        };
    }
  };

  const { desktop: bannerSrc, mobile: mobileBannerSrc } = getBannerSrc(data.category.slug);


  return (
    <div className="min-h-screen bg-yellow-50">

      <section className="mx-auto">
        {/* big screen */}

        <figure className="relative aspect-[4/1] overflow-hidden shadow hidden sm:block">
          <Image
            src={bannerSrc}
            alt={data.category.name}
            fill
            // sizes="(min-width: 640px) 100vw"
            // width={1915}
            // height={500}
            className="object-cover"   // 👈 no cropping
            priority
          />
        </figure>


        {/* small screen */}
        <figure className="relative aspect-[3/2] overflow-hidden shadow sm:hidden">
          <Image
            src={mobileBannerSrc}
            alt={data.category.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </figure>
      </section>


      <main className="">
        <div className="container mx-auto py-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold capitalize hidden sm:hidden">{data.category.name}</h1>
            <p className="text-gray-600 hidden sm:hidden">{data.category.description}</p>
          </div>
          <ProductsClient
            initialProducts={data.products}
            categories={filters.categories}
            brands={filters.brands}
            currentCategory={data.category.slug} // ✅ SLUG not _id
          />
        </div>
      </main>

    </div>
  )
}


export async function generateStaticParams() {
  await connectDB()
  const categories = await Category.find({ isActive: true }).lean()

  return categories.map((category) => ({
    category: category.name.toLowerCase(),
  }))
}
