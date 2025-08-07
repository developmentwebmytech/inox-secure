import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Merchant } from "@/lib/models/Merchant"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const query: any = {}
    if (status) {
      query.status = status
    }

    const merchants = await Merchant.find(query)
      .populate("userId", "name email phone")
      .populate("agentId", "name email")
      .sort({ createdAt: -1 })

    return NextResponse.json({ merchants })
  } catch (error) {
    console.error("Fetch merchants error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
