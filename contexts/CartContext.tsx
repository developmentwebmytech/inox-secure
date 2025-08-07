"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react"

interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
  initialized: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INITIALIZED"; payload: boolean }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncWithDatabase: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_INITIALIZED":
      return { ...state, initialized: action.payload }

    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId && item.variantId === action.payload.variantId,
      )
      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        return { ...state, items: updatedItems, total, itemCount }
      } else {
        const newItems = [...state.items, action.payload]
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        return { ...state, items: newItems, total, itemCount }
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      return { ...state, items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      return { ...state, items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0, itemCount: 0 }

    case "LOAD_CART": {
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      return { ...state, items: action.payload, total, itemCount, loading: false }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    initialized: false,
  })

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  // Check if user is logged in
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me")
      const isAuth = response.ok
      setIsLoggedIn(isAuth)
      return isAuth
    } catch {
      setIsLoggedIn(false)
      return false
    }
  }, [])

  // Initialize cart data
  const initializeCart = useCallback(async () => {
    if (state.initialized) return

    dispatch({ type: "SET_LOADING", payload: true })

    // First check auth status
    const isAuth = await checkAuth()

    if (isAuth) {
      // User is logged in, fetch from database
      try {
        const response = await fetch("/api/cart")
        if (response.ok) {
          const data = await response.json()
          const formattedItems = data.items.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            variantId: item.variation_id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }))
          dispatch({ type: "LOAD_CART", payload: formattedItems })
        } else {
          // Fallback to localStorage if database fetch fails
          const savedCart = localStorage.getItem("cart")
          if (savedCart) {
            dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart from database:", error)
        // Fallback to localStorage
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
        }
      }
    } else {
      // User not logged in, load from localStorage
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
          localStorage.removeItem("cart")
        }
      }
    }

    dispatch({ type: "SET_LOADING", payload: false })
    dispatch({ type: "SET_INITIALIZED", payload: true })
  }, [state.initialized, checkAuth])

  // Initialize on mount
  useEffect(() => {
    initializeCart()
  }, [initializeCart])

  // Save to localStorage whenever cart changes (but only after initialization)
  useEffect(() => {
    if (state.initialized && !state.loading) {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items, state.initialized, state.loading])

  // Sync with database when user logs in
  const syncWithDatabase = async () => {
    if (isLoggedIn === null || !isLoggedIn) return

    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Get current localStorage data
      const localCartItems = JSON.parse(localStorage.getItem("cart") || "[]")
      const localWishlistItems = JSON.parse(localStorage.getItem("wishlist") || "[]")

      // Sync local data with database
      if (localCartItems.length > 0 || localWishlistItems.length > 0) {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: localCartItems,
            wishlistItems: localWishlistItems,
          }),
        })
      }

      // Fetch updated cart from database
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        const formattedItems = data.items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          variantId: item.variation_id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }))
        dispatch({ type: "LOAD_CART", payload: formattedItems })
      }
    } catch (error) {
      console.error("Failed to sync cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Auto-sync when user logs in
  useEffect(() => {
    if (isLoggedIn === true && state.initialized) {
      syncWithDatabase()
    }
  }, [isLoggedIn, state.initialized])

  const addToCart = async (item: Omit<CartItem, "id">) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.productId}-${item.variantId}-${Date.now()}`,
    }

    // Update local state immediately
    dispatch({ type: "ADD_ITEM", payload: cartItem })

    // Sync with database if logged in
    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: item.productId,
            variation_id: item.variantId,
            quantity: item.quantity,
            price: item.price,
          }),
        })
      } catch (error) {
        console.error("Failed to sync add to cart:", error)
      }
    }
  }

  const removeFromCart = async (id: string) => {
    const item = state.items.find((item) => item.id === id)

    // Update local state immediately
    dispatch({ type: "REMOVE_ITEM", payload: id })

    // Sync with database if logged in
    if (isLoggedIn && item) {
      try {
        await fetch(`/api/cart?item_id=${id}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Failed to sync remove from cart:", error)
      }
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    // Update local state immediately
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })

    // Sync with database if logged in
    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_id: id, quantity }),
        })
      } catch (error) {
        console.error("Failed to sync quantity update:", error)
      }
    }
  }

  const clearCart = async () => {
    // Update local state immediately
    dispatch({ type: "CLEAR_CART" })

    // Sync with database if logged in
    if (isLoggedIn) {
      try {
        await fetch("/api/cart/clear", {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Failed to sync clear cart:", error)
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        syncWithDatabase,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
