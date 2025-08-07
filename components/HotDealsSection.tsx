"use client"

import { useEffect, useState } from "react"
import { Flame, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./ProductCard"
import Link from "next/link"

export function HotDealsSection() {
  const [hotDeals, setHotDeals] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHotDeals()
  }, [])

  const fetchHotDeals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products/hot-deals")
      if (response.ok) {
        const data = await response.json()
        setHotDeals(data.products)
      }
    } catch (error) {
      console.error("Failed to fetch hot deals:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-8 w-8 text-red-500 animate-pulse" />
              <h2 className="text-3xl font-bold text-red-600">Hot Deals</h2>
              <Flame className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
            <p className="text-gray-600">Loading amazing deals...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (hotDeals.length === 0) {
    return null
  }

  const itemsToShow = Math.min(4, hotDeals.length)
  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < hotDeals.length - itemsToShow

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-red-500">
          <Flame className="h-32 w-32" />
        </div>
        <div className="absolute bottom-10 right-10 text-orange-500">
          <Flame className="h-24 w-24" />
        </div>
        <div className="absolute top-1/2 left-1/4 text-red-400">
          <Flame className="h-16 w-16" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="h-8 w-8 text-red-500 animate-bounce" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              🔥 Hot Deals 🔥
            </h2>
            <Flame className="h-8 w-8 text-red-500 animate-bounce" />
          </div>
          <p className="text-gray-700 text-lg">Limited time offers you can't miss!</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
            <span className="animate-pulse">⚡</span>
            Hurry! Limited stock available
            <span className="animate-pulse">⚡</span>
          </div>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="h-10 w-10 bg-white border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <ChevronLeft className="h-5 w-5 text-red-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                disabled={!canScrollRight}
                className="h-10 w-10 bg-white border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <ChevronRight className="h-5 w-5 text-red-600" />
              </Button>
            </div>
            <Link href="/products?hotDeals=true">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                View All Hot Deals →
              </Button>
            </Link>
          </div>

          {/* Products Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {hotDeals.map((product) => (
                <div key={product._id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <div className="relative">
                    {/* Hot Deal Badge */}
                    <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      🔥 HOT
                    </div>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {hotDeals.length > itemsToShow && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(hotDeals.length / itemsToShow) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    Math.floor(currentIndex / itemsToShow) === index ? "bg-red-500" : "bg-red-200 hover:bg-red-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border border-red-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Don't Miss Out!</h3>
            <p className="text-gray-600 mb-4">These deals won't last long. Grab them before they're gone!</p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8">
                Shop All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
