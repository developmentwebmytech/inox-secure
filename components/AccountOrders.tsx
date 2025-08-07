"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Eye, Download, Calendar, Package, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface OrderItem {
  product_id: string
  variation_id: string
  name: string
  quantity: number
  price: number
  image?: string
  size?: string
  color?: string
}

interface Order {
  _id: string
  order_number: string
  total: number
  subtotal: number
  discount: number
  status: string
  payment_status: string
  payment_method: string
  createdAt: string
  items: OrderItem[]
  tracking_number?: string
  shipping_carrier?: string
  estimated_delivery?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export function AccountOrders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders()
    }
  }, [session, pagination.page, filters])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (filters.status !== "all") {
        params.append("status", filters.status)
      }

      const response = await fetch(`/api/users/${session?.user?.id}/orders?${params}`)

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setPagination(data.pagination)
      } else {
        toast.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (orderId: string) => {
    window.open(`/account/orders/${orderId}`, "_blank")
  }

  const handleDownloadInvoice = async (orderId: string, orderNumber: string) => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/orders/${orderId}/invoice`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `invoice-${orderNumber}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success("Invoice downloaded successfully")
      } else {
        toast.error("Failed to download invoice")
      }
    } catch (error) {
      console.error("Failed to download invoice:", error)
      toast.error("Failed to download invoice")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "returned":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filters.search) {
      return (
        order.order_number.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }
    return true
  })

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Order History</h2>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => ["pending", "confirmed", "processing"].includes(o.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => ["cancelled", "returned"].includes(o.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No orders found</p>
            <p className="text-sm text-gray-400">
              {filters.search || filters.status !== "all"
                ? "Try adjusting your filters"
                : "Start shopping to see your orders here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{order.order_number}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getPaymentStatusColor(order.payment_status)}>
                        Payment: {order.payment_status}
                      </Badge>
                      <Badge variant="outline">{order.payment_method.toUpperCase()}</Badge>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <p>
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </p>
                      {order.tracking_number && <p>Tracking: {order.tracking_number}</p>}
                    </div>

                    {/* Order Items Preview */}
                    <div className="text-sm text-gray-600">
                      {order.items.slice(0, 2).map((item, index) => (
                        <p key={index}>
                          {item.name} × {item.quantity}
                          {item.size && ` (Size: ${item.size})`}
                          {item.color && ` (Color: ${item.color})`}
                        </p>
                      ))}
                      {order.items.length > 2 && <p>+{order.items.length - 2} more items</p>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-4">
                      {order.discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">₹{order.subtotal.toLocaleString()}</p>
                      )}
                      <p className="text-2xl font-bold text-blue-600">₹{order.total.toLocaleString()}</p>
                      {order.discount > 0 && (
                        <p className="text-sm text-green-600">Saved ₹{order.discount.toLocaleString()}</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handleViewOrder(order._id)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handleDownloadInvoice(order._id, order.order_number)}
                      >
                        <Download className="h-4 w-4" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={pagination.page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
