import { Suspense } from "react"
import ServiceGrid from "@/components/services/ServiceGrid"
import CategoryNavigation from "@/components/services/CategoryNavigation"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-800 to-transparent py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Professional Services at Your Doorstep
            </h1>
            <p className="text-xl mb-8 opacity-90 text-white">
              Find trusted professionals for all your service needs. Verified
              experts, transparent pricing, guaranteed satisfaction.
            </p>


          </div>
        </div>
      </div>
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoryNavigation />
          </Suspense>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading services...</div>}>
          <ServiceGrid />
        </Suspense>
      </div>
    </div>
  )
}
