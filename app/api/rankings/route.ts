import { NextRequest } from "next/server";
import { rankingsQuerySchema } from "@/lib/validators/rankings";
import { getBenchmarkRankings } from "@/lib/services/rankings";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryObj = Object.fromEntries(searchParams.entries());

    const validated = rankingsQuerySchema.parse(queryObj);
    const result = await getBenchmarkRankings(validated);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
