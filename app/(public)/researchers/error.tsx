"use client";

import { PublicRouteError } from "@/components/shared/public-route-state";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PublicRouteError
      title="Researcher profiles could not be loaded"
      description="The public people directory is temporarily unavailable. Try again or continue through research themes."
      href="/research"
      action="Explore research"
      reset={reset}
    />
  );
}
