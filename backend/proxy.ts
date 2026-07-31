import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { buildCorsHeaders } from "@/lib/cors";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

// NOTE: As of Next.js 16, the `middleware.ts` file convention has been renamed to
// `proxy.ts` (functionality is identical — see Next's own migration guide). This file
// is the direct equivalent of what would historically have been `middleware.ts`.
// It still avoids importing mongoose/bcryptjs (kept lightweight / no DB access here),
// and uses `jose` for JWT verification since that was originally required for Edge
// runtime compatibility. Proxy now always runs on the Node.js runtime in Next 16, but
// jose works fine there too, so no change was needed on that front.

function isAdminAuthExempt(pathname: string): boolean {
  return pathname === "/api/admin/login" || pathname === "/api/admin/logout";
}

async function verifySessionCookie(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  if (pathname.startsWith("/api/admin") && !isAdminAuthExempt(pathname)) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = await verifySessionCookie(token);

    if (!valid) {
      const res = NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );
      corsHeaders.forEach((value, key) => res.headers.set(key, value));
      return res;
    }
  }

  const res = NextResponse.next();
  corsHeaders.forEach((value, key) => res.headers.set(key, value));
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
