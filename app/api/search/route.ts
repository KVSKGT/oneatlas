import { NextRequest } from "next/server";
import { searchQuerySchema } from "@/lib/validators/search";
import { globalSearch } from "@/lib/services/search";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryObj = Object.fromEntries(searchParams.entries());

    const validated = searchQuerySchema.parse(queryObj);
    const results = await globalSearch(validated.q, validated.limit);

    return successResponse(results);
  } catch (error) {
    return handleApiError(error);
  }
}
