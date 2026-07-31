import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Activity from "@/models/Activity";
import Town from "@/models/Town";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { updateActivitySchema } from "@/lib/validation/activity";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/activities/[id]">) => {
    const { id } = await context.params;
    await connectDB();
    const activity = await Activity.findById(id).lean();
    if (!activity) throw new ApiError(404, "Activity not found");
    return NextResponse.json(activity);
  }
);

export const PATCH = wrapHandler(
  async (req: Request, context: RouteContext<"/api/admin/activities/[id]">) => {
    const { id } = await context.params;
    const body = await req.json();
    const input = updateActivitySchema.parse(body);
    await connectDB();

    const activity = await Activity.findById(id);
    if (!activity) throw new ApiError(404, "Activity not found");

    if (input.name && input.name !== activity.name) {
      activity.slug = await ensureUniqueSlug(Activity, slugify(input.name), id);
    }

    if (input.town) {
      const town = await Town.findById(input.town).lean();
      if (!town) throw new ApiError(400, "Referenced town does not exist");
      activity.country = town.country;
    }

    Object.assign(activity, input);
    await activity.save();

    return NextResponse.json(activity);
  }
);

// Deleting an Activity is always allowed regardless of existing Bookings —
// their snapshot keeps the ticket valid even if the Activity is later removed.
export const DELETE = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/activities/[id]">) => {
    const { id } = await context.params;
    await connectDB();

    const activity = await Activity.findById(id);
    if (!activity) throw new ApiError(404, "Activity not found");

    await activity.deleteOne();
    return NextResponse.json({ ok: true });
  }
);
