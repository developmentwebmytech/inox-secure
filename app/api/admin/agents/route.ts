import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { sendEmail, generatePassword } from "@/lib/utils/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const session:any= await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload:any = session.user
    

    const { name, email, phone } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Generate password
    const password = generatePassword()
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create agent
    const newAgent = new User({
      email,
      password: hashedPassword,
      role: "agent",
      name,
      phone,
      isActive: true,
      isApproved: true,
      createdBy: payload.userId,
    })

    await newAgent.save()

    // Send email with credentials
    const emailHtml = `
      <h2>Welcome to Our Platform!</h2>
      <p>Dear ${name},</p>
      <p>Your agent account has been created successfully.</p>
      <p><strong>Login Credentials:</strong></p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <p>Please login and change your password after first login.</p>
      <p>Best regards,<br>Admin Team</p>
    `

    await sendEmail(email, "Agent Account Created", emailHtml)

    return NextResponse.json({
      message: "Agent created successfully",
      agent: {
        id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        phone: newAgent.phone,
      },
    })
  } catch (error) {
    console.error("Agent creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

     const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    // }
    // const payload = session.user

    const agents = await User.find({ role: "agent" }).select("-password").sort({ createdAt: -1 })

    // Get additional stats for each agent
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const merchantCount = await User.countDocuments({
          role: "merchant",
          createdBy: agent._id,
        })

        // You can add more stats here like totalCollections
        return {
          ...agent.toObject(),
          merchantCount,
          totalCollections: 0, // Placeholder - implement based on your needs
        }
      }),
    )

    return NextResponse.json({ agents: agentsWithStats })
  } catch (error) {
    console.error("Fetch agents error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
