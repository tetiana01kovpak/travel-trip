import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Town from "@/models/Town";
import { wrapHandler } from "@/lib/apiError";
import { createTownSchema } from "@/lib/validation/town";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async () => {
  await connectDB();
  const items = await Town.find().sort({ name: 1 }).populate("country", "name slug").lean();
  return NextResponse.json({ items });
});

export const POST = wrapHandler(async (req: Request) => {
  const body = await req.json();
  const input = createTownSchema.parse(body);
  await connectDB();

  const slug = await ensureUniqueSlug(Town, slugify(input.name));
  const town = await Town.create({ ...input, slug });

  return NextResponse.json(town, { status: 201 });
});
