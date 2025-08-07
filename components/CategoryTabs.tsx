"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ServiceCategory {
  _id: string
  name: string
  description?: string
}

export default function CategoryTabs() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.slice(0, 6)) // Show only first 6 categories on homepage
    } catch (error) {
      console.error("Error fetching service categories:", error)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/services">
          <Button variant={activeCategory === "all" ? "default" : "outline"} className="rounded-full">
            All Services
          </Button>
        </Link>
        {categories.map((category) => (
          <Link key={category._id} href={`/services?category=${category._id}`}>
            <Button variant="outline" className="rounded-full bg-transparent">
              {category.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
