import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, Shield, Award } from "lucide-react"

interface Service {
  _id: string
  name: string
  category: {
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

interface ServiceDetailProps {
  service: Service
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={service.image || "/placeholder.svg?height=400&width=600"}
          alt={service.name}
          fill
          className="object-cover"
        />
        {service.verified && (
          <Badge className="absolute top-4 left-4 bg-green-500">
            <Shield className="w-4 h-4 mr-1" />
            Verified
          </Badge>
        )}
        {service.popular && <Badge className="absolute top-4 right-4 bg-blue-500">Popular</Badge>}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{service.category.name}</Badge>
          {service.verified && <Award className="w-5 h-5 text-green-500" />}
        </div>
        <h1 className="text-3xl font-bold mb-4">{service.name}</h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{service.rating}</span>
            <span className="text-gray-500">({service.reviews} reviews)</span>
          </div>
          {service.duration && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{service.duration}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {service.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* <div className="mb-6">
          <span className="text-gray-600">Starting at</span>
          <div className="text-3xl font-bold text-blue-600">₹{service.startingPrice}</div>
        </div> */}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Service Description</h2>
          <p className="text-gray-700 leading-relaxed">{service.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">What's Included</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Professional service delivery
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Quality assurance guarantee
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Customer support
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Flexible scheduling
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
