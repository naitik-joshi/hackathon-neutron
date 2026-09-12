import Link from "next/link";
import { Sparkles, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui";
import type { Project } from "@/lib/supabase/database.types";

export function ProjectParticipationCallout({ project }: { project: Project }) {
  const isOpen = project.status === "ongoing" || project.status === "proposed";

  return (
    <Card className="border-slate-200 bg-[#FAFBFD] space-y-3">
      <div className="flex items-center gap-2 text-[#0f2042]">
        <Sparkles className="h-4 w-4 text-[#0d9488]" />
        <span className="eyebrow">Student Participation</span>
      </div>
      <h3 className="font-serif font-semibold text-slate-900 text-sm">
        {isOpen ? "Join this research project" : "Project status & archives"}
      </h3>
      <p className="text-xs text-slate-600 leading-relaxed">
        {isOpen
          ? "Islington students can collaborate directly with faculty PIs, assist with data collection and experiments, and earn co-authorship."
          : "This project is completed or archived. You can view its published outputs below or explore other ongoing research."}
      </p>
      {isOpen ? (
        <a
          href="#get-involved"
          className="btn-academic-primary text-xs w-full text-center inline-flex items-center justify-center gap-1.5"
        >
          <span>Express Interest</span>
          <ArrowDown className="h-3.5 w-3.5" />
        </a>
      ) : (
        <Link
          href="/projects"
          className="btn-academic-outline text-xs w-full text-center block"
        >
          Browse active projects
        </Link>
      )}
    </Card>
  );
}
