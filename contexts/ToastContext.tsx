"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { Toast } from "@/components/Toast"

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "cart" | "wishlist") => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "cart" | "wishlist"
    isVisible: boolean
  }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const showToast = (message: string, type: "success" | "error" | "cart" | "wishlist" = "success") => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
