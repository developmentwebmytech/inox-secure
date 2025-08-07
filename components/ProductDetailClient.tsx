"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Phone, Minus, Plus, MessageSquare, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useProductAction } from "@/contexts/ProductActionContext"
import { ProductCard } from "./ProductCard"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { AuthModal } from "./AuthModal";

interface Review {
  _id: string
  user_id?: { name: string }
  admin_id?: { name: string }
  name: string
  rating: number
  title: string
  comment: string
  verified_purchase: boolean
  is_admin_review: boolean
  images?: string[]
  createdAt: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
}

interface ProductDetailClientProps {
  product: any
  relatedProducts: any[]
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { data: session } = useSession()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [canReview, setCanReview] = useState(true)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  })

  const { addToCart } = useCart()
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { showProductAction } = useProductAction()

    const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    fetchReviews()
    if (session?.user?.id) {
      checkCanReview()
    }
  }, [product._id, session])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${product._id}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setReviewStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const checkCanReview = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/can-review/${product._id}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Can review:", data.canReview)
        setCanReview(data.canReview)
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error)
    }
  }

  const handleSubmitReview = async () => {
    if (!session?.user?.id) {
      toast.error("Please login to submit a review")
      return
    }

    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      })

      if (response.ok) {
        toast.success("Review submitted successfully! It will be visible after admin verification.")
        setShowReviewForm(false)
        setReviewForm({ rating: 5, title: "", comment: "" })
        fetchReviews()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    }
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.title,
      price: selectedVariant.price,
      image: product.images[0]?.url || "",
      quantity,
    })
    showProductAction(
      {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice,
        image: product.images[0]?.url || "",
        quantity,
      },
      "cart",
    )
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist({
        id: product._id,
        productId: product._id,
        name: product.title,
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice,
        image: product.images[0]?.url || "",
        inStock: selectedVariant.inventoryQuantity > 0,
      })
      showProductAction(
        {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: selectedVariant.price,
          compareAtPrice: selectedVariant.compareAtPrice,
          image: product.images[0]?.url || "",
        },
        "wishlist",
      )
    }
  }

  const renderStars = (rating: number, size = "h-4 w-4") => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`${size} ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-8">{rating}★</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-gray-600">{count}</span>
      </div>
    )
  }

  const discountPercentage = selectedVariant.compareAtPrice
    ? Math.round((1 - selectedVariant.price / selectedVariant.compareAtPrice) * 100)
    : 0

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span>Home</span> / <span>{product.category?.name}</span> /{" "}
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white rounded-lg border overflow-hidden">
              <Image
                src={product.images[selectedImage]?.url || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain"
              />
              {product.isHotDeal && <Badge className="absolute top-4 left-4 bg-red-500 text-white">Hot Deal</Badge>}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative bg-white rounded border overflow-hidden ${selectedImage === index ? "ring-2 ring-[#0042adef]" : ""
                      }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">{renderStars(Math.round(reviewStats.averageRating))}</div>
                <span className="text-sm text-gray-600">
                  ({reviewStats.averageRating.toFixed(1)}) {reviewStats.totalReviews} Reviews
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              {product.brand && (
                <p className="text-gray-600">
                  Brand: <span className="font-medium">{product.brand.name}</span>
                </p>
              )}
            </div>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-medium">Select Variant:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${selectedVariant._id === variant._id
                        ? "border-[#0042adef] bg-[#0042adef] text-white"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {variant.title} - ₹{variant.price.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">₹{selectedVariant.price.toLocaleString()}</span>
              {selectedVariant.compareAtPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{selectedVariant.compareAtPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>

            <div className="space-y-4">

              <div>
                <span className="text-sm font-medium text-gray-700">Delivery:</span>
                <span className="ml-2 text-sm text-green-600">10-15 days</span>
              </div>


              {/* CHANGE IN PRODUCT DETAIL FOR QUANTITY AND AVAILABILITY */}
              <div>
                <span className="text-sm font-medium text-gray-700">Availability:</span>
                <Badge
                  variant={selectedVariant.inventoryQuantity > 0 ? "default" : "destructive"}
                  className="ml-2"
                >
                  {selectedVariant.inventoryQuantity > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>

                <div className={`flex items-center border rounded ${selectedVariant.inventoryQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    disabled={selectedVariant.inventoryQuantity === 0 || quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="px-4 py-1 border-x min-w-[2rem] text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => {
                      if (quantity < selectedVariant.inventoryQuantity) {
                        setQuantity(quantity + 1);
                      }
                    }}
                    className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    disabled={selectedVariant.inventoryQuantity === 0 || quantity >= selectedVariant.inventoryQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>



            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-[#0042adef] hover:bg-[#0042ad] text-white"
                onClick={handleAddToCart}
                disabled={selectedVariant.inventoryQuantity === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={handleWishlistToggle}>
                <Heart className={`h-5 w-5 mr-2 ${isInWishlist(product._id) ? "fill-current text-red-500" : ""}`} />
                {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm">Free delivery on orders above ₹499</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <span className="text-sm">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="features" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviewStats.totalReviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Features</h3>
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">General</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt>Brand:</dt>
                        <dd>{product.brand?.name || "INOX"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Model:</dt>
                        <dd>{product.handle.toUpperCase()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Category:</dt>
                        <dd>{product.category?.name}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Variants</h4>
                    <dl className="space-y-1 text-sm">
                      {product.variants.map((variant: any, index: number) => (
                        <div key={variant._id} className="flex justify-between">
                          <dt>{variant.title}:</dt>
                          <dd>₹{variant.price.toLocaleString()}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Review Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{reviewStats.averageRating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(Math.round(reviewStats.averageRating), "h-6 w-6")}
                      </div>
                      <p className="text-gray-600">{reviewStats.totalReviews} reviews</p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) =>
                        renderRatingBar(rating, reviewStats.ratingDistribution[rating] || 0),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Write Review */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Write a Review</h3>
                    {session?.user ? (
                      <Button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Write Review
                      </Button>
                    ) : (
                      <Button
                     
                        className=" bg-blue-600 hover:bg-blue-600"
                        onClick={() => setIsAuthOpen(true)}
                      >
                        Write Review
                      </Button>
                    )
                    }
                  </div>

                  {showReviewForm && (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="p-1"
                            >
                              <Star
                                className={`h-6 w-6 ${star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <Input
                        placeholder="Review Title"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      />

                      <Textarea
                        placeholder="Write your review..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows={4}
                      />

                      <div className="flex gap-2">
                        <Button onClick={handleSubmitReview} className="bg-blue-600 hover:bg-blue-700">
                          Submit Review
                        </Button>
                        <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review._id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
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
                            <h4 className="font-semibold">{review.title}</h4>
                            <p className="text-sm text-gray-600">
                              By {review.is_admin_review ? review.admin_id?.name || review.name : review.name}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2">
                            {review.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Review image ${index + 1}`}
                                width={80}
                                height={80}
                                className="rounded object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
         <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    </main>
  )
}
