import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { ApiError, wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/tickets/[code]">) => {
    const { code } = await context.params;
    await connectDB();

    const booking = await Booking.findOne({ ticketCode: code }).lean();
    if (!booking) {
      throw new ApiError(404, "Ticket not found");
    }

    const { snapshot } = booking;
    if (!snapshot) {
      throw new ApiError(500, "Ticket snapshot is missing");
    }

    return NextResponse.json({
      ticketCode: booking.ticketCode,
      status: booking.status,
      traveler: booking.traveler,
      travelDate: booking.travelDate,
      numberOfTravelers: booking.numberOfTravelers,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      activity: {
        name: snapshot.activityName,
        slug: snapshot.activitySlug,
        description: snapshot.activityDescription,
        images: snapshot.images,
      },
      town: {
        name: snapshot.townName,
        slug: snapshot.townSlug,
      },
      country: {
        name: snapshot.countryName,
        slug: snapshot.countrySlug,
      },
      location: snapshot.location,
      createdAt: (booking as { createdAt?: Date }).createdAt,
    });
  }
);
