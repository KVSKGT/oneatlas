import { NextRequest } from "next/server";
import { compareQuerySchema } from "@/lib/validators/compare";
import { getComparisonData } from "@/lib/services/compare";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelsParam = searchParams.get("models") ?? "";

    const validated = compareQuerySchema.parse({ models: modelsParam });
    const result = await getComparisonData(validated.models);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
