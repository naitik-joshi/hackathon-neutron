"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui";

export function PublicRouteError({
  title,
  description,
  href,
  action,
  reset,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
  reset: () => void;
}) {
  return (
    <div className="page-shell">
      <section
        role="alert"
        className="surface-panel mx-auto max-w-3xl p-7 sm:p-10"
      >
        <span
          className="icon-disc bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
          aria-hidden="true"
        >
          <AlertTriangle size={22} />
        </span>
        <p className="section-kicker mt-5">Unable to load this public route</p>
        <h1 className="type-h2 mt-2">{title}</h1>
        <p className="mt-3 text-muted">{description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link
            href={href}
            className={buttonVariants({ variant: "secondary" })}
          >
            {action}
          </Link>
        </div>
      </section>
    </div>
  );
}
