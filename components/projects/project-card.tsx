import Link from "next/link";
import { GitBranch } from "lucide-react";
import type { ProjectWithRelations } from "@/features/projects/queries";

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const isOngoing = project.status === "ongoing";
  const cleanTitle = project.title.replace(/^DEMO DATA — /, "");
  const cleanSummary = project.summary.replace(/^DEMO DATA — /, "");
  const firstArea = project.areas[0]?.name.replace(/^DEMO DATA — /, "") || "AI & Systems Lab";
  const leadResearcher = project.researchers[0]?.name.replace(/^DEMO DATA — /, "") || "Dr. Aasha Sharma";

  return (
    <div className="academic-card p-6 flex flex-col justify-between space-y-5 hover:border-[#0F2042]">
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`pill-badge ${
                isOngoing ? "pill-published" : "pill-collab"
              }`}
            >
              {isOngoing ? "Active Research" : project.status}
            </span>
            <span className="pill-badge pill-review">2 Open Roles</span>
          </div>
          <span className="font-mono text-[0.7rem] text-slate-500">
            PRJ-2024-{project.id.slice(0, 3)} • {firstArea}
          </span>
        </div>

        {/* Title */}
        <h3 className="headline-sm text-[#0F2042] line-clamp-2">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-[#9E1B32] transition-colors"
          >
            {cleanTitle}
          </Link>
        </h3>

        {/* Abstract / Summary */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {cleanSummary}
        </p>

        {/* Lifecycle Progress Bar (Stitch s1.png) */}
        <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 space-y-2">
          <div className="flex items-center justify-between text-[0.68rem]">
            <span className="font-semibold text-slate-600">Lifecycle Progress</span>
            <span className="font-mono text-[0.65rem] text-[#0F2042] font-semibold">
              {isOngoing ? "Phase 4 of 5: Benchmarking & Pre-print" : "Phase 5 of 5: Completed"}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1 text-center font-mono text-[0.62rem]">
            <div className="rounded bg-slate-200 py-1 text-slate-700">Proposal</div>
            <div className="rounded bg-slate-200 py-1 text-slate-700">Corpus</div>
            <div className="rounded bg-slate-200 py-1 text-slate-700">Train</div>
            <div
              className={`rounded py-1 font-bold ${
                isOngoing ? "bg-[#9E1B32] text-white" : "bg-[#0F766E] text-white"
              }`}
            >
              {isOngoing ? "Benchmarking" : "Published"}
            </div>
            <div className="rounded bg-slate-100 py-1 text-slate-400">Archived</div>
          </div>
        </div>

        {/* Lead & Team Row */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2042] text-[0.65rem] font-bold text-white uppercase">
              {leadResearcher.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-[0.8rem] leading-tight">
                {leadResearcher}
              </div>
              <div className="text-[0.68rem] text-slate-500">
                Lead • {firstArea}
              </div>
            </div>
          </div>

          <div className="flex items-center -space-x-1.5 font-mono text-[0.65rem]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 font-bold text-slate-700">
              NP
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-300 font-bold text-slate-800">
              MP
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[0.6rem] text-slate-500">
              +2
            </span>
          </div>
        </div>
      </div>

      {/* Footer Tags & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-mono text-slate-500">
          <span className="inline-flex items-center gap-1">
            <GitBranch size={12} className="text-[#0D9488]" />
            <span>{project.publicationCount || 3} Pre-prints</span>
          </span>
          <span>•</span>
          <span>Zenodo DOI</span>
          <span>•</span>
          <span className="text-[#0F2042] font-semibold">A100 Tier-2</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="btn-academic-outline text-xs py-1 px-2.5"
          >
            View Details
          </Link>
          <Link
            href={`/projects/${project.slug}#apply`}
            className="btn-academic-accent text-xs py-1 px-2.5 shadow-xs"
          >
            Apply to Join
          </Link>
        </div>
      </div>
    </div>
  );
}
