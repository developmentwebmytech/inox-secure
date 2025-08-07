"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { ProductActionToast } from "@/components/ProductActionToast"

interface ProductActionContextType {
  showProductAction: (
    product: {
      _id: string
      title: string
      slug: string
      price: number
      compareAtPrice?: number
      image: string
      quantity?: number
    },
    action: "cart" | "wishlist",
  ) => void
}

const ProductActionContext = createContext<ProductActionContextType | null>(null)

export function ProductActionProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    product: {
      _id: string
      title: string
      slug: string
      price: number
      compareAtPrice?: number
      image: string
      quantity?: number
    } | null
    action: "cart" | "wishlist" | null
    isVisible: boolean
  }>({
    product: null,
    action: null,
    isVisible: false,
  })

  const showProductAction = (
    product: {
      _id: string
      title: string
      slug: string
      price: number
      compareAtPrice?: number
      image: string
      quantity?: number
    },
    action: "cart" | "wishlist",
  ) => {
    setToast({ product, action, isVisible: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  return (
    <ProductActionContext.Provider value={{ showProductAction }}>
      {children}
      <ProductActionToast
        product={toast.product}
        action={toast.action}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </ProductActionContext.Provider>
  )
}

export function useProductAction() {
  const context = useContext(ProductActionContext)
  if (!context) {
    throw new Error("useProductAction must be used within a ProductActionProvider")
  }
  return context
}
