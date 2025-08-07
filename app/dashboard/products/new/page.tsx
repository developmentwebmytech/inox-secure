import { ProductForm } from "@/components/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6 p-10">
      <div>
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground">Create a new product for your store</p>
      </div>
      <ProductForm />
    </div>
  )
}
