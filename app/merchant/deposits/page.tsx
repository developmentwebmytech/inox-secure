"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Receipt, Clock } from "lucide-react"

interface Deposit {
  _id: string
  amount: number
  status: string
  receiptNumber: string
  notes: string
  maturityDate: string
  createdAt: string
  agentId: {
    name: string
    email: string
  }
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      const response = await fetch("/api/merchant/deposits")
      const data = await response.json()
      setDeposits(data.deposits || [])
    } catch (error) {
      console.error("Failed to fetch deposits:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = async (depositId: string, receiptNumber: string) => {
    try {
      const response = await fetch(`/api/merchant/deposits/${depositId}/receipt`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `receipt-${receiptNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download receipt:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysToMaturity = (maturityDate: string) => {
    const today = new Date()
    const maturity = new Date(maturityDate)
    const diffTime = maturity.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return <div className="p-6">Loading deposits...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deposit History</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Deposits</p>
          <p className="text-2xl font-bold">
            ₹{deposits.reduce((sum, deposit) => sum + deposit.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {deposits.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No deposits found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deposits.map((deposit) => {
            const daysToMaturity = getDaysToMaturity(deposit.maturityDate)
            const isMatured = daysToMaturity <= 0

            return (
              <Card key={deposit._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">₹{deposit.amount.toLocaleString()}</h3>
                        <Badge className={getStatusColor(deposit.status)}>{deposit.status.toUpperCase()}</Badge>
                        {isMatured ? (
                          <Badge className="bg-green-100 text-green-800">MATURED</Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {daysToMaturity} days left
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p>
                            <strong>Receipt Number:</strong> {deposit.receiptNumber}
                          </p>
                          <p>
                            <strong>Collected By:</strong> {deposit.agentId.name}
                          </p>
                          <p>
                            <strong>Deposit Date:</strong> {new Date(deposit.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Maturity Date:</strong> {new Date(deposit.maturityDate).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Status:</strong> {deposit.status}
                          </p>
                          {deposit.notes && (
                            <p>
                              <strong>Notes:</strong> {deposit.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(deposit._id, deposit.receiptNumber)}
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>

                      {isMatured && (
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Redeem
                        </Button>
                      )}
                    </div>
                  </div>

                  {!isMatured && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          This deposit will mature on {new Date(deposit.maturityDate).toLocaleDateString()}(
                          {daysToMaturity} days remaining)
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
