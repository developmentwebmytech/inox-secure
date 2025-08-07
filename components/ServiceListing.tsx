"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, Shield, ChevronRight, Search, Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Service {
  _id: string
  name: string
  slug: string
  category: {
    _id: string
    name: string
  }
  description: string
  startingPrice: number
  duration?: string
  image?: string
  rating: number
  reviews: number
  verified: boolean
  popular: boolean
  tags: string[]
}

interface ServiceCategory {
  _id: string
  name: string
}

export default function ServiceListing() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    fetchServices()
    fetchCategories()

    // Get initial filters from URL params
    const category = searchParams.get("category") || "all"
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "popular"
    const price = searchParams.get("price") || "all"

    setSelectedCategory(category)
    setSearchTerm(search)
    setSortBy(sort)
    setPriceRange(price)
  }, [searchParams])

  useEffect(() => {
    filterAndSortServices()
  }, [services, searchTerm, selectedCategory, sortBy, priceRange])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const filterAndSortServices = () => {
    let filtered = [...services]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category._id === selectedCategory)
    }

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "0-500":
          filtered = filtered.filter((service) => service.startingPrice <= 500)
          break
        case "500-1000":
          filtered = filtered.filter((service) => service.startingPrice > 500 && service.startingPrice <= 1000)
          break
        case "1000-2000":
          filtered = filtered.filter((service) => service.startingPrice > 1000 && service.startingPrice <= 2000)
          break
        case "2000+":
          filtered = filtered.filter((service) => service.startingPrice > 2000)
          break
      }
    }

    // Sort services
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => {
          if (a.popular && !b.popular) return -1
          if (!a.popular && b.popular) return 1
          return b.rating - a.rating
        })
        break
      case "price-low":
        filtered.sort((a, b) => a.startingPrice - b.startingPrice)
        break
      case "price-high":
        filtered.sort((a, b) => b.startingPrice - a.startingPrice)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredServices(filtered)
  }

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all" || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/services?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    updateURL("search", value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateURL("category", value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL("sort", value)
  }

  const handlePriceChange = (value: string) => {
    setPriceRange(value)
    updateURL("price", value)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={handlePriceChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                  <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                  <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                  <SelectItem value="2000+">₹2000+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredServices.length} of {services.length} services
        </p>
      </div>

      {/* Services Grid/List */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  viewMode: "grid" | "list"
}

function ServiceCard({ service, viewMode }: ServiceCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={service.image || "/placeholder.svg?height=100&width=150"}
                alt={service.name}
                fill
                className="object-cover"
              />
              {service.verified && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {service.popular && <Badge className="bg-green-500">Popular</Badge>}
                  </div>
                  <Badge variant="outline" className="mb-2">
                    {service.category.name}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Starting at</span>
                  <div className="font-bold text-xl">₹{service.startingPrice}</div>
                </div>
              </div>

              <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-sm text-gray-500">({service.reviews})</span>
                  </div>
                  {service.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{service.duration}</span>
                    </div>
                  )}
                </div>

                <Link href={`/service/${service.slug}`}>
                  <Button>
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
      {service.popular && <Badge className="absolute top-2 left-2 z-10 bg-green-500">Popular</Badge>}

      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image || "/placeholder.svg?height=200&width=300"}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {service.verified && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <Shield className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="mb-2">
            {service.category.name}
          </Badge>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{service.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{service.rating}</span>
            <span className="text-sm text-gray-500">({service.reviews})</span>
          </div>
          {service.duration && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{service.duration}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {service.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Starting at</span>
            <div className="font-bold text-lg">₹{service.startingPrice}</div>
          </div>
          <Link href={`/service/${service.slug}`}>
            <Button className="group/btn">
              View Details
              <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
