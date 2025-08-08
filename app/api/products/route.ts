import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import "@/models/Brand";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();
    const brand = searchParams.get("brand")?.trim();
    const minPrice = searchParams.get("minPrice")?.trim();
    const maxPrice = searchParams.get("maxPrice")?.trim();
    const search = searchParams.get("search")?.trim();
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const query: any = { status: "active" };

    // Filter by category slug
    if (category) {
      const slugs = category.split(",");
      const categoryDocs = await Category.find({ slug: { $in: slugs } });
      const categoryIds = categoryDocs.map((cat) => cat._id);
      if (categoryIds.length > 0) {
        query.category = { $in: categoryIds };
      }
    }

    // Filter by brand(s)
    if (brand) {
      const brands = brand.split(",");
      query.brand = brands.length > 1 ? { $in: brands } : brands[0];
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      query["variants.price"] = priceFilter;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

     

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
