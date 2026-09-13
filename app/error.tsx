"use client";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ErrorState } from "@/components/shared/empty-state";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell-tight">
      <ErrorState
        title="We couldn’t load this page"
        description="Try the request again. Public research navigation remains available."
      />
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className="text-link inline-flex min-h-11 items-center">
          Return home
        </Link>
      </div>
    </div>
  );
}
