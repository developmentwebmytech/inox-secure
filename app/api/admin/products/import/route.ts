import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const workbook = XLSX.read(bytes, { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const [index, row] of data.entries()) {
      try {
        const rowData = row as any

        // Parse images from comma-separated string
        const parseImages = (imageString: string) => {
          if (!imageString) return []
          return imageString
            .split(",")
            .map((url: string, index: number) => ({
              url: url.trim(),
              alt: `Product image ${index + 1}`,
              position: index,
            }))
            .filter((img) => img.url)
        }

        // Map Excel columns to product fields
        const productData = {
          title: rowData.title || rowData.Title || "",
          description: rowData.description || rowData.Description || "",
          handle: (rowData.handle || rowData.Handle || rowData.title || rowData.Title || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          status: rowData.status || rowData.Status || "draft",
          productType: rowData.productType || rowData["Product Type"] || "",
          vendor: rowData.vendor || rowData.Vendor || "",
          tags: rowData.tags ? rowData.tags.split(",").map((tag: string) => tag.trim()) : [],
          seoTitle: rowData.seoTitle || rowData["SEO Title"] || "",
          seoDescription: rowData.seoDescription || rowData["SEO Description"] || "",
          isActive: rowData.isActive !== false && rowData["Is Active"] !== false,
          variants: [
            {
              title: "Default Title",
              price: Number.parseFloat(rowData.price || rowData.Price || "0"),
              compareAtPrice:
                rowData.compareAtPrice || rowData["Compare At Price"]
                  ? Number.parseFloat(rowData.compareAtPrice || rowData["Compare At Price"])
                  : null,
              costPerItem:
                rowData.costPerItem || rowData["Cost Per Item"]
                  ? Number.parseFloat(rowData.costPerItem || rowData["Cost Per Item"])
                  : null,
              sku: rowData.sku || rowData.SKU || "",
              barcode: rowData.barcode || rowData.Barcode || "",
              inventoryQuantity: Number.parseInt(rowData.inventoryQuantity || rowData["Inventory Quantity"] || "0"),
              trackQuantity: rowData.trackQuantity !== false && rowData["Track Quantity"] !== false,
              continueSellingWhenOutOfStock:
                rowData.continueSellingWhenOutOfStock === true ||
                rowData["Continue Selling When Out Of Stock"] === true,
              weight: Number.parseFloat(rowData.weight || rowData.Weight || "0"),
              weightUnit: rowData.weightUnit || rowData["Weight Unit"] || "kg",
              requiresShipping: rowData.requiresShipping !== false && rowData["Requires Shipping"] !== false,
              taxable: rowData.taxable !== false && rowData["Taxable"] !== false,
              images: parseImages(rowData.images || rowData.Images || rowData.image || rowData.Image || ""),
              optionValues: [],
              isActive: rowData.variantActive !== false && rowData["Variant Active"] !== false,
            },
          ],
        }

        // Validate required fields
        if (!productData.title || !productData.description) {
          results.errors.push(`Row ${index + 2}: Title and description are required`)
          results.failed++
          continue
        }

        // Check if product with same handle exists
        const existingProduct = await Product.findOne({ handle: productData.handle })
        if (existingProduct) {
          results.errors.push(`Row ${index + 2}: Product with handle "${productData.handle}" already exists`)
          results.failed++
          continue
        }

        const product = new Product(productData)
        await product.save()
        results.success++
      } catch (error) {
        results.errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : "Unknown error"}`)
        results.failed++
      }
    }

    return NextResponse.json({
      message: `Import completed. ${results.success} products imported, ${results.failed} failed.`,
      results,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Failed to import products" }, { status: 500 })
  }
}
