import type React from "react"
import DashboardLayout from "@/components/DashboardLayout"

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="merchant">{children}</DashboardLayout>
}
