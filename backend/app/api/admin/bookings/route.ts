import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async (req: Request) => {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit")) || 20));

  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { ticketCode: regex },
      { "traveler.fullName": regex },
      { "traveler.email": regex },
    ];
  }

  if (from || to) {
    const travelDateFilter: Record<string, Date> = {};
    if (from) travelDateFilter.$gte = new Date(from);
    if (to) travelDateFilter.$lte = new Date(to);
    filter.travelDate = travelDateFilter;
  }

  const total = await Booking.countDocuments(filter);
  const items = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0,
  });
});
