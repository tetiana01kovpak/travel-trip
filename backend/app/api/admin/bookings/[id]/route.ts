import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { updateBookingStatusSchema } from "@/lib/validation/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/bookings/[id]">) => {
    const { id } = await context.params;
    await connectDB();
    const booking = await Booking.findById(id).lean();
    if (!booking) throw new ApiError(404, "Booking not found");
    return NextResponse.json(booking);
  }
);

export const PATCH = wrapHandler(
  async (req: Request, context: RouteContext<"/api/admin/bookings/[id]">) => {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = updateBookingStatusSchema.parse(body);
    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) throw new ApiError(404, "Booking not found");

    booking.status = status;
    await booking.save();

    return NextResponse.json(booking);
  }
);
