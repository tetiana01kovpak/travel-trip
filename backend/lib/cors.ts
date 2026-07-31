function getAllowedOrigins(): string[] {
  return (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

/**
 * Builds the CORS headers to attach to every /api/** response.
 * Only reflects the request's Origin header back if it's in the whitelist.
 */
export function buildCorsHeaders(requestOrigin: string | null): Headers {
  const headers = new Headers();
  const allowedOrigins = getAllowedOrigins();

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    headers.set("Access-Control-Allow-Origin", requestOrigin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return headers;
}

export function isOriginAllowed(requestOrigin: string | null): boolean {
  if (!requestOrigin) return false;
  return getAllowedOrigins().includes(requestOrigin);
}
