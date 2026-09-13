import { qwenClient } from "@/lib/qwen/client";
import { recommendRequestSchema } from "@/lib/qwen/schemas";
import {
  enforceRateLimit,
  jsonResponse,
  parseJson,
  routeError,
} from "@/lib/qwen/route";

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "recommend", 12);
    const body = await parseJson(request, recommendRequestSchema);
    return jsonResponse(await qwenClient.recommend(body));
  } catch (error) {
    return routeError(error);
  }
}
