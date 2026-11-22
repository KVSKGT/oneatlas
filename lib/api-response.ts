import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(message: string, status: number = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  console.error("API Error encountered:", error);

  if (error instanceof ZodError) {
    const issues = error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return errorResponse("Validation error", 400, issues);
  }

  if (error instanceof Error) {
    // If it's a known not-found error
    if (error.message.includes("Record to update not found") || error.message.includes("not found")) {
      return errorResponse("Resource not found", 404);
    }
  }

  return errorResponse("An unexpected internal server error occurred", 500);
}
