import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Country from "@/models/Country";
import Town from "@/models/Town";
import { ApiError, wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/countries/[slug]">) => {
    const { slug } = await context.params;
    await connectDB();

    const country = await Country.findOne({ slug }).lean();
    if (!country) {
      throw new ApiError(404, "Country not found");
    }

    const towns = await Town.find({ country: country._id })
      .select("name slug description imageUrl location")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ ...country, towns });
  }
);
