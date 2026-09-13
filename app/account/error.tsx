"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui";

export default function AccountError({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell-tight">
      <div
        role="alert"
        className="workspace-panel border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] p-6"
      >
        <h1 className="workspace-page-title text-2xl">
          Your account could not be loaded
        </h1>
        <p className="workspace-page-description">
          Retry the account request or continue with public research.
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
