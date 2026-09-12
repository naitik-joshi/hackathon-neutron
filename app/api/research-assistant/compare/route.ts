import { qwenClient } from "@/lib/qwen/client";
import { compareRequestSchema } from "@/lib/qwen/schemas";
import {
  enforceRateLimit,
  jsonResponse,
  parseJson,
  routeError,
} from "@/lib/qwen/route";

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "compare", 4);
    const body = await parseJson(request, compareRequestSchema);
    return jsonResponse(await qwenClient.compare(body));
  } catch (error) {
    return routeError(error);
  }
}
