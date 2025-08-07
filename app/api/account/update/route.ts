// app/api/user/update/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function PATCH(req: NextRequest) {
  await connectDB()
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, email, phone } = body
  

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, email, phone },
      { new: true }
    )

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
