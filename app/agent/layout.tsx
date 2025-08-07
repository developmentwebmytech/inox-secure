import type React from "react"
import DashboardLayout from "@/components/DashboardLayout"

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="agent">{children}</DashboardLayout>
}
