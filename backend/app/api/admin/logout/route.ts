import { NextResponse } from "next/server";
import { wrapHandler } from "@/lib/apiError";
import { buildClearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = wrapHandler(async () => {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", buildClearSessionCookie());
  return res;
});
