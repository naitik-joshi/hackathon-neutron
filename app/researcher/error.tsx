"use client";

import { Button } from "@/components/ui";

export default function ResearcherError({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell pb-16">
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-950"
      >
        <p className="eyebrow text-red-800">Researcher workspace</p>
        <h1 className="mt-2 text-2xl">We could not load your dashboard</h1>
        <p className="mt-2 max-w-xl text-sm text-red-900/80">
          Your submission data has not been changed. Try loading the workspace
          again.
        </p>
        <Button className="mt-5" variant="danger" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
