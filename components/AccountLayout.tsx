"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { User, Package, MapPin, CreditCard, Heart, Settings, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountOverview } from "./AccountOverview"
import { AccountOrders } from "./AccountOrders"
import { AccountAddresses } from "./AccountAddresses"
import { AccountPayment } from "./AccountPayment"
import { AccountWishlist } from "./AccountWishlist"
// import { AccountSettings } from "./AccountSettings"
import { signOut } from "next-auth/react"
interface AccountLayoutProps {
  children?: React.ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const { data: session } = useSession()
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    memberSince: "",
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserStats()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/stats`)
      if (response.ok) {
        const stats = await response.json()
        setUserStats(stats)
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-4">
              <div className="text-center mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="text-lg bg-gray-200">
                    {session?.user?.name ? getInitials(session.user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{session?.user?.name || "User"}</h3>
                <p className="text-gray-600 text-sm">{session?.user?.email}</p>
                <Badge className="mt-2 bg-orange-100 text-orange-800">
                  Member since {userStats.memberSince || "January 2023"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{userStats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-semibold">₹{userStats.totalSpent.toLocaleString()}</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loyalty Points</span>
                  <span className="font-semibold text-[#0042adef]">{userStats.loyaltyPoints}</span>
                </div> */}
                <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded" onClick={() => signOut({ callbackUrl: "/"} )}>Log Out</button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 ">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="overview" className="gap-2">
                  <User className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="addresses" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Addresses
                </TabsTrigger>
                {/* <TabsTrigger value="payment" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment
                </TabsTrigger> */}
                <TabsTrigger value="wishlist" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </TabsTrigger>
                {/* <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="overview">
                <AccountOverview userStats={userStats} />
              </TabsContent>

              <TabsContent value="orders">
                <AccountOrders />
              </TabsContent>

              <TabsContent value="addresses">
                <AccountAddresses />
              </TabsContent>

              <TabsContent value="payment">
                <AccountPayment />
              </TabsContent>

              <TabsContent value="wishlist">
                <AccountWishlist />
              </TabsContent>

              {/* <TabsContent value="settings">
                <AccountSettings />
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
