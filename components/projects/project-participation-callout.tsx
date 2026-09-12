import Link from "next/link";
import { Sparkles, ArrowDown } from "lucide-react";
import { Card, buttonVariants } from "@/components/ui";
import type { Project } from "@/lib/supabase/database.types";

export function ProjectParticipationCallout({ project }: { project: Project }) {
  const isOpen = project.status === "ongoing" || project.status === "proposed";

  return (
    <Card className="space-y-3 bg-[var(--color-surface-muted)]">
      <div className="flex items-center gap-2 text-[var(--color-action)]">
        <Sparkles className="h-4 w-4" />
        <span className="section-kicker">Student participation</span>
      </div>
      <h3 className="font-serif font-semibold text-slate-900 text-sm">
        {isOpen ? "Join this research project" : "Project status & archives"}
      </h3>
      <p className="text-xs text-slate-600 leading-relaxed">
        {isOpen
          ? "Students can share their interest in participating. The research and administration team can review each submitted message."
          : "This project is completed or archived. You can view its published outputs below or explore other ongoing research."}
      </p>
      {isOpen ? (
        <a
          href="#get-involved"
          className={buttonVariants({ className: "w-full" })}
        >
          <span>Express Interest</span>
          <ArrowDown className="h-3.5 w-3.5" />
        </a>
      ) : (
        <Link
          href="/projects"
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          Browse active projects
        </Link>
      )}
    </Card>
  );
}
