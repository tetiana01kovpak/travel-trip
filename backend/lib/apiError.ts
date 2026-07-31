import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function errorResponse(status: number, message: string, details?: unknown) {
  return NextResponse.json(
    { error: details !== undefined ? { message, details } : { message } },
    { status }
  );
}

/**
 * Normalizes any thrown error into a consistent { error: { message, details? } } JSON response.
 */
export function handleError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return errorResponse(err.status, err.message, err.details);
  }

  if (err instanceof ZodError) {
    return errorResponse(400, "Validation failed", err.flatten());
  }

  // Mongoose duplicate-key error
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    return errorResponse(409, "Duplicate value", keyValue);
  }

  // Mongoose validation error
  if (err && typeof err === "object" && (err as { name?: string }).name === "ValidationError") {
    return errorResponse(400, "Validation failed", (err as Error).message);
  }

  // Mongoose CastError (e.g. malformed ObjectId)
  if (err && typeof err === "object" && (err as { name?: string }).name === "CastError") {
    return errorResponse(400, "Invalid identifier");
  }

  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  return errorResponse(500, process.env.NODE_ENV === "production" ? "Internal server error" : message);
}

/**
 * Wraps a route handler so any thrown error (ApiError, ZodError, Mongoose error, etc.)
 * is funneled through handleError for a consistent response shape.
 */
export function wrapHandler<Args extends unknown[]>(
  fn: (...args: Args) => Promise<NextResponse>
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (err) {
      return handleError(err);
    }
  };
}

export default ApiError;
