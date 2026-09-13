"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="workspace-page">
      <div
        role="alert"
        className="workspace-panel border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] p-6"
      >
        <p className="workspace-overline">Admin workspace</p>
        <h1 className="workspace-page-title text-2xl">
          The admin data could not be loaded
        </h1>
        <p className="workspace-page-description">
          No record has been changed. Retry the request or return to public
          research.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="danger" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/research"
            className={buttonVariants({ variant: "secondary" })}
          >
            Public research
          </Link>
        </div>
      </div>
    </div>
  );
}
