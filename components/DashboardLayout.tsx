"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/public/logo-white.png";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "agent" | "merchant";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
          { href: "/admin/agents", label: "Agents", icon: Users },
          { href: "/admin/merchants", label: "Merchants", icon: Users },
          { href: "/admin/coupons", label: "Coupons", icon: CreditCard },
          { href: "/admin/reports", label: "Reports", icon: FileText },
        ];
      case "agent":
        return [
          { href: "/agent", label: "Dashboard", icon: LayoutDashboard },
          { href: "/agent/merchants", label: "My Merchants", icon: Users },
          { href: "/agent/deposits", label: "Deposits", icon: CreditCard },
          { href: "/agent/coupons", label: "Coupons", icon: CreditCard },
          { href: "/agent/reports/collections", label: "Reports", icon: FileText },
        ];
      case "merchant":
        return [
          { href: "/merchant", label: "Dashboard", icon: LayoutDashboard },
          { href: "/merchant/transactions", label: "Transactions", icon: FileText },
          { href: "/merchant/deposits", label: "Deposits", icon: CreditCard },
          { href: "/merchant/coupons", label: "Coupons", icon: CreditCard },
          { href: "/merchant/wallet/topup", label: "Wallet", icon: CreditCard },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 h-16 bg-blue-600 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
          <Link href="/" className="flex items-center">
            <Image src={Logo} alt="Logo" width={96} height={96} />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <h1 className="text-white text-lg font-semibold capitalize hidden lg:block">
            {role} Panel
          </h1>

          <Button
            variant="ghost"
            className="text-white hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <h2 className="text-lg font-bold capitalize">{role} Panel</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Sidebar content scrollable */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
            <nav className="mt-4">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
