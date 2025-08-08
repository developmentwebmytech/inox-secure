import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Merchant } from "@/lib/models/Merchant"
import { sendEmail, generatePassword } from "@/lib/utils/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

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

    // Fetch merchants
    const merchants = await Merchant.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })

    // Maturity check & unlock loop
    for (const merchant of merchants) {
      if (
        merchant.wallet.lockedAmount > 0 &&
        merchant.wallet.maturityDate &&
        merchant.wallet.maturityDate <= new Date()
      ) {
        console.log(`🔓 Unlocking ₹${merchant.wallet.lockedAmount} for merchant ${merchant._id}...`)

        merchant.wallet.balance += merchant.wallet.lockedAmount
        merchant.wallet.lockedAmount = 0
        merchant.wallet.maturityDate = null

        await merchant.save()
        console.log(`✅ Merchant ${merchant._id} wallet unlocked`)
      }
    }

    return NextResponse.json({ merchants })
  } catch (error) {
    console.error("Fetch merchants error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = session.user;

    const {
      name,
      email,
      phone,
      businessName,
      businessType,
      address,
      gstNumber,
      panNumber,
      bankDetails,
      mode,
      lockedAmount, // 🆕 Take lockedAmount from request body
    } = await request.json();

    // Check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Password generation
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "merchant",
      name,
      phone,
      isActive: true,
      isApproved: false,
      createdBy: payload.id,
    });
    console.log("New User:", newUser);

    await newUser.save();

    // Calculate maturity date (3 months from now)
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + 3);

    // Create Merchant
    const newMerchant = new Merchant({
      userId: newUser._id,
      businessName,
      businessType,
      address,
      gstNumber,
      panNumber,
      bankDetails,
      mode,
      agentId: payload.id,
      status: "pending",
      wallet: {
        balance: 0,
        lockedAmount: lockedAmount || 0, // 🆕 Use dynamic value (fallback to 0)
        maturityDate,
      },
    });
    console.log("New Merchant:", newMerchant);

    await newMerchant.save();

    // Send email
    const emailHtml = `
      <h2>Welcome to Our Platform!</h2>
      <p>Dear ${name},</p>
      <p>Your merchant account has been created and is pending admin approval.</p>
      <p><strong>Login Credentials:</strong></p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <p>You will be notified once your account is approved.</p>
      <p>Best regards,<br>Platform Team</p>
    `;
    await sendEmail(email, "Merchant Account Created", emailHtml);

    // Create deposit if mode is offline
    if (mode === "offline") {
      await fetch(`${process.env.NEXTAUTH_URL}/api/agent/deposits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: newMerchant._id,
          amount: lockedAmount || 0, // 🆕 Match deposit with lockedAmount
          notes: "Initial offline registration deposit for 3 months",
        }),
      });
    }

    return NextResponse.json({
      message: "Merchant registered successfully",
      merchant: newMerchant,
    });
  } catch (error) {
    console.error("Merchant registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}



