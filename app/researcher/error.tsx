"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui";

export default function ResearcherError({ reset }: { reset: () => void }) {
  return (
    <div className="workspace-page">
      <div
        role="alert"
        className="workspace-panel border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] p-6"
      >
        <p className="workspace-overline">Researcher workspace</p>
        <h1 className="workspace-page-title text-2xl">
          Your submission data could not be loaded
        </h1>
        <p className="workspace-page-description">
          No submission has been changed. Retry the request or open your
          publication list.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="danger" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/researcher/publications"
            className={buttonVariants({ variant: "secondary" })}
          >
            My publications
          </Link>
        </div>
      </div>
    </div>
  );
}
