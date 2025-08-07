"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading")
  const [message, setMessage] = useState("")
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const txnId = searchParams.get("txnId")
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (txnId && orderId) {
      verifyPayment()
    }
  }, [txnId, orderId])

  const verifyPayment = async () => {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txnId,
          orderId: orderId,
        }),
      })
      const data = await response.json()
     console.log("data", data)
      if (data.success) {
        setStatus("success")
        setMessage(data.message)
        setOrderDetails(data.order)

        // Redirect to order confirmation after 3 seconds
        setTimeout(() => {
          router.push(`/order-confirmation/${orderId}`)
        }, 3000)
      } else {
        setStatus(data.status === "pending" ? "pending" : "failed")
        setMessage(data.message)
      }
    } catch (error) {
      setStatus("failed")
      setMessage("Payment verification failed")
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-500" />
      default:
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "pending":
        return "text-yellow-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Payment Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">{getStatusIcon()}</div>

          <div>
            <h2 className={`text-xl font-semibold ${getStatusColor()}`}>
              {status === "loading" && "Verifying Payment..."}
              {status === "success" && "Payment Successful!"}
              {status === "failed" && "Payment Failed"}
              {status === "pending" && "Payment Pending"}
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>

          {orderDetails && (
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">Order ID: {orderDetails.orderNumber}</p>
              <p className="text-sm text-gray-600">Transaction ID: {orderDetails.transactionId}</p>
              <p className="text-sm text-gray-600">Status: {orderDetails.paymentStatus}</p>
            </div>
          )}

          <div className="space-y-2">
            {status === "success" && (
              <p className="text-sm text-gray-500">Redirecting to order confirmation in 3 seconds...</p>
            )}

            {status === "failed" && (
              <div className="space-y-2">
                <Button onClick={() => router.push("/checkout")} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                  Go to Home
                </Button>
              </div>
            )}

            {status === "pending" && (
              <div className="space-y-2">
                <Button onClick={verifyPayment} className="w-full">
                  Check Status Again
                </Button>
                <Button variant="outline" onClick={() => router.push(`/account/orders/${orderId}`)} className="w-full">
                  View Order Details
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
