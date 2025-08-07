"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { CartSidebar } from "./CartSidebar";
import { AuthModal } from "./AuthModal";
import { useSession } from "next-auth/react";
import Logo from "@/public/logo-white.png";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const ignoreClickRef = useRef(false); // new ref for ignoring click

  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { data: session } = useSession();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ignoreClickRef.current) {
        ignoreClickRef.current = false;
        return;
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("#menu-toggle-btn")
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    ignoreClickRef.current = true;
    setIsMenuOpen((prev) => !prev);
  };

  const handleCartClick = () => {
    if (!isCartOpen) {
      setIsCartAnimating(true);
      setIsCartOpen(true);
    }
  };

  const handleCartClose = () => {
    setIsCartAnimating(false);
    setTimeout(() => setIsCartOpen(false), 300);
  };

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <>
      <header className="bg-[#0042ad] text-white sticky top-0 z-40">
        <div className="bg-white w-full py-3 px-10 hidden md:block">
          <div className="container mx-auto px-6 hidden md:block">
            <div className="flex items-center justify-between text-sm text-black">
              <div className="">
                <span className="font-medium">
                  Get products delivered in minutes!
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                id="menu-toggle-btn"
                className="md:hidden text-white hover:bg-blue-600"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-20 w-32">
                  <Image src={Logo} alt="Variety Logo" fill className="object-contain" />
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-blue-200">Home</Link>
              <Link href="/electronics" className="hover:text-blue-200">Electronics</Link>
              <Link href="/appliances" className="hover:text-blue-200">Appliances</Link>
              <Link href="/it-products" className="hover:text-blue-200">IT Products</Link>
              <Link href="/products" className="hover:text-blue-200">All Products</Link>
              <Link href="/service" className="hover:text-blue-200">Services</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCartClick}
                className="relative text-white hover:bg-blue-600 hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-white hover:bg-blue-600"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistState.itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                      {wishlistState.itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>



              {session ? (
                <Link href="/account">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-600"
                  onClick={() => setIsAuthOpen(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
              
            </div>
          </div>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="md:hidden py-4 border-t border-blue-600 animate-in slide-in-from-top-2"
            >
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 bg-white text-black border-0"
                  />
                </div>

                <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link href="/electronics" onClick={() => setIsMenuOpen(false)}>Electronics</Link>
                <Link href="/appliances" onClick={() => setIsMenuOpen(false)}>Appliances</Link>
                <Link href="/it-products" onClick={() => setIsMenuOpen(false)}>IT Products</Link>
                <Link href="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link>
                <Link href="/service" onClick={() => setIsMenuOpen(false)}>Services</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {isCartOpen && (
        <>
          <div
            className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isCartAnimating ? "opacity-50" : "opacity-0"}`}
            onClick={handleCartClose}
          />
          <CartSidebar isOpen={isCartAnimating} onClose={handleCartClose} />
        </>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}