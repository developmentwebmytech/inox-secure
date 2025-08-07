"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Star, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateSlug } from "@/lib/utils"
import ImageUpload from "@/components/ImageUpload"
import Image from "next/image"

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
  isActive: boolean
  createdAt: string
}

interface Category {
  _id: string
  name: string
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    startingPrice: "",
    duration: "",
    image: "",
    verified: false,
    popular: false,
    tags: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const servicesPerPage = 5

  // Calculate which services to show
  const indexOfLastService = currentPage * servicesPerPage
  const indexOfFirstService = indexOfLastService - servicesPerPage
  const currentServices = services.slice(indexOfFirstService, indexOfLastService)

  const totalPages = Math.ceil(services.length / servicesPerPage)

  const { toast } = useToast()

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services")
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
      const response = await fetch("/api/admin/service-categories")
      const data = await response.json()
      setCategories(data.filter((cat: Category & { isActive: boolean }) => cat.isActive))
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const serviceData = {
        ...formData,
        slug: generateSlug(formData.name),
        startingPrice: Number.parseFloat(formData.startingPrice),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }

      const url = editingService ? `/api/admin/services/${editingService._id}` : "/api/admin/services"
      const method = editingService ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (response.ok) {
        toast({
          title: editingService ? "Service Updated" : "Service Created",
          description: `Service has been ${editingService ? "updated" : "created"} successfully.`,
        })
        fetchServices()
        setDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save service")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      category: service.category._id,
      description: service.description,
      startingPrice: service?.startingPrice?.toString(),
      duration: service.duration || "",
      image: service.image || "",
      verified: service.verified,
      popular: service.popular,
      tags: service.tags.join(", "),
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Service Deleted",
          description: "Service has been deleted successfully.",
        })
        fetchServices()
      } else {
        throw new Error("Failed to delete service")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      startingPrice: "",
      duration: "",
      image: "",
      verified: false,
      popular: false,
      tags: "",
    })
    setEditingService(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-gray-600">Manage your service offerings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startingPrice">Starting Price (₹)</Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startingPrice: e.target.value }))}

                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 1-2 hours"
                  />
                </div>
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                folder="services"
                label="Service Image"
              />

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="Emergency Service, Licensed, 24/7 Available"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={formData.verified}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, verified: checked as boolean }))}
                  />
                  <Label htmlFor="verified">Verified Service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, popular: checked as boolean }))}
                  />
                  <Label htmlFor="popular">Popular Service</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingService ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div>Loading services...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentServices.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>
                      {service.image ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="flex gap-1 mt-1">
                          {service.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                          {service.popular && (
                            <Badge variant="default" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{service.category.name}</TableCell>
                    <TableCell>₹{service.startingPrice}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span className="text-gray-500">({service.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${service.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the service.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(service._id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          )}

          <div className="flex justify-center items-center gap-4 p-6">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md font-medium transition ${currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-black border border-gray-300"
                }`}
            >
              Previous
            </Button>

            <span className="text-sm font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md font-medium transition ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-black border border-gray-300"
                }`}
            >
              Next
            </Button>
          </div>


        </CardContent>
      </Card>
    </div>
  )
}
