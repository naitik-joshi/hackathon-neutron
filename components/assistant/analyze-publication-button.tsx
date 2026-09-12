"use client";

import { BookOpenText } from "lucide-react";
import { Button } from "@/components/ui";

export const OPEN_RESEARCH_ASSISTANT_EVENT = "research-assistant:open";

export function AnalyzePublicationButton({ title }: { title: string }) {
  return (
    <Button
      type="button"
      variant="primary"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent(OPEN_RESEARCH_ASSISTANT_EVENT, {
            detail: { publicationTitle: title },
          }),
        )
      }
      aria-label={`Analyze ${title} with the Research Paper Assistant`}
    >
      <BookOpenText size={17} aria-hidden="true" />
      Analyze this paper
    </Button>
  );
}
