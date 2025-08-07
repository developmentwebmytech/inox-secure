"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PincodeBlacklist {
  _id: string
  pincode: string
  city?: string
  state?: string
  reason?: string
  isActive: boolean
  createdAt: string
}

export default function PincodeManagement() {
  const [pincodes, setPincodes] = useState<PincodeBlacklist[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPincode, setEditingPincode] = useState<PincodeBlacklist | null>(null)
  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    state: "",
    reason: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPincodes()
  }, [])

  const fetchPincodes = async () => {
    try {
      const response = await fetch("/api/admin/pincodes")
      const data = await response.json()
      setPincodes(data)
    } catch (error) {
      console.error("Error fetching pincodes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingPincode ? `/api/admin/pincodes/${editingPincode._id}` : "/api/admin/pincodes"

      const method = editingPincode ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingPincode ? "Pincode Updated" : "Pincode Added",
          description: `Pincode has been ${editingPincode ? "updated" : "added to blacklist"} successfully.`,
        })
        fetchPincodes()
        setDialogOpen(false)
        resetForm()
      } else {
        throw new Error("Failed to save pincode")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pincode. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (pincode: PincodeBlacklist) => {
    setEditingPincode(pincode)
    setFormData({
      pincode: pincode.pincode,
      city: pincode.city || "",
      state: pincode.state || "",
      reason: pincode.reason || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pincodes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Pincode Removed",
          description: "Pincode has been removed from blacklist successfully.",
        })
        fetchPincodes()
      } else {
        throw new Error("Failed to delete pincode")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove pincode. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ pincode: "", city: "", state: "", reason: "" })
    setEditingPincode(null)
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
            Pincode Blacklist
          </h2>
          <p className="text-gray-600">Manage restricted service areas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Pincode
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPincode ? "Edit Blacklisted Pincode" : "Add Pincode to Blacklist"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pincode: e.target.value }))}
                  required
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="City name"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    placeholder="State name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="reason">Reason for Blacklisting</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Explain why this pincode is blacklisted"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingPincode ? "Update" : "Add to Blacklist"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div>Loading blacklisted pincodes...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pincode</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pincodes.map((pincode) => (
                  <TableRow key={pincode._id}>
                    <TableCell className="font-medium">{pincode.pincode}</TableCell>
                    <TableCell>
                      {pincode.city && pincode.state
                        ? `${pincode.city}, ${pincode.state}`
                        : pincode.city || pincode.state || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={pincode.reason}>
                        {pincode.reason || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          pincode.isActive ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pincode.isActive ? "Blacklisted" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(pincode.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(pincode)}>
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
                                This action cannot be undone. This will permanently remove the pincode from blacklist.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(pincode._id)}>Remove</AlertDialogAction>
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
