"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PendingMerchant {
  _id: string
  businessName: string
  businessType: string
  address: string
  gstNumber: string
  panNumber: string
  bankDetails: {
    accountNumber: string
    ifscCode: string
    bankName: string
    accountHolderName: string
  }
  userId: {
    name: string
    email: string
    phone: string
  }
  agentId: {
    name: string
    email: string
  }
  createdAt: string
  status: string
}

export default function PendingMerchantsPage() {
  const [merchants, setMerchants] = useState<PendingMerchant[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedMerchant, setSelectedMerchant] = useState<PendingMerchant | null>(null)

  useEffect(() => {
    fetchPendingMerchants()
  }, [])

  const fetchPendingMerchants = async () => {
    try {
      const response = await fetch("/api/admin/merchants?status=pending")
      const data = await response.json()
      setMerchants(data.merchants || [])
    } catch (error) {
      console.error("Failed to fetch pending merchants:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (merchantId: string, action: "approve" | "reject") => {
    setActionLoading(merchantId)
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchPendingMerchants()
      }
    } catch (error) {
      console.error(`Failed to ${action} merchant:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return <div className="p-6">Loading pending merchants...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/merchants">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Merchants
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Pending Merchant Approvals</h1>
        <Badge variant="secondary">{merchants.length} pending</Badge>
      </div>

      {merchants.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No pending merchant approvals</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {merchants.map((merchant) => (
            <Card key={merchant._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{merchant.businessName}</h3>
                      <Badge variant="outline">{merchant.businessType}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p>
                          <strong>Owner:</strong> {merchant.userId.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {merchant.userId.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {merchant.userId.phone}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Agent:</strong> {merchant.agentId.name}
                        </p>
                        <p>
                          <strong>PAN:</strong> {merchant.panNumber}
                        </p>
                        <p>
                          <strong>Applied:</strong> {new Date(merchant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedMerchant(merchant)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Merchant Details</DialogTitle>
                        </DialogHeader>
                        {selectedMerchant && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold">Business Information</h4>
                                <p>
                                  <strong>Name:</strong> {selectedMerchant.businessName}
                                </p>
                                <p>
                                  <strong>Type:</strong> {selectedMerchant.businessType}
                                </p>
                                <p>
                                  <strong>Address:</strong> {selectedMerchant.address}
                                </p>
                                <p>
                                  <strong>GST:</strong> {selectedMerchant.gstNumber || "N/A"}
                                </p>
                                <p>
                                  <strong>PAN:</strong> {selectedMerchant.panNumber}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Bank Details</h4>
                                <p>
                                  <strong>Account Holder:</strong> {selectedMerchant.bankDetails.accountHolderName}
                                </p>
                                <p>
                                  <strong>Account Number:</strong> {selectedMerchant.bankDetails.accountNumber}
                                </p>
                                <p>
                                  <strong>IFSC:</strong> {selectedMerchant.bankDetails.ifscCode}
                                </p>
                                <p>
                                  <strong>Bank:</strong> {selectedMerchant.bankDetails.bankName}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      onClick={() => handleApproval(merchant._id, "approve")}
                      disabled={actionLoading === merchant._id}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleApproval(merchant._id, "reject")}
                      disabled={actionLoading === merchant._id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
