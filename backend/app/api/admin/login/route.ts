import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { adminLoginSchema } from "@/lib/validation/adminAuth";
import { signAdminSession, buildSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = wrapHandler(async (req: Request) => {
  const body = await req.json();
  const { username, password } = adminLoginSchema.parse(body);

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    throw new ApiError(500, "Admin credentials are not configured");
  }

  if (username !== adminUsername) {
    throw new ApiError(401, "Invalid credentials");
  }

  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = await signAdminSession(username);

  const res = NextResponse.json({ username });
  res.headers.set("Set-Cookie", buildSessionCookie(token));
  return res;
});
