import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"
import "@/models/Product"
import "@/models/Category"
import "@/models/Brand"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const products = await Product.find()
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .lean() // improves performance and avoids Mongoose document overhead

    // Transform products to Excel format
    const excelData = products.map((product) => {
      const firstVariant = Array.isArray(product.variants) ? product.variants[0] || {} : {}

      // Convert images array to comma-separated string
      const formatImages = (images: any[]) => {
        if (!images || !Array.isArray(images)) return ""
        return images.map((img) => img?.url || img).join(", ")
      }

      return {
        Title: product.title,
        Description: product.description,
        Handle: product.handle,
        Status: product.status,
        "Product Type": product.productType,
        Vendor: product.vendor,
        Tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        Category: product.category?.name || "",
        Brand: product.brand?.name || "",
        "SEO Title": product.seoTitle,
        "SEO Description": product.seoDescription,
        "Is Active": product.isActive,
        Price: firstVariant.price || 0,
        "Compare At Price": firstVariant.compareAtPrice || "",
        "Cost Per Item": firstVariant.costPerItem || "",
        SKU: firstVariant.sku || "",
        Barcode: firstVariant.barcode || "",
        "Inventory Quantity": firstVariant.inventoryQuantity || 0,
        "Track Quantity": firstVariant.trackQuantity !== false,
        "Continue Selling When Out Of Stock": firstVariant.continueSellingWhenOutOfStock === true,
        Weight: firstVariant.weight || 0,
        "Weight Unit": firstVariant.weightUnit || "kg",
        "Requires Shipping": firstVariant.requiresShipping !== false,
        Taxable: firstVariant.taxable !== false,
        "Variant Active": firstVariant.isActive !== false,
        Images: formatImages(firstVariant.images),
        "Created At": product.createdAt,
        "Updated At": product.updatedAt,
      }
    })

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Auto-size columns
    const colWidths = Object.keys(excelData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }))
    worksheet["!cols"] = colWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // Return file response
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="products-export-${new Date()
          .toISOString()
          .split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return Response.json({ error: "Failed to export products" }, { status: 500 })
  }
}
