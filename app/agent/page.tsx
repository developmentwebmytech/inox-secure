"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Wallet, FileText } from "lucide-react"
import Link from "next/link"

interface AgentStats {
  totalMerchants: number
  pendingMerchants: number
  totalDeposits: number
  monthlyCollection: number
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats>({
    totalMerchants: 0,
    pendingMerchants: 0,
    totalDeposits: 0,
    monthlyCollection: 0,
  })

  useEffect(() => {
    fetchAgentStats()
  }, [])

  const fetchAgentStats = async () => {
    try {
      const response = await fetch("/api/agent/dashboard-stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch agent stats:", error)
    }
  }

  return (
    <div className="p-6 space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/agent/merchants/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Merchant
            </Button>
          </Link>
          <Link href="/agent/deposits/collect">
            <Button variant="outline">
              <Wallet className="w-4 h-4 mr-2" />
              Collect Deposit
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Merchants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMerchants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Badge variant="secondary">{stats.pendingMerchants}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMerchants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalDeposits?.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.monthlyCollection?.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Merchant Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/agent/merchants">
              <Button variant="outline" className="w-full  bg-transparent text-center bg-blue-600 text-white">
                View My Merchants
              </Button>
            </Link>
            <Link href="/agent/merchants/add">
              <Button variant="outline" className="w-full  bg-transparent text-center mt-4 bg-blue-600 text-white">
                Add New Merchant
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deposit Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/agent/deposits/collect">
              <Button variant="outline" className="w-full  bg-transparent text-center bg-blue-600 text-white">
                Collect Deposit
              </Button>
            </Link>
            <Link href="/agent/deposits/history">
              <Button variant="outline" className="w-full  bg-transparent text-center bg-blue-600 text-white mt-4">
                Collection History
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/agent/reports/collections">
              <Button variant="outline" className="w-full  bg-transparent text-center bg-blue-600 text-white">
                Collection Reports
              </Button>
            </Link>
            <Link href="/agent/reports/merchants">
              <Button variant="outline" className="w-full  bg-transparent text-center bg-blue-600 text-white mt-4"> 
                Merchant Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
