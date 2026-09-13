export type AssistantAvailability =
  "checking" | "ready" | "paper-index-unavailable" | "unavailable";

export function getAssistantAvailability(input: {
  health: "checking" | "healthy" | "degraded";
  loadingPapers: boolean;
  paperCount: number;
  paperIndexFailed: boolean;
}): AssistantAvailability {
  if (input.health === "checking" || input.loadingPapers) return "checking";
  if (input.health === "degraded") return "unavailable";
  if (input.paperIndexFailed || input.paperCount === 0) {
    return "paper-index-unavailable";
  }
  return "ready";
}

export const assistantAvailabilityLabel: Record<AssistantAvailability, string> =
  {
    checking: "Checking assistant",
    ready: "Assistant ready",
    "paper-index-unavailable": "Paper index unavailable",
    unavailable: "Assistant unavailable",
  };
