import { NextRequest } from "next/server";
import { getProvidersList } from "@/lib/services/providers";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(_request: NextRequest) {
  try {
    const providers = await getProvidersList();
    return successResponse(providers);
  } catch (error) {
    return handleApiError(error);
  }
}
