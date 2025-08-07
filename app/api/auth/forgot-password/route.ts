import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/mongodb"
import {User} from "@/lib/models/User"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email })

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({ message: "If the email exists, a reset link has been sent" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpiry
    await user.save()
     console.log(email,resetToken)
    // Send email
    const emailResult = await sendPasswordResetEmail(email, resetToken)

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ message: "Password reset email sent" })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
