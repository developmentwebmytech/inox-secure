import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import PincodeBlacklist from "@/models/PincodeBlacklist"

export async function GET() { 
  try {
    await connectDB()
    const pincodes = await PincodeBlacklist.find().sort({ createdAt: -1 })
    return NextResponse.json(pincodes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pincodes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()

    const pincode = new PincodeBlacklist(data)
    await pincode.save()

    return NextResponse.json({ message: "Pincode added to blacklist successfully", pincode })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add pincode to blacklist" }, { status: 500 })
  }
}
