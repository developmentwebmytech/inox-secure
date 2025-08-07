import { NextResponse, NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { HomepageSection } from "@/models/homepage-section"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");      // banner | mobile-banner | …

  // filter: always active, plus type if sent
  const filter: Record<string, any> = { isActive: true };
  if (type) filter.type = type;

  try {
    await connectDB();

    const sections = await HomepageSection
      .find(filter)
      .sort({ position: 1 })
      .lean();

    // convert _id → string
    const clean = sections.map((s) => ({ ...s, _id: s._id.toString() }));

    return NextResponse.json(clean);           // 200 OK
  } catch (err) {
    console.error("Error fetching homepage sections:", err);
    return NextResponse.json(
      { error: "Failed to fetch homepage sections" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()

    const section = new HomepageSection(data)
    await section.save()

    return NextResponse.json(
      {
        ...section.toObject(),
        _id: section._id.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating homepage section:", error)
    return NextResponse.json({ error: "Failed to create homepage section" }, { status: 500 })
  }
}
