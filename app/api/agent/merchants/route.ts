import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Merchant } from "@/lib/models/Merchant"
import { sendEmail, generatePassword } from "@/lib/utils/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Verify agent token
    const session: any = await getServerSession(authOptions)

    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    const { name, email, phone, businessName, businessType, address, gstNumber, panNumber, bankDetails } =
      await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Generate password
    const password = generatePassword()
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "merchant",
      name,
      phone,
      isActive: true,
      isApproved: false,
      createdBy: payload.id,
    })

    await newUser.save()

    // Create merchant profile
    const newMerchant = new Merchant({
      userId: newUser._id,
      businessName,
      businessType,
      address,
      gstNumber,
      panNumber,
      bankDetails,
      agentId: payload.id,
      status: "pending",
    })

    await newMerchant.save()

    // Send email with credentials
    const emailHtml = `
      <h2>Welcome to Our Platform!</h2>
      <p>Dear ${name},</p>
      <p>Your merchant account has been created and is pending admin approval.</p>
      <p><strong>Login Credentials:</strong></p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <p>You will be notified once your account is approved.</p>
      <p>Best regards,<br>Platform Team</p>
    `

    await sendEmail(email, "Merchant Account Created", emailHtml)

    return NextResponse.json({
      message: "Merchant registered successfully",
      merchant: newMerchant,
    })
  } catch (error) {
    console.error("Merchant registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session: any = await getServerSession(authOptions)
    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const payload = session.user

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const query: any = { agentId: payload.id }
    if (status) {
      query.status = status
    }

    const merchants = await Merchant.find(query).populate("userId", "name email phone").sort({ createdAt: -1 })

    return NextResponse.json({ merchants })
  } catch (error) {
    console.error("Fetch merchants error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
