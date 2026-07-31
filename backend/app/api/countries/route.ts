import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Country from "@/models/Country";
import { wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async () => {
  await connectDB();
  const items = await Country.find().sort({ name: 1 }).lean();
  return NextResponse.json({ items });
});
