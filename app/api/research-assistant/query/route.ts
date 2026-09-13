import { qwenClient } from "@/lib/qwen/client";
import { queryRequestSchema } from "@/lib/qwen/schemas";
import {
  enforceRateLimit,
  jsonResponse,
  parseJson,
  routeError,
} from "@/lib/qwen/route";

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "query", 8);
    const body = await parseJson(request, queryRequestSchema);
    return jsonResponse(await qwenClient.query(body));
  } catch (error) {
    return routeError(error);
  }
}
