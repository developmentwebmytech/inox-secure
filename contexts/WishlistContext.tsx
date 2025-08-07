"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react"

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  compareAtPrice?: number
  image: string
  inStock: boolean
}

interface WishlistState {
  items: WishlistItem[]
  itemCount: number
  loading: boolean
  initialized: boolean
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "LOAD_WISHLIST"; payload: WishlistItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INITIALIZED"; payload: boolean }

const WishlistContext = createContext<{
  state: WishlistState
  dispatch: React.Dispatch<WishlistAction>
  addToWishlist: (item: WishlistItem) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (productId: string) => boolean
  syncWithDatabase: () => Promise<void>
} | null>(null)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_INITIALIZED":
      return { ...state, initialized: action.payload }

    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId)
      if (existingItem) return state
      const newItems = [...state.items, action.payload]
      return { ...state, items: newItems, itemCount: newItems.length }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.productId !== action.payload)
      return { ...state, items: newItems, itemCount: newItems.length }
    }

    case "CLEAR_WISHLIST":
      return { ...state, items: [], itemCount: 0 }

    case "LOAD_WISHLIST":
      return { ...state, items: action.payload, itemCount: action.payload.length, loading: false }

    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
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

  // Initialize wishlist data
  const initializeWishlist = useCallback(async () => {
    if (state.initialized) return

    dispatch({ type: "SET_LOADING", payload: true })

    // First check auth status
    const isAuth = await checkAuth()

    if (isAuth) {
      // User is logged in, fetch from database
      try {
        const response = await fetch("/api/wishlist")
        if (response.ok) {
          const data = await response.json()
          dispatch({ type: "LOAD_WISHLIST", payload: data.items })
        } else {
          // Fallback to localStorage if database fetch fails
          const savedWishlist = localStorage.getItem("wishlist")
          if (savedWishlist) {
            dispatch({ type: "LOAD_WISHLIST", payload: JSON.parse(savedWishlist) })
          }
        }
      } catch (error) {
        console.error("Failed to fetch wishlist from database:", error)
        // Fallback to localStorage
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
          dispatch({ type: "LOAD_WISHLIST", payload: JSON.parse(savedWishlist) })
        }
      }
    } else {
      // User not logged in, load from localStorage
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        try {
          dispatch({ type: "LOAD_WISHLIST", payload: JSON.parse(savedWishlist) })
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage:", error)
          localStorage.removeItem("wishlist")
        }
      }
    }

    dispatch({ type: "SET_LOADING", payload: false })
    dispatch({ type: "SET_INITIALIZED", payload: true })
  }, [state.initialized, checkAuth])

  // Initialize on mount
  useEffect(() => {
    initializeWishlist()
  }, [initializeWishlist])

  // Save to localStorage whenever wishlist changes (but only after initialization)
  useEffect(() => {
    if (state.initialized && !state.loading) {
      localStorage.setItem("wishlist", JSON.stringify(state.items))
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

      // Fetch updated wishlist from database
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const data = await response.json()
        dispatch({ type: "LOAD_WISHLIST", payload: data.items })
      }
    } catch (error) {
      console.error("Failed to sync wishlist:", error)
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

  const addToWishlist = async (item: WishlistItem) => {
    // Update local state immediately
    dispatch({ type: "ADD_ITEM", payload: item })

    // Sync with database if logged in
    if (isLoggedIn) {
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            name: item.name,
            price: item.price,
            compareAtPrice: item.compareAtPrice,
            image: item.image,
            inStock: item.inStock,
          }),
        })
      } catch (error) {
        console.error("Failed to sync add to wishlist:", error)
      }
    }
  }

  const removeFromWishlist = async (productId: string) => {
    // Update local state immediately
    dispatch({ type: "REMOVE_ITEM", payload: productId })

    // Sync with database if logged in
    if (isLoggedIn) {
      try {
        await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Failed to sync remove from wishlist:", error)
      }
    }
  }

  const clearWishlist = async () => {
    // Update local state immediately
    dispatch({ type: "CLEAR_WISHLIST" })

    // Clear from database if logged in
    if (isLoggedIn) {
      try {
        // Remove all items one by one (you could create a clear endpoint if needed)
        for (const item of state.items) {
          await fetch(`/api/wishlist?productId=${item.productId}`, {
            method: "DELETE",
          })
        }
      } catch (error) {
        console.error("Failed to sync clear wishlist:", error)
      }
    }
  }

  const isInWishlist = (productId: string) => {
    return state.items.some((item) => item.productId === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        state,
        dispatch,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        syncWithDatabase,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
