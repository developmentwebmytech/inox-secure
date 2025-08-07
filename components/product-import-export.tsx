"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export function ProductImportExport() {
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/products/export")

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `products-export-${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export Successful",
          description: "Products have been exported to Excel file",
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export products",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (file: File) => {
    setImporting(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setImportResult(data.results)
        toast({
          title: "Import Completed",
          description: data.message,
        })
      } else {
        throw new Error(data.error || "Import failed")
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import products",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const templateData = [
      {
        Title: "Sample Product",
        Description: "This is a sample product description",
        Handle: "sample-product",
        Status: "draft",
        "Product Type": "T-Shirt",
        Vendor: "Sample Vendor",
        Tags: "clothing, sample",
        "SEO Title": "Sample Product - Best Quality",
        "SEO Description": "Sample product with best quality and affordable price",
        "Is Active": true,
        Price: 29.99,
        "Compare At Price": 39.99,
        "Cost Per Item": 15.0,
        SKU: "SAMPLE-001",
        Barcode: "1234567890123",
        "Inventory Quantity": 100,
        "Track Quantity": true,
        "Continue Selling When Out Of Stock": false,
        Weight: 0.5,
        "Weight Unit": "kg",
        "Requires Shipping": true,
        Taxable: true,
        "Variant Active": true,
        Images: "https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg",
      },
    ]

    // Create and download template
    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Products Template")
    XLSX.writeFile(wb, "products-import-template.xlsx")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Export Button */}
        <Button onClick={handleExport} disabled={exporting} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {exporting ? "Exporting..." : "Export Products"}
        </Button>

        {/* Import Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Import Products
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import Products from Excel</DialogTitle>
              <DialogDescription>
                Upload an Excel file to import products. Make sure your file follows the correct format.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Template Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Download Template</CardTitle>
                  <CardDescription>
                    Download the Excel template to see the required format and column headers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={downloadTemplate} variant="outline">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • <strong>Images:</strong> Use comma-separated URLs for multiple images per variant
                      </li>
                      <li>
                        • <strong>Example:</strong> "https://example.com/img1.jpg, https://example.com/img2.jpg"
                      </li>
                      <li>
                        • <strong>Tags:</strong> Use comma-separated values for multiple tags
                      </li>
                      <li>
                        • <strong>Handle:</strong> Must be unique for each product
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Upload Your File</CardTitle>
                  <CardDescription>Select your Excel file with product data to import.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to select Excel file or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">Supports .xlsx and .xls files</p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImport(file)
                        }
                      }}
                    />

                    {importing && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm">Importing products...</span>
                        </div>
                        <Progress value={undefined} className="w-full" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Import Results */}
              {importResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {importResult.failed === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      Import Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                        <div className="text-sm text-green-700">Successful</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                        <div className="text-sm text-red-700">Failed</div>
                      </div>
                    </div>

                    {importResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-700">Errors:</h4>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {importResult.errors.map((error, index) => (
                            <Alert key={index} variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          setShowImportDialog(false)
                          setImportResult(null)
                          window.location.reload() // Refresh to show new products
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
