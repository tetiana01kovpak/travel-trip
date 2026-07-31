import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Town from "@/models/Town";
import Activity from "@/models/Activity";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { updateTownSchema } from "@/lib/validation/town";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/towns/[id]">) => {
    const { id } = await context.params;
    await connectDB();
    const town = await Town.findById(id).lean();
    if (!town) throw new ApiError(404, "Town not found");
    return NextResponse.json(town);
  }
);

export const PATCH = wrapHandler(
  async (req: Request, context: RouteContext<"/api/admin/towns/[id]">) => {
    const { id } = await context.params;
    const body = await req.json();
    const input = updateTownSchema.parse(body);
    await connectDB();

    const town = await Town.findById(id);
    if (!town) throw new ApiError(404, "Town not found");

    if (input.name && input.name !== town.name) {
      town.slug = await ensureUniqueSlug(Town, slugify(input.name), id);
    }

    Object.assign(town, input);
    await town.save();

    return NextResponse.json(town);
  }
);

export const DELETE = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/towns/[id]">) => {
    const { id } = await context.params;
    await connectDB();

    const town = await Town.findById(id);
    if (!town) throw new ApiError(404, "Town not found");

    const activityCount = await Activity.countDocuments({ town: id });
    if (activityCount > 0) {
      throw new ApiError(409, "Cannot delete a town that has activities referencing it");
    }

    await town.deleteOne();
    return NextResponse.json({ ok: true });
  }
);
