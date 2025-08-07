"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CategoryForm } from "@/components/category-form"
import { useToast } from "@/hooks/use-toast"

interface Category {
  _id: string
  name: string
  description: string
  icon: string
  parentCategory?: string
  isActive: boolean
}

export default function EditCategoryPage() {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCategory({
            ...data,
            parentCategory: data.parentCategory?._id || "",
          })
        } else {
          throw new Error("Failed to fetch category")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch category",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id, toast])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">Update category information</p>
      </div>
      <CategoryForm category={category} isEdit />
    </div>
  )
}
