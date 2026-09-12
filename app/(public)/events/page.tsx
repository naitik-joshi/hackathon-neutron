import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { PageIntro } from "@/components/shared/page-intro";
import { StateFrame } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui";

export const metadata = {
  title: "Events",
  description: "Research event information in the R&D Digital Hub.",
};

export default function Events() {
  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Connect · Events"
        title="Research conversations will live here"
        description="The hub does not yet contain verified event records. Public research and active projects remain available while the event programme is prepared."
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="border-l-2 border-[var(--color-ruby)] pl-5">
          <CalendarDays
            size={24}
            className="text-[var(--color-ruby)]"
            aria-hidden="true"
          />
          <h2 className="type-h3 mt-4">Current public route</h2>
          <p className="mt-2 text-sm text-muted">
            Event listings will only appear when they are backed by verified
            records.
          </p>
        </aside>
        <StateFrame
          title="No verified events are available yet"
          description="Explore published research now, or follow an active project to understand the work behind future research conversations."
          href="/research"
          action="Explore research"
        />
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/projects"
          className={buttonVariants({ variant: "secondary" })}
        >
          Browse projects
        </Link>
        <Link href="/publications" className="text-link min-h-11 py-3">
          Read publications →
        </Link>
      </div>
    </div>
  );
}
