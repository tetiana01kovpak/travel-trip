import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "admin_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_JWT_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

export function getSessionTtlSeconds(): number {
  const hours = Number(process.env.ADMIN_SESSION_TTL_HOURS ?? 12);
  return hours * 60 * 60;
}

export interface AdminSessionPayload {
  username: string;
  [key: string]: unknown;
}

export async function signAdminSession(username: string): Promise<string> {
  const ttlSeconds = getSessionTtlSeconds();
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttlSeconds)
    .sign(getSecretKey());
}

export async function verifyAdminSession(
  token: string
): Promise<AdminSessionPayload> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload as AdminSessionPayload;
}

/**
 * Browsers require `Secure` on any cookie with `SameSite=None` — without it the
 * Set-Cookie header is silently dropped, regardless of transport. `localhost` is
 * treated as a secure context by modern browsers, so `Secure` still works over
 * plain http://localhost in dev; it must never be conditional on NODE_ENV.
 */
export function buildSessionCookie(token: string): string {
  const maxAge = getSessionTtlSeconds();
  return [
    `${ADMIN_SESSION_COOKIE}=${token}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=None",
    "Secure",
  ].join("; ");
}

export function buildClearSessionCookie(): string {
  return [
    `${ADMIN_SESSION_COOKIE}=`,
    "HttpOnly",
    "Path=/",
    "Max-Age=0",
    "SameSite=None",
    "Secure",
  ].join("; ");
}
