"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, IndianRupee } from "lucide-react"

export default function MerchantWalletTopUpPage() {
  const [amount, setAmount] = useState<number | string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleTopUp = async () => {
    const parsedAmount = Number.parseFloat(amount as string)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/merchant/wallet/topup/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsedAmount }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Payment Initiated",
          description: "Redirecting to PhonePe for payment...",
        })
        // Redirect to PhonePe payment page
        window.location.href = data.redirectUrl
      } else {
        toast({
          title: "Payment Failed",
          description: data.error || "Failed to initiate PhonePe payment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during top-up initiation:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Top Up Wallet</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add Balance to Your Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Enter the amount you wish to add to your wallet. Payments are processed securely via PhonePe.
          </p>
          <div>
            <Label htmlFor="amount">Amount (INR)</Label>
            <div className="relative mt-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="amount"
                type="text"
                placeholder="e.g., 5000"
                value={amount}
                onChange={handleAmountChange}
                className="pl-10"
                disabled={isProcessing}
              />
            </div>
          </div>
          <Button
            onClick={handleTopUp}
            disabled={isProcessing || Number.parseFloat(amount as string) <= 0 || amount === ""}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Pay with PhonePe"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
