import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Country from "@/models/Country";
import Town from "@/models/Town";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { updateCountrySchema } from "@/lib/validation/country";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/countries/[id]">) => {
    const { id } = await context.params;
    await connectDB();
    const country = await Country.findById(id).lean();
    if (!country) throw new ApiError(404, "Country not found");
    return NextResponse.json(country);
  }
);

export const PATCH = wrapHandler(
  async (req: Request, context: RouteContext<"/api/admin/countries/[id]">) => {
    const { id } = await context.params;
    const body = await req.json();
    const input = updateCountrySchema.parse(body);
    await connectDB();

    const country = await Country.findById(id);
    if (!country) throw new ApiError(404, "Country not found");

    if (input.name && input.name !== country.name) {
      country.slug = await ensureUniqueSlug(Country, slugify(input.name), id);
    }

    Object.assign(country, input);
    await country.save();

    return NextResponse.json(country);
  }
);

export const DELETE = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/countries/[id]">) => {
    const { id } = await context.params;
    await connectDB();

    const country = await Country.findById(id);
    if (!country) throw new ApiError(404, "Country not found");

    const townCount = await Town.countDocuments({ country: id });
    if (townCount > 0) {
      throw new ApiError(409, "Cannot delete a country that has towns referencing it");
    }

    await country.deleteOne();
    return NextResponse.json({ ok: true });
  }
);
