"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, MoreHorizontal, Eye } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Agent {
  _id: string
  name: string
  email: string
  phone: string
  isActive: boolean
  createdAt: string
  merchantCount: number
  totalCollections: number
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/admin/agents")
      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error("Failed to fetch agents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchAgents()
        toast({
          title: "Success",
          description: `Agent ${!currentStatus ? "activated" : "deactivated"} successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update agent status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update agent status:", error)
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (agentId: string) => {
    try {
      const response = await fetch(`/api/admin/agents/${agentId}/reset-password`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password reset successfully. New credentials sent to agent's email.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to reset password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to reset password:", error)
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      })
    }
  }

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="p-6">Loading agents...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agents Management</h1>
        <Link href="/dashboard/agents/create">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Create Agent
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Agents</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgents.map((agent) => (
              <div key={agent._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <Badge variant={agent.isActive ? "default" : "secondary"}>
                      {agent.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{agent.email}</p>
                  <p className="text-sm text-gray-600">{agent.phone}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Merchants: {agent.merchantCount}</span>
                    <span>Collections: ₹{agent.totalCollections?.toLocaleString() || 0}</span>
                    <span>Joined: {new Date(agent.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/agents/${agent._id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => toggleAgentStatus(agent._id, agent.isActive)}>
                        {agent.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => resetPassword(agent._id)}>Reset Password</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
