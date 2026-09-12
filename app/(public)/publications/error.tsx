"use client";

import { PublicRouteError } from "@/components/shared/public-route-state";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PublicRouteError
      title="Publications could not be loaded"
      description="The published collection is temporarily unavailable. Try again or continue through active projects."
      href="/projects"
      action="Browse projects"
      reset={reset}
    />
  );
}
