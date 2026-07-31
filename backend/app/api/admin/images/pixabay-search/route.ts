import { NextResponse } from "next/server";
import { searchPixabay } from "@/lib/pixabay";
import { ApiError, wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    throw new ApiError(400, "Query parameter 'q' is required");
  }

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(200, Math.max(3, Number(searchParams.get("perPage")) || 20));

  const result = await searchPixabay(q, page, perPage);
  return NextResponse.json(result);
});
