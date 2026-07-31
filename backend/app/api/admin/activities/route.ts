import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Activity from "@/models/Activity";
import Town from "@/models/Town";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { createActivitySchema } from "@/lib/validation/activity";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async () => {
  await connectDB();
  const items = await Activity.find()
    .sort({ name: 1 })
    .populate("town", "name slug")
    .populate("country", "name slug")
    .lean();
  return NextResponse.json({ items });
});

export const POST = wrapHandler(async (req: Request) => {
  const body = await req.json();
  const input = createActivitySchema.parse(body);
  await connectDB();

  const town = await Town.findById(input.town).lean();
  if (!town) {
    throw new ApiError(400, "Referenced town does not exist");
  }

  const slug = await ensureUniqueSlug(Activity, slugify(input.name));
  const activity = await Activity.create({
    ...input,
    country: town.country,
    slug,
  });

  return NextResponse.json(activity, { status: 201 });
});
