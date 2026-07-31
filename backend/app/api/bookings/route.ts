import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import connectDB from "@/lib/db";
import Activity from "@/models/Activity";
import Town from "@/models/Town";
import Country from "@/models/Country";
import Booking from "@/models/Booking";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { createBookingSchema } from "@/lib/validation/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = wrapHandler(async (req: Request) => {
  const body = await req.json();
  const input = createBookingSchema.parse(body);

  await connectDB();

  const activity = await Activity.findById(input.activityId).lean();
  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }

  const [town, country] = await Promise.all([
    Town.findById(activity.town).lean(),
    Country.findById(activity.country).lean(),
  ]);

  if (!town || !country) {
    throw new ApiError(404, "Town or country for this activity not found");
  }

  const totalPrice = activity.price * input.numberOfTravelers;
  const ticketCode = nanoid(10);
  const cardLast4 = input.card.cardNumber.slice(-4);

  const booking = await Booking.create({
    ticketCode,
    activity: activity._id,
    town: town._id,
    country: country._id,
    snapshot: {
      activityName: activity.name,
      activitySlug: activity.slug,
      activityDescription: activity.description,
      townName: town.name,
      townSlug: town.slug,
      countryName: country.name,
      countrySlug: country.slug,
      location: activity.location,
      images: activity.images,
    },
    traveler: input.traveler,
    travelDate: new Date(input.travelDate),
    numberOfTravelers: input.numberOfTravelers,
    pricePerPerson: activity.price,
    totalPrice,
    currency: activity.currency,
    payment: {
      cardholderName: input.card.cardholderName,
      cardLast4,
    },
    status: "confirmed",
  });

  return NextResponse.json(
    {
      bookingId: booking._id.toString(),
      ticketCode: booking.ticketCode,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      status: booking.status,
    },
    { status: 201 }
  );
});
