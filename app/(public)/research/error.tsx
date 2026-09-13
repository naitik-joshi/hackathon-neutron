"use client";

import { PublicRouteError } from "@/components/shared/public-route-state";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PublicRouteError
      title="Research areas could not be loaded"
      description="The thematic index is temporarily unavailable. Try again or continue through published research."
      href="/publications"
      action="Browse publications"
      reset={reset}
    />
  );
}
