"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Shield, Award, X } from "lucide-react"

interface ServiceCategory {
  _id: string
  name: string
}

export default function ServiceFilters() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)

  const searchParams = useSearchParams()
  const router = useRouter()

  const features = [
    { id: "verified", label: "Verified Providers", icon: Shield },
    { id: "popular", label: "Popular Services", icon: Award },
    { id: "emergency", label: "Emergency Available", icon: Star },
  ]

  useEffect(() => {
    fetchCategories()
    loadFiltersFromURL()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const loadFiltersFromURL = () => {
    const categories = searchParams.get("categories")?.split(",") || []
    const price = searchParams.get("priceRange")?.split(",").map(Number) || [0, 10000]
    const features = searchParams.get("features")?.split(",") || []
    const rating = Number(searchParams.get("minRating")) || 0

    setSelectedCategories(categories)
    setPriceRange(price)
    setSelectedFeatures(features)
    setMinRating(rating)
  }

  const updateURL = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","))
    } else {
      params.delete("categories")
    }

    if (priceRange[0] !== 0 || priceRange[1] !== 10000) {
      params.set("priceRange", priceRange.join(","))
    } else {
      params.delete("priceRange")
    }

    if (selectedFeatures.length > 0) {
      params.set("features", selectedFeatures.join(","))
    } else {
      params.delete("features")
    }

    if (minRating > 0) {
      params.set("minRating", minRating.toString())
    } else {
      params.delete("minRating")
    }

    router.push(`/services?${params.toString()}`)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updated = checked ? [...selectedCategories, categoryId] : selectedCategories.filter((id) => id !== categoryId)

    setSelectedCategories(updated)
    setTimeout(updateURL, 100)
  }

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    const updated = checked ? [...selectedFeatures, featureId] : selectedFeatures.filter((id) => id !== featureId)

    setSelectedFeatures(updated)
    setTimeout(updateURL, 100)
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    setTimeout(updateURL, 500) // Debounce for slider
  }

  const handleRatingChange = (rating: number) => {
    setMinRating(rating)
    setTimeout(updateURL, 100)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 10000])
    setSelectedFeatures([])
    setMinRating(0)
    router.push("/services")
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000 ||
    selectedFeatures.length > 0 ||
    minRating > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Service Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                  />
                  <label htmlFor={category._id} className="text-sm cursor-pointer">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={10000}
                min={0}
                step={100}
                className="mb-3"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <h3 className="font-medium mb-3">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={minRating === rating}
                    onCheckedChange={(checked) => handleRatingChange(checked ? rating : 0)}
                  />
                  <label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">& up</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="font-medium mb-3">Features</h3>
            <div className="space-y-2">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.id}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                    />
                    <label htmlFor={feature.id} className="flex items-center cursor-pointer">
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="text-sm">{feature.label}</span>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c._id === categoryId)
                return (
                  <Badge key={categoryId} variant="secondary" className="text-xs">
                    {category?.name}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => handleCategoryChange(categoryId, false)}
                    />
                  </Badge>
                )
              })}

              {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                <Badge variant="secondary" className="text-xs">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handlePriceChange([0, 10000])} />
                </Badge>
              )}

              {minRating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {minRating}+ Stars
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleRatingChange(0)} />
                </Badge>
              )}

              {selectedFeatures.map((featureId) => {
                const feature = features.find((f) => f.id === featureId)
                return (
                  <Badge key={featureId} variant="secondary" className="text-xs">
                    {feature?.label}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleFeatureChange(featureId, false)} />
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
