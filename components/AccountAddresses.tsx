"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Edit, Trash2, Home, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Address {
  _id: string
  type: string
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export function AccountAddresses() {
  const { data: session } = useSession()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    type: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchAddresses()
    }
  }, [session])

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/addresses`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }))
  }

  const handleAddOrUpdateAddress = async () => {
    if (
      !formData.type ||
      !formData.fullName ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode ||
      !formData.phone
    ) {
      alert("Please fill in all required fields.")
      return
    }

    try {
      const method = editingAddressId ? "PUT" : "POST"
      const body = editingAddressId
        ? { addressId: editingAddressId, updatedAddress: formData }
        : formData

      const res = await fetch(`/api/users/${session?.user?.id}/addresses`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setFormData({
          type: "",
          fullName: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          phone: "",
        })
        setIsDialogOpen(false)
        setEditingAddressId(null)
        fetchAddresses()
      } else {
        console.error("Failed to submit address")
      }
    } catch (error) {
      console.error("Error submitting address:", error)
    }
  }

  const handleEditClick = (address: Address) => {
    setFormData({
      type: address.type,
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
    })
    setEditingAddressId(address._id)
    setIsDialogOpen(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      const res = await fetch(`/api/users/${session?.user?.id}/addresses`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      })

      if (res.ok) {
        fetchAddresses()
      } else {
        console.error("Failed to delete address")
      }
    } catch (error) {
      console.error("Error deleting address:", error)
    }
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />
      case "office":
        return <Building className="h-5 w-5" />
      default:
        return <Home className="h-5 w-5" />
    }
  }

  if (loading) {
    return <div>Loading addresses...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Saved Addresses</h2>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingAddressId(null)
            setFormData({
              type: "",
              fullName: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              postalCode: "",
              country: "India",
              phone: "",
            })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#0042adef] hover:bg-[#0042ad] gap-2">
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAddressId ? "Edit Address" : "Add New Address"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Address Type</Label>
                <Select onValueChange={handleSelectChange} value={formData.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input id="addressLine1" value={formData.addressLine1} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input id="addressLine2" value={formData.addressLine2} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={formData.state} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" value={formData.postalCode} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={formData.country} disabled />
                </div>
              </div>
              <Button onClick={handleAddOrUpdateAddress} className="w-full bg-[#0042adef] hover:bg-[#0042ad]">
                {editingAddressId ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No addresses saved</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAddressIcon(address.type)}
                    <CardTitle className="text-lg capitalize">{address.type}</CardTitle>
                  </div>
                  {address.isDefault && (
                    <Badge className="bg-orange-100 text-orange-800">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">📞 {address.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => handleEditClick(address)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDeleteAddress(address._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
