// MODELS
import { connectDB } from "./mongodb"
import { Brand } from "@/models/Brand"
import { Category } from "@/models/Category"
import { Product } from "@/models/Product"
import { User } from "@/models/User"
import { isValidObjectId } from "mongoose"

// Helper function to serialize MongoDB documents
function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

// Stats for dashboard
export async function getStats() {
  await connectDB()

  const [
    totalProducts,
    totalCategories,
    totalBrands,
    totalUsers,
    newProducts,
    newCategories,
    newBrands,
    newUsers,
  ] = await Promise.all([
    Product.countDocuments({}),
    Category.countDocuments({}),
    Brand.countDocuments({}),
    User.countDocuments({}),
    Product.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
    Category.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
    Brand.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
    User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
  ])

  return {
    totalProducts,
    totalCategories,
    totalBrands,
    totalUsers,
    newProducts,
    newCategories,
    newBrands,
    newUsers,
  }
}

// Get brands with filters
export async function getBrands({ page = 1, per_page = 10, name = "" }) {
  await connectDB()
  const skip = (page - 1) * per_page
  const query: any = {}
  if (name) {
    query.name = { $regex: name, $options: "i" }
  }
  const [brands, totalBrands] = await Promise.all([
    Brand.find(query).sort({ createdAt: -1 }).skip(skip).limit(per_page).lean(),
    Brand.countDocuments(query),
  ])
  return {
    brands: serialize(brands),
    totalPages: Math.ceil(totalBrands / per_page),
  }
}

export async function getBrandById(id: string) {
  if (!isValidObjectId(id)) return null
  await connectDB()
  const brand = await Brand.findById(id).lean()
  return brand ? serialize(brand) : null
}

export async function getCategories({ page = 1, per_page = 10, name = "", parent_id = "" }) {
  await connectDB()
  const skip = (page - 1) * per_page
  const query: any = {}
  if (name) {
    query.name = { $regex: name, $options: "i" }
  }
  if (parent_id) {
    query.parent_category_id = parent_id === "none" ? null : parent_id
  }
  const [categories, totalCategories] = await Promise.all([
    Category.find(query)
      .populate("parent_category_id", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(per_page)
      .lean(),
    Category.countDocuments(query),
  ])
  return {
    categories: serialize(categories),
    totalPages: Math.ceil(totalCategories / per_page),
  }
}

export async function getCategoryById(id: string) {
  if (!isValidObjectId(id)) return null
  await connectDB()
  const category = await Category.findById(id).populate("parent_category_id", "name").lean()
  return category ? serialize(category) : null
}

export async function getProducts({ page = 1, per_page = 10, name = "", brand_id = "", category_id = "", date = "" }) {
  await connectDB()
  const skip = (page - 1) * per_page
  const query: any = {}
  if (name) {
    query.title = { $regex: name, $options: "i" }
  }
  if (brand_id) {
    query.brand = brand_id
  }
  if (category_id) {
    query.category = category_id
  }
  if (date) {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)
    query.createdAt = { $gte: startDate, $lte: endDate }
  }
  const [products, totalProducts] = await Promise.all([
    Product.find(query)
      .populate("brand", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(per_page)
      .lean(),
    Product.countDocuments(query),
  ])
  products.forEach((product) => {
    product.thumbnail = product.variants?.[0]?.images?.[0]?.url || null
  })
  return {
    products: serialize(products),
    totalPages: Math.ceil(totalProducts / per_page),
  }
}

export async function getProductById(id: string) {
  if (!isValidObjectId(id)) return null
  await connectDB()
  const product = await Product.findById(id)
    .populate("brand", "name")
    .populate("category", "name")
    .lean()
  return product ? serialize(product) : null
}

export async function getVariantsByProductId(productId: string) {
  if (!isValidObjectId(productId)) return []
  await connectDB()
  const product:any = await Product.findById(productId).select("variants").lean()
  return product?.variants || []
}

export async function getUsers({ page = 1, per_page = 10, name = "", email = "" }) {
  await connectDB()
  const skip = (page - 1) * per_page
  const query: any = {}
  if (name) query.name = { $regex: name, $options: "i" }
  if (email) query.email = { $regex: email, $options: "i" }
  const [users, totalUsers] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(per_page)
      .lean(),
    User.countDocuments(query),
  ])
  return {
    users: serialize(users),
    totalPages: Math.ceil(totalUsers / per_page),
  }
}

export async function getUserById(id: string) {
  if (!isValidObjectId(id)) return null
  await connectDB()
  const user = await User.findById(id).select("-password").lean()
  return user ? serialize(user) : null
}
