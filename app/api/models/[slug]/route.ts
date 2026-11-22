import { NextRequest } from "next/server";
import { getModelDetail } from "@/lib/services/model-detail";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return errorResponse("Model slug is required", 400);
    }

    const model = await getModelDetail(slug);
    if (!model) {
      return errorResponse(`Model with slug '${slug}' was not found`, 404);
    }

    return successResponse(model);
  } catch (error) {
    return handleApiError(error);
  }
}
