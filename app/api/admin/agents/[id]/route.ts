import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const agent = await User.findById(params.id).select("-password")
    if (!agent || agent.role !== "agent") {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 })
    }

    // Get additional stats
    const merchantCount = await User.countDocuments({
      role: "merchant",
      createdBy: agent._id,
    })

    // Get total collections (you can implement this based on your deposit/transaction model)
    const totalCollections = 0 // Placeholder

    return NextResponse.json({
      agent: {
        ...agent.toObject(),
        merchantCount,
        totalCollections,
      },
    })
  } catch (error) {
    console.error("Fetch agent error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { isActive } = await request.json()

    const agent = await User.findById(params.id)
    if (!agent || agent.role !== "agent") {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 })
    }

    agent.isActive = isActive
    agent.updatedAt = new Date()
    await agent.save()

    return NextResponse.json({
      message: `Agent ${isActive ? "activated" : "deactivated"} successfully`,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        isActive: agent.isActive,
      },
    })
  } catch (error) {
    console.error("Update agent error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
