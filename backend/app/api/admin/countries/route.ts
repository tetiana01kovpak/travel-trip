import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Country from "@/models/Country";
import { wrapHandler } from "@/lib/apiError";
import { createCountrySchema } from "@/lib/validation/country";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async () => {
  await connectDB();
  const items = await Country.find().sort({ name: 1 }).lean();
  return NextResponse.json({ items });
});

export const POST = wrapHandler(async (req: Request) => {
  const body = await req.json();
  const input = createCountrySchema.parse(body);
  await connectDB();

  const slug = await ensureUniqueSlug(Country, slugify(input.name));
  const country = await Country.create({ ...input, slug });

  return NextResponse.json(country, { status: 201 });
});
