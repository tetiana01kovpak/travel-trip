import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Activity from "@/models/Activity";
import Town from "@/models/Town";
import Country from "@/models/Country";
import { ApiError, wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/activities/[slug]">) => {
    const { slug } = await context.params;
    await connectDB();

    const activity = await Activity.findOne({ slug }).lean();
    if (!activity) {
      throw new ApiError(404, "Activity not found");
    }

    const [town, country] = await Promise.all([
      Town.findById(activity.town).select("name slug location").lean(),
      Country.findById(activity.country).select("name slug").lean(),
    ]);

    return NextResponse.json({ ...activity, town, country });
  }
);
