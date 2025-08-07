"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X, Plus } from "lucide-react" // Import Plus icon
import { ProductVariants } from "./product-variants"
import { ProductImages } from "./product-images"
import { ProductPricing } from "./product-pricing"

interface Product {
  _id?: string
  title: string
  description: string
  handle: string
  status: string
  productType: string
  vendor: string
  tags: string[]
  category: string
  brand: string
  collections: string[]
  images: Array<{
    url: string
    altText: string
    position: number
  }>
  options: Array<{
    name: string
    values: string[]
  }>
  variants: Array<{
    title: string
    price: number
    compareAtPrice?: number
    costPerItem?: number
    sku: string
    barcode: string
    inventoryQuantity: number
    trackQuantity: boolean
    continueSellingWhenOutOfStock: boolean
    hasSkuBarcode: boolean // Added to ProductVariant interface
    weight: number
    weightUnit: string
    requiresShipping: boolean
    taxable: boolean
    images: Array<{
      url: string
      altText: string
      position: number
    }>
    optionValues: Array<{
      optionName: string
      value: string
    }>
    isActive: boolean
  }>
  seoTitle: string
  seoDescription: string
  isActive: boolean
}

interface ProductFormProps {
  product?: Product
  isEdit?: boolean
}

interface Category {
  _id: string
  name: string
}

interface Brand {
  _id: string
  name: string
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(() => {
    const initialProduct = product || {
      title: "",
      description: "",
      handle: "",
      status: "draft",
      productType: "",
      vendor: "",
      tags: [],
      category: "",
      brand: "",
      collections: [],
      images: [],
      options: [],
      variants: [],
      seoTitle: "",
      seoDescription: "",
      isActive: true,
    }

    // Ensure there's at least one default variant if no options are present
    // and no variants are already defined (e.g., for a new product)
    if (initialProduct.options.length === 0 && initialProduct.variants.length === 0) {
      initialProduct.variants = [
        {
          title: "Default Variant", // This title might be updated to match product title later
          price: 0,
          compareAtPrice: undefined,
          costPerItem: undefined,
          sku: "",
          barcode: "",
          inventoryQuantity: 0,
          trackQuantity: true,
          continueSellingWhenOutOfStock: false,
          hasSkuBarcode: false, // Initialize hasSkuBarcode
          weight: 0,
          weightUnit: "kg",
          requiresShipping: true,
          taxable: true,
          images: [],
          optionValues: [],
          isActive: true,
        },
      ]
    } else if (initialProduct.options.length === 0 && initialProduct.variants.length > 0) {
      // For existing products without options, ensure hasSkuBarcode is initialized based on existing data
      initialProduct.variants[0].hasSkuBarcode =
        !!initialProduct.variants[0].sku || !!initialProduct.variants[0].barcode
    }
    return initialProduct
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/brands"),
        ])
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.categories)
        }
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json()
          setBrands(brandsData.brands)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  // Generate handle from title
  useEffect(() => {
    if (formData.title && !isEdit) {
      const handle = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, handle }))
    }
  }, [formData.title, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = isEdit ? `/api/admin/products/${product?._id}` : "/api/admin/products"
      const method = isEdit ? "PUT" : "POST"

      // Clean up empty values
      const submitData = {
        ...formData,
        category: formData.category || undefined,
        brand: formData.brand || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        const responseData = await response.json()
        toast({
          title: "Success",
          description: `Product ${isEdit ? "updated" : "created"} successfully`,
        })
        router.push("/dashboard/products")
      } else {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.error || `Failed to ${isEdit ? "update" : "create"} product`)
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "create"} product`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleOptionsChange = (options: Array<{ name: string; values: string[] }>) => {
    setFormData((prev) => ({ ...prev, options }))
  }

  const handleVariantsChange = (variants: Product["variants"]) => {
    setFormData((prev) => ({ ...prev, variants }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Short sleeve t-shirt"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <ProductImages
          images={formData.images}
          onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
        />

        {/* Conditional rendering for Pricing or Variants */}
        {formData.options.length === 0 ? (
          <>
            <ProductPricing
              price={formData.variants[0]?.price || 0}
              compareAtPrice={formData.variants[0]?.compareAtPrice}
              taxable={formData.variants[0]?.taxable || false}
              costPerItem={formData.variants[0]?.costPerItem}
              sku={formData.variants[0]?.sku || ""}
              barcode={formData.variants[0]?.barcode || ""}
              inventoryQuantity={formData.variants[0]?.inventoryQuantity || 0}
              trackQuantity={formData.variants[0]?.trackQuantity ?? true}
              continueSellingWhenOutOfStock={formData.variants[0]?.continueSellingWhenOutOfStock ?? false}
              hasSkuBarcode={formData.variants[0]?.hasSkuBarcode ?? false} // Pass new prop
              onPriceChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], price: value }],
                }))
              }
              onCompareAtPriceChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], compareAtPrice: value }],
                }))
              }
              onTaxableChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], taxable: checked }],
                }))
              }
              onCostPerItemChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], costPerItem: value }],
                }))
              }
              onSkuChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], sku: value }],
                }))
              }
              onBarcodeChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], barcode: value }],
                }))
              }
              onInventoryQuantityChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], inventoryQuantity: value }],
                }))
              }
              onTrackQuantityChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], trackQuantity: checked }],
                }))
              }
              onContinueSellingWhenOutOfStockChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], continueSellingWhenOutOfStock: checked }],
                }))
              }
              onHasSkuBarcodeChange={(
                checked, // Handle new prop change
              ) =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [{ ...prev.variants[0], hasSkuBarcode: checked }],
                }))
              }
            />
            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
                <CardDescription>
                  Add variants if this product comes in multiple options, like size or color.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      options: [{ name: "Size", values: [""] }], // Add a default option
                      variants: [], // Clear existing single variant, as ProductVariants will generate new ones
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add options
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <ProductVariants
            options={formData.options}
            variants={formData.variants}
            onOptionsChange={handleOptionsChange}
            onVariantsChange={handleVariantsChange}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Search Engine Listing</CardTitle>
            <CardDescription>
              Add a title and description to see how this product might appear in a search engine listing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">Page title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder={formData.title}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">Meta description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Product description for search engines"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productType">Product type</Label>
              <Input
                id="productType"
                value={formData.productType}
                onChange={(e) => setFormData((prev) => ({ ...prev, productType: e.target.value }))}
                placeholder="e.g., T-Shirt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData((prev) => ({ ...prev, vendor: e.target.value }))}
                placeholder="e.g., Nike"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Brand</SelectItem>
                  {Array.isArray(brands) &&
                    brands.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4">
          <Button type="submit" onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/products")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
