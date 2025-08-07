"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
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

const SERVICES_PER_PAGE = 20

export default function ServiceGrid() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(SERVICES_PER_PAGE)
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchServices()
    setVisibleCount(SERVICES_PER_PAGE) // Reset visible count when search params change
  }, [searchParams])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const category = searchParams.get("category")
      const url = category ? `/api/services?category=${category}` : "/api/services"
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching services:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch services")
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    setLoadingMore(true)
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount(prev => prev + SERVICES_PER_PAGE)
      setLoadingMore(false)
    }, 500)
  }

  const handleRetry = () => {
    fetchServices()
  }

  const visibleServices = Array.isArray(services) ? services.slice(0, visibleCount) : []
  const hasMoreServices = services.length > visibleCount

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load services
        </h3>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          {error}
        </p>
        <Button onClick={handleRetry} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No services found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreServices && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            size="lg"
            className="px-8"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More (${services.length - visibleCount} remaining)`
            )}
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-600">
        Showing {Math.min(visibleCount, services.length)} of {services.length} services
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/service/${service.slug}`} className="block">
      <Card className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden bg-white">
        {/* Service Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={service.image || "/placeholder.svg?height=200&width=300"}
            alt={service.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {service.verified && (
            <div className="absolute top-3 right-3">
              <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
            </div>
          )}
          {/* {service.popular && (
            <div className="absolute top-3 left-3">
              <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                Popular
              </div>
            </div>
          )} */}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 flex-1">
              {service.name}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {service.description}
          </p>
          
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(service.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{service.rating}</span>
            <span className="text-sm text-gray-500">({service.reviews})</span>
          </div>

          {/* Price and Duration */}
          {/* <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ${service.startingPrice}
              </span>
              {service.duration && (
                <span className="text-sm text-gray-500 ml-1">
                  / {service.duration}
                </span>
              )}
            </div>
          </div> */}

          {/* Tags */}
          {/* {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {service.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {service.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{service.tags.length - 2} more
                </span>
              )}
            </div>
          )} */}

          {/* Book Now Button */}
          <div className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-center transition-colors">
            Book Now
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
