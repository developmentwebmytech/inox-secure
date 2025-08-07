"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Calendar, Users, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Agent {
  _id: string
  name: string
  email: string
  phone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  merchantCount: number
  totalCollections: number
}

export default function AgentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgentDetails()
  }, [params.id])

  const fetchAgentDetails = async () => {
    try {
      const response = await fetch(`/api/admin/agents/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAgent(data.agent)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch agent details",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch agent details:", error)
      toast({
        title: "Error",
        description: "Failed to fetch agent details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleAgentStatus = async () => {
    if (!agent) return

    try {
      const response = await fetch(`/api/admin/agents/${agent._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !agent.isActive }),
      })

      if (response.ok) {
        setAgent({ ...agent, isActive: !agent.isActive })
        toast({
          title: "Success",
          description: `Agent ${!agent.isActive ? "activated" : "deactivated"} successfully`,
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

  const resetPassword = async () => {
    if (!agent) return

    try {
      const response = await fetch(`/api/admin/agents/${agent._id}/reset-password`, {
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

  if (loading) {
    return <div className="p-6">Loading agent details...</div>
  }

  if (!agent) {
    return <div className="p-6">Agent not found</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Agent Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Agent Information
              <Badge variant={agent.isActive ? "default" : "secondary"}>{agent.isActive ? "Active" : "Inactive"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">{agent.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <p className="text-sm text-gray-500">Agent</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{agent.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{agent.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Joined: {new Date(agent.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Last Updated: {new Date(agent.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Total Merchants</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{agent.merchantCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium">Total Collections</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ₹{agent.totalCollections?.toLocaleString() || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={toggleAgentStatus} variant={agent.isActive ? "destructive" : "default"}>
              {agent.isActive ? "Deactivate Agent" : "Activate Agent"}
            </Button>
            <Button onClick={resetPassword} variant="outline">
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
