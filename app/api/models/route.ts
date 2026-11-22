import { NextRequest } from "next/server";
import { modelFilterSchema } from "@/lib/validators/models";
import { getModels, getFilterOptions } from "@/lib/services/models";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // If meta=filters, return distinct filter options
    if (searchParams.get("meta") === "filters") {
      const options = await getFilterOptions();
      return successResponse(options);
    }

    const queryObj = Object.fromEntries(searchParams.entries());
    const validated = modelFilterSchema.parse(queryObj);

    const result = await getModels(validated);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
