"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/contexts/CartContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { ProductActionProvider } from "@/contexts/ProductActionContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <ProductActionProvider>{children}</ProductActionProvider>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  )
}
