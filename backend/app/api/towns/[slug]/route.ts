import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Town from "@/models/Town";
import Country from "@/models/Country";
import Activity from "@/models/Activity";
import { ApiError, wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/towns/[slug]">) => {
    const { slug } = await context.params;
    await connectDB();

    const town = await Town.findOne({ slug }).lean();
    if (!town) {
      throw new ApiError(404, "Town not found");
    }

    const country = await Country.findById(town.country)
      .select("name slug description imageUrl")
      .lean();

    const activities = await Activity.find({ town: town._id })
      .select("name slug description price currency images tags location")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ ...town, country, activities });
  }
);
