import Link from "next/link";
import { ArrowRight, Waypoints } from "lucide-react";
import { PageIntro } from "@/components/shared/page-intro";
import { buttonVariants } from "@/components/ui";

export const metadata = {
  title: "Opportunities",
  description: "Find the current public route into research participation.",
};

export default function Opportunities() {
  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Participate · Opportunities"
        title="Start with active research"
        description="The hub does not yet maintain a separate opportunities database. The current credible participation path begins with a recorded project."
      />
      <section className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-navy)] text-[var(--color-text-on-dark)]">
        <div className="grid lg:grid-cols-[0.7fr_1.3fr]">
          <div className="border-b border-white/15 p-7 lg:border-b-0 lg:border-r">
            <Waypoints
              size={28}
              className="text-[var(--brand-spectrum-teal)]"
              aria-hidden="true"
            />
            <p className="section-kicker mt-5 text-[var(--brand-spectrum-yellow)]">
              Current pathway
            </p>
            <h2 className="type-h2 mt-2">Projects → Get involved</h2>
          </div>
          <div className="p-7 sm:p-10">
            <ol className="grid gap-6 sm:grid-cols-3">
              {[
                ["01", "Discover", "Browse recorded research projects."],
                [
                  "02",
                  "Understand",
                  "Read the summary, team and published outputs.",
                ],
                [
                  "03",
                  "Participate",
                  "Use a student account to express interest where open.",
                ],
              ].map(([number, title, description]) => (
                <li key={number}>
                  <span className="text-sm font-semibold text-[var(--brand-spectrum-teal)]">
                    {number}
                  </span>
                  <h3 className="type-h3 mt-2">{title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-on-dark-muted)]">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/projects?status=ongoing"
                className={buttonVariants()}
              >
                Browse active projects{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/research"
                className={buttonVariants({ variant: "secondary" })}
              >
                Explore research areas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
