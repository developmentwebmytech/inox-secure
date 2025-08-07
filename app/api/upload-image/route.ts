import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.error("❌ No file provided in the request")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${uuidv4()}.${fileExtension}`

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, fileName)

    if (!existsSync(uploadDir)) {
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (error) {
        console.error("❌ Failed to create uploads directory:", error)
        return NextResponse.json(
          { error: "Server error: Failed to create uploads directory" },
          { status: 500 }
        )
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error("❌ Error in upload API:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
