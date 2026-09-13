import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="page-shell-tight">
      <section className="surface-panel mx-auto max-w-3xl px-6 py-10 text-center sm:px-10">
        <span className="icon-disc mx-auto" aria-hidden="true">
          <Compass size={21} />
        </span>
        <p className="section-kicker mt-5">404 · Public research</p>
        <h1 className="type-h2 mt-2">Research not found</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          This record may not exist or may not be published. Continue through
          the public research collection.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link
            href="/research"
            className={buttonVariants({ variant: "secondary" })}
          >
            Research
          </Link>
          <Link
            href="/projects"
            className={buttonVariants({ variant: "secondary" })}
          >
            Projects
          </Link>
          <Link
            href="/publications"
            className={buttonVariants({ variant: "secondary" })}
          >
            Publications
          </Link>
        </div>
      </section>
    </div>
  );
}
