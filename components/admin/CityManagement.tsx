"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface City {
  _id: string
  name: string
  state: string
  isActive: boolean
  createdAt: string
}

export default function CityManagement() {
  const [cities, setCities] = useState<City[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    state: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    filterCities()
  }, [cities, searchTerm])

  const fetchCities = async () => {
    try {
      const response = await fetch("/api/admin/cities")
      const data = await response.json()
      setCities(data)
    } catch (error) {
      console.error("Error fetching cities:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCities = () => {
    let filtered = cities

    if (searchTerm) {
      filtered = filtered.filter(
        (city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.state.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCities(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCity ? `/api/admin/cities/${editingCity._id}` : "/api/admin/cities"
      const method = editingCity ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingCity ? "City Updated" : "City Added",
          description: `City has been ${editingCity ? "updated" : "added"} successfully.`,
        })
        fetchCities()
        setDialogOpen(false)
        resetForm()
      } else {
        throw new Error("Failed to save city")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save city. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (city: City) => {
    setEditingCity(city)
    setFormData({
      name: city.name,
      state: city.state,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "City Deleted",
          description: "City has been deleted successfully.",
        })
        fetchCities()
      } else {
        throw new Error("Failed to delete city")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete city. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleCityStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `City has been ${!currentStatus ? "activated" : "deactivated"}.`,
        })
        fetchCities()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update city status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ name: "", state: "" })
    setEditingCity(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Cities
          </h2>
          <p className="text-gray-600">Manage cities where your services are available</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCity ? "Edit City" : "Add New City"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">City Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Enter city name"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    required
                    placeholder="Enter state name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingCity ? "Update" : "Add City"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading cities...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.map((city) => (
                  <TableRow key={city._id}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>{city.state}</TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${
                          city.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                        onClick={() => toggleCityStatus(city._id, city.isActive)}
                      >
                        {city.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(city.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(city)}>
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
                                This action cannot be undone. This will permanently delete the city and may affect
                                existing bookings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(city._id)}>Delete</AlertDialogAction>
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
        </CardContent>
      </Card>
    </div>
  )
}
