import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Activity from "@/models/Activity";
import Town from "@/models/Town";
import Country from "@/models/Country";
import { wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async (req: Request) => {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const townSlug = searchParams.get("town");
  const countrySlug = searchParams.get("country");
  const q = searchParams.get("q");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));

  const filter: Record<string, unknown> = {};

  if (townSlug) {
    const town = await Town.findOne({ slug: townSlug }).select("_id").lean();
    if (!town) {
      return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
    }
    filter.town = town._id;
  }

  if (countrySlug) {
    const country = await Country.findOne({ slug: countrySlug }).select("_id").lean();
    if (!country) {
      return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
    }
    filter.country = country._id;
  }

  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    filter.price = priceFilter;
  }

  if (q) {
    filter.$text = { $search: q };
  }

  const total = await Activity.countDocuments(filter);
  const items = await Activity.find(filter)
    .sort(q ? { score: { $meta: "textScore" } } : { name: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("town", "name slug")
    .populate("country", "name slug")
    .lean();

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0,
  });
});
