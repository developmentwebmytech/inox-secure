import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Merchant } from "@/lib/models/Merchant"
import { sendEmail } from "@/lib/utils/email"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // const token = request.cookies.get("token")?.value
    // if (!token) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    // }

    // const { payload } = await jwtVerify(token, secret)
    // if (payload.role !== "admin") {
    //   return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    // }

    const { action } = await request.json()
    const merchantId = params.id

    const merchant = await Merchant.findById(merchantId).populate("userId")
    if (!merchant) {
      return NextResponse.json({ message: "Merchant not found" }, { status: 404 })
    }

    if (action === "approve") {
      merchant.status = "approved"
      merchant.userId.isApproved = true
      await merchant.save()
      await merchant.userId.save()

      // Send approval email
      const emailHtml = `
        <h2>Account Approved!</h2>
        <p>Dear ${merchant.userId.name},</p>
        <p>Congratulations! Your merchant account has been approved by our admin team.</p>
        <p>You can now access all platform features including:</p>
        <ul>
          <li>Wallet management</li>
          <li>Custom coupon codes</li>
          <li>Transaction history</li>
          <li>Deposit tracking</li>
        </ul>
        <p>Login to your dashboard to get started.</p>
        <p>Best regards,<br>Platform Team</p>
      `

      await sendEmail(merchant.userId.email, "Merchant Account Approved", emailHtml)
    } else if (action === "reject") {
      merchant.status = "rejected"
      await merchant.save()

      // Send rejection email
      const emailHtml = `
        <h2>Account Application Update</h2>
        <p>Dear ${merchant.userId.name},</p>
        <p>Thank you for your interest in joining our platform.</p>
        <p>After careful review, we are unable to approve your merchant account at this time.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>Platform Team</p>
      `

      await sendEmail(merchant.userId.email, "Merchant Account Application Update", emailHtml)
    }

    return NextResponse.json({ message: `Merchant ${action}d successfully` })
  } catch (error) {
    console.error("Merchant approval error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
