"use client"

import { useEffect, useState } from "react"
import { Package, Star, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AccountOverviewProps {
  userStats: {
    totalOrders: number
    totalSpent: number
    loyaltyPoints: number
    memberSince: string
  }
}

export function AccountOverview({ userStats }: AccountOverviewProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/account/me")
      const data = await res.json()
      setName(data.name)
      setEmail(data.email)
      setPhone(data.phone || "")
    }

    fetchUser()
  }, [])

  const handleSave = async () => {
    const res = await fetch("/api/account/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    })

    if (res.ok) {
      toast.success("Profile updated!")
    } else {
      toast.error("Failed to update profile.")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <p className="text-gray-600">Update your personal details</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <Button className="bg-[#0042adef]" onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Package className="h-12 w-12 mx-auto mb-4 text-[#0042adef]" />
            <div className="text-3xl font-bold text-gray-900 mb-2">{userStats.totalOrders}</div>
            <div className="text-gray-600">Total Orders</div>
          </CardContent>
        </Card>
        {/* <Card className="text-center">
          <CardContent className="p-6">
            <Star className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <div className="text-3xl font-bold text-gray-900 mb-2">{userStats.loyaltyPoints}</div>
            <div className="text-gray-600">Loyalty Points</div>
          </CardContent>
        </Card> */}
        <Card className="text-center">
          <CardContent className="p-6">
            <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
            <div className="text-gray-600">Wishlist Items</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
