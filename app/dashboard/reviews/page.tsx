"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Check, X, Plus, Search, Filter } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Review {
  _id: string
  product_id: {
    _id: string
    title: string
    images: { url: string }[]
  }
  user_id?: {
    name: string
    email: string
  }
  name: string
  email: string
  rating: number
  title: string
  comment: string
  verified_purchase: boolean
  is_verified: boolean
  is_admin_review: boolean
  images?: string[]
  createdAt: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [products, setProducts] = useState([])

  // Add review form state
  const [newReview, setNewReview] = useState({
    product_id: "",
    rating: 5,
    title: "",
    comment: "",
  })

  useEffect(() => {
    fetchReviews()
    fetchProducts()
  }, [filter])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/admin/reviews?status=${filter}&search=${searchTerm}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleVerifyReview = async (reviewId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast.success(`Review ${action}d successfully`)
        fetchReviews()
      } else {
        toast.error(`Failed to ${action} review`)
      }
    } catch (error) {
      console.error(`Error ${action}ing review:`, error)
      toast.error(`Failed to ${action} review`)
    }
  }

  const handleAddAdminReview = async () => {
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })

      if (response.ok) {
        toast.success("Admin review added successfully")
        setShowAddForm(false)
        setNewReview({ product_id: "", rating: 5, title: "", comment: "" })
        fetchReviews()
      } else {
        toast.error("Failed to add review")
      }
    } catch (error) {
      console.error("Error adding review:", error)
      toast.error("Failed to add review")
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return <div className="p-6">Loading reviews...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reviews Management</h1>
          <p className="text-gray-600">Manage product reviews and ratings</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Admin Review
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending Reviews</SelectItem>
            <SelectItem value="approved">Approved Reviews</SelectItem>
            <SelectItem value="rejected">Rejected Reviews</SelectItem>
            <SelectItem value="all">All Reviews</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchReviews} variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Admin Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={newReview.product_id}
              onValueChange={(value) => setNewReview({ ...newReview, product_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product: any) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="p-1">
                    <Star
                      className={`h-6 w-6 ${star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Input
              placeholder="Review Title"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
            />

            <Textarea
              placeholder="Review Comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
            />

            <div className="flex gap-2">
              <Button onClick={handleAddAdminReview} className="bg-blue-600 hover:bg-blue-700">
                Add Review
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No reviews found</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Image
                    src={review.product_id.images[0]?.url || "/placeholder.svg"}
                    alt={review.product_id.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{review.product_id.title}</h3>
                        <p className="text-sm text-gray-600">
                          By {review.name} ({review.email})
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          {review.verified_purchase && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                          {review.is_admin_review && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">Admin Review</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!review.is_verified && !review.is_admin_review && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleVerifyReview(review._id, "approve")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleVerifyReview(review._id, "reject")}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {review.is_verified && <Badge className="bg-green-100 text-green-800">Approved</Badge>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">{review.title}</h4>
                      <p className="text-gray-700 mt-1">{review.comment}</p>
                    </div>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2">
                        {review.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Review image ${index + 1}`}
                            width={60}
                            height={60}
                            className="rounded object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
