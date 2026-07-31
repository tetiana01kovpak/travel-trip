import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Country from "@/models/Country";
import Town from "@/models/Town";
import Activity from "@/models/Activity";
import { wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PER_CATEGORY_LIMIT = 5;

export const GET = wrapHandler(async (req: Request) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ countries: [], towns: [], activities: [] });
  }

  const regex = new RegExp(q, "i");

  const [countries, towns, activities] = await Promise.all([
    Country.find({ name: regex })
      .select("name slug description imageUrl")
      .limit(PER_CATEGORY_LIMIT)
      .lean(),
    Town.find({ name: regex })
      .select("name slug description imageUrl location country")
      .limit(PER_CATEGORY_LIMIT)
      .populate("country", "name slug")
      .lean(),
    Activity.find({ name: regex })
      .select("name slug description price currency images town country")
      .limit(PER_CATEGORY_LIMIT)
      .populate("town", "name slug")
      .populate("country", "name slug")
      .lean(),
  ]);

  return NextResponse.json({ countries, towns, activities });
});
