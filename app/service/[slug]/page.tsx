import { notFound } from "next/navigation"
import ServiceDetail from "@/components/ServiceDetail"
import BookingForm from "@/components/BookingForm"

async function getServiceBySlug(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/api/services/slug/${slug}`,
      {
        cache: "no-store",
      },
    )
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    return null
  }
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ServiceDetail service={service} />
          </div>
          <div className="lg:col-span-1">
            <BookingForm serviceId={service._id} serviceName={service.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
