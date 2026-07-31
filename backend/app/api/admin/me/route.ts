import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const payload = await verifyAdminSession(token);
    return NextResponse.json({ username: payload.username });
  } catch {
    throw new ApiError(401, "Unauthorized");
  }
});
