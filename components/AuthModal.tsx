"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import Logo from "@/public/logo-white.png";
import { useToast } from "@/hooks/use-toast"; // ✅ Corrected path

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { toast } = useToast(); // ✅ Toast setup

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        const session = await getSession();

        toast({
          title: "Success",
          description: "Login successful!",
        });

        if (session?.user?.role === "admin") {
          window.location.href = "/dashboard";
        } else if (session?.user?.role === "agent") {
          window.location.href = "/agent";
        } else if (session?.user?.role === "merchant") {
          window.location.href = "/merchant";
        } else {
          window.location.href = "/account";
        }

        onClose();
      } else {
        toast({
          title: "Error",
          description: "Login failed. Check your email or password.",
          variant: "destructive",
        });
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match!",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully. You can now sign in.",
        });
        setIsLogin(true);
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data?.message || "Registration failed.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl">
        <div className="flex h-full">
          {/* Image Side */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0042adef] to-blue-600 items-center justify-center p-8">
            <div className="text-center text-white">
              <div className="p-5 rounded-lg mb-6 inline-block">
                <Image
                  src={Logo}
                  alt="INOX Logo"
                  width={180}
                  height={100}
                  className="object-contain mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to INOX Store</h2>
              <p className="text-blue-100">
                Discover premium electronics and appliances with exclusive deals
                and fast delivery
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 mt-28 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="mt-1"
                  />
                </div>
              )}

              <div className="text-right">
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0042adef] hover:bg-[#0042ad]"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button
                  variant="link"
                  className="text-[#0042adef] p-0 ml-1"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
