import { NextRequest } from "next/server";
import { getLabsList } from "@/lib/services/labs";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(_request: NextRequest) {
  try {
    const labs = await getLabsList();
    return successResponse(labs);
  } catch (error) {
    return handleApiError(error);
  }
}
