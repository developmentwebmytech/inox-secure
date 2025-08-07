"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function MerchantWalletTopUpVerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const transactionId = searchParams.get("transactionId")
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading")
  const [message, setMessage] = useState("Verifying your payment...")

  useEffect(() => {
    if (transactionId) {
      verifyPayment()
    } else {
      setStatus("failed")
      setMessage("Invalid transaction ID.")
      toast({
        title: "Verification Failed",
        description: "Invalid transaction ID provided.",
        variant: "destructive",
      })
    }
  }, [transactionId])

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/merchant/wallet/topup/verify?transactionId=${transactionId}`)
      const data = await response.json()
     console.log(data)
      if (response.ok && data.success) {
        console.log("hello brother")
        setStatus(data.status)
        setMessage(data.message)
        if (data.status === "completed") {
          toast({
            title: "Payment Successful!",
            description: "Your wallet has been topped up.",
            variant: "default",
          })
          setTimeout(() => {
            router.push("/merchant") // Redirect to merchant dashboard
          }, 3000)
        } else if (data.status === "failed") {
          toast({
            title: "Payment Failed",
            description: data.message,
            variant: "destructive",
          })
        }
      } else {
        setStatus("failed")
        setMessage(data.message || "Payment verification failed.")
        toast({
          title: "Verification Failed",
          description: data.message || "An error occurred during verification.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      setStatus("failed")
      setMessage("An unexpected error occurred during verification.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "pending":
        return <AlertCircle className="h-16 w-16 text-yellow-500" />
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (status) {
      case "loading":
        return "Verifying Payment"
      case "success":
        return "Payment Successful!"
      case "failed":
        return "Payment Failed"
      case "pending":
        return "Payment Pending"
      default:
        return "Payment Status"
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center space-y-4 p-6">
          {getIcon()}
          <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-muted-foreground mb-6">{message}</p>
          {status === "failed" && (
            <Button
              onClick={() => router.push("/merchant/wallet/topup")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          )}
          {(status === "success" ) && (
            <Button onClick={() => router.push("/merchant")} className="w-full bg-blue-600 hover:bg-blue-700">
              Go to Dashboard
            </Button>
          )}
          {status === "pending" && (
            <Button onClick={verifyPayment} className="w-full bg-blue-600 hover:bg-blue-700">
              Re-verify Payment
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
