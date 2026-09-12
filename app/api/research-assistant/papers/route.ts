import { qwenClient } from "@/lib/qwen/client";
import { enforceRateLimit, jsonResponse, routeError } from "@/lib/qwen/route";

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "papers", 60);
    return jsonResponse(await qwenClient.papers());
  } catch (error) {
    return routeError(error);
  }
}
