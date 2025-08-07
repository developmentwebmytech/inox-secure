"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Service {
  _id: string
  name: string
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
  slug: string
}

export default function ServiceGrid() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      const data = await response.json()
      // Show only first 8 services on homepage
      setServices(data.slice(0, 8))
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Card
            key={service._id}
            className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden bg-white"
          >
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
            </div>

            <CardContent className="p-4">
              {/* Service Title */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">{service.name}</h3>

              {/* Service Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(service.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                <span className="text-sm text-gray-500">({service.reviews})</span>
              </div>

              {/* Book Now Button */}
              <Link href={`/service/${service.slug}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Services Button */}
      <div className="text-center">
        <Link href="/services">
          <Button variant="outline" size="lg" className="group bg-transparent">
            View All Services
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
