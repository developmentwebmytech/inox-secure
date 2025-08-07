"use client"

import { useEffect } from "react"
import { CheckCircle, X, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastProps {
  message: string
  type: "success" | "error" | "cart" | "wishlist"
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cart":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />
      case "wishlist":
        return <Heart className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px]">
        {getIcon()}
        <span className="flex-1 text-sm font-medium text-gray-900">{message}</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
