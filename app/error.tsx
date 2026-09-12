"use client";
import Link from "next/link";
import { Button } from "@/components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section role="alert">
      <h1 className="text-3xl">We couldn’t load this page</h1>
      <p className="my-4">
        Try again. If the problem continues, contact the project team.
      </p>
      <Button onClick={reset}>Try again</Button>
      <Link href="/" className="text-link ml-4">
        Return home
      </Link>
    </section>
  );
}
