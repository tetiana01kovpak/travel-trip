import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Town from "@/models/Town";
import Country from "@/models/Country";
import { wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async (req: Request) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const countrySlug = searchParams.get("country");

  const filter: Record<string, unknown> = {};
  if (countrySlug) {
    const country = await Country.findOne({ slug: countrySlug }).select("_id").lean();
    if (!country) {
      return NextResponse.json({ items: [] });
    }
    filter.country = country._id;
  }

  const items = await Town.find(filter).sort({ name: 1 }).lean();
  return NextResponse.json({ items });
});
