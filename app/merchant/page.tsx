"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wallet, Clock, Download, CreditCard, PlusCircle } from "lucide-react"
import Link from "next/link"

interface MerchantStats {
  walletBalance: number
  lockedAmount: number
  maturityDate: string | null
  daysToMaturity: number
  totalDeposits: number
  activeCoupons: number
  totalTransactions: number
}

export default function MerchantDashboard() {
  const [stats, setStats] = useState<MerchantStats>({
    walletBalance: 0,
    lockedAmount: 0,
    maturityDate: null,
    daysToMaturity: 0,
    totalDeposits: 0,
    activeCoupons: 0,
    totalTransactions: 0,
  })

  useEffect(() => {
    fetchMerchantStats()
  }, [])

  const fetchMerchantStats = async () => {
    try {
      const response = await fetch("/api/merchant/dashboard-stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch merchant stats:", error)
    }
  }

  const maturityProgress =
    stats.maturityDate && stats.daysToMaturity > 0 ? ((90 - stats.daysToMaturity) / 90) * 100 : 100

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/merchant/wallet/topup">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="w-4 h-4 mr-2" />
              Top Up Wallet
            </Button>
          </Link>
          <Link href="/merchant/coupons">
            <Button>
              <CreditCard className="w-4 h-4 mr-2" />
              My Coupons
            </Button>
          </Link>
        </div>
      </div>

      {/* Wallet Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.walletBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Locked Amount</p>
              <p className="text-2xl font-bold text-orange-600">₹{stats.lockedAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Deposits</p>
              <p className="text-2xl font-bold">₹{stats.totalDeposits.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maturity Countdown */}
      {stats.maturityDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Maturity Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Days remaining</span>
                <Badge variant={stats.daysToMaturity <= 30 ? "default" : "secondary"}>
                  {stats.daysToMaturity} days
                </Badge>
              </div>
              <Progress value={maturityProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Maturity Date: {new Date(stats.maturityDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCoupons}</div>
            <Link href="/merchant/coupons">
              <Button variant="link" className="p-0 h-auto">
                View Coupons
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <Link href="/merchant/transactions">
              <Button variant="link" className="p-0 h-auto">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deposit History</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeposits > 0 ? "Available" : "None"}</div>
            <Link href="/merchant/deposits">
              <Button variant="link" className="p-0 h-auto">
                View Deposits
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/merchant/coupons">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                View My Coupons
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports & History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/merchant/transactions">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Transaction History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
