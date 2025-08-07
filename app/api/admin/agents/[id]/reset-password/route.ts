import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { sendEmail, generatePassword } from "@/lib/utils/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Verify admin token
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const agent = await User.findById(params.id)
    if (!agent || agent.role !== "agent") {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 })
    }

    // Generate new password
    const newPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update agent password
    agent.password = hashedPassword
    agent.updatedAt = new Date()
    await agent.save()

    // Send email with new credentials
    const emailHtml = `
      <h2>Password Reset</h2>
      <p>Dear ${agent.name},</p>
      <p>Your password has been reset by the administrator.</p>
      <p><strong>New Login Credentials:</strong></p>
      <p>Email: ${agent.email}</p>
      <p>New Password: ${newPassword}</p>
      <p>Please login and change your password after first login.</p>
      <p>Best regards,<br>Admin Team</p>
    `

    await sendEmail(agent.email, "Password Reset - Agent Account", emailHtml)

    return NextResponse.json({
      message: "Password reset successfully. New credentials sent to agent's email.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
