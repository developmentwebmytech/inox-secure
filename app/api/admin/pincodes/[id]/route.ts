import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import PincodeBlacklist from "@/models/PincodeBlacklist"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const data = await request.json()

    const pincode = await PincodeBlacklist.findByIdAndUpdate(params.id, data, { new: true })

    if (!pincode) {
      return NextResponse.json({ error: "Pincode not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Pincode updated successfully", pincode })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pincode" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const pincode = await PincodeBlacklist.findByIdAndDelete(params.id)

    if (!pincode) {
      return NextResponse.json({ error: "Pincode not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Pincode removed from blacklist successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove pincode from blacklist" }, { status: 500 })
  }
}
