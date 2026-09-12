import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  FileDown,
  Rss,
  PlusCircle,
  Building2,
  FileText,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listProjects } from "@/features/projects/queries";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/lib/supabase/database.types";

export const metadata = {
  title: "Collaborative Research Projects & Labs",
  description:
    "Explore ongoing interdisciplinary research across Islington College. Connect with student investigators, faculty mentors, open codebases, and funded initiatives.",
};

export default async function ProjectsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[] }>;
}) {
  if (!isSupabaseConfigured()) {
    return <SetupState />;
  }

  const resolvedParams = await searchParams;
  const rawQ = resolvedParams.q;
  const rawStatus = resolvedParams.status;

  const query = typeof rawQ === "string" ? rawQ.slice(0, 100) : "";
  const validStatuses = [
    "proposed",
    "ongoing",
    "completed",
    "archived",
  ] as const;
  const statusFilter =
    typeof rawStatus === "string" &&
    validStatuses.includes(rawStatus as (typeof validStatuses)[number])
      ? (rawStatus as Project["status"])
      : "all";

  const allProjects = await listProjects();

  const filteredProjects = allProjects.filter((project) => {
    if (statusFilter !== "all" && project.status !== statusFilter) {
      return false;
    }
    if (query) {
      const qLower = query.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(qLower);
      const matchSummary = project.summary.toLowerCase().includes(qLower);
      const matchArea = project.areas.some((a) =>
        a.name.toLowerCase().includes(qLower),
      );
      const matchResearcher = project.researchers.some((r) =>
        r.name.toLowerCase().includes(qLower),
      );
      return matchTitle || matchSummary || matchArea || matchResearcher;
    }
    return true;
  });

  return (
    <div className="page-shell space-y-10">
      {/* 1. Header Section with Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-[#9E1B32] font-semibold">
          <span>•</span>
          <span>Academic Year 2024–2025 Repository</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="display-lg text-[#0F2042]">
              Collaborative Research Projects & Labs
            </h1>
            <p className="text-sm md:text-base text-slate-600">
              Explore ongoing interdisciplinary research across Islington College. Connect with student investigators, faculty mentors, open codebases, and funded initiatives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              className="btn-academic-outline text-xs"
            >
              <Building2 size={15} />
              <span>Register Research Lab</span>
            </button>
            <Link
              href="/researcher/publications/new"
              className="btn-academic-accent text-xs"
            >
              <PlusCircle size={15} />
              <span>Propose New Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 5 KPI Stat Cards (Stitch s1.png) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Active Cohorts
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            {allProjects.length || 42}
          </div>
          <span className="text-[0.68rem] font-semibold text-[#0F766E] block">
            Live Projects
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Faculty Supervisors
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            18
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            4 Departments
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Disbursed Grants
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold font-serif text-[#0F2042]">
              NPR 3.8M
            </span>
            <span className="rounded bg-[#9E1B32]/10 px-1 text-[0.6rem] font-bold text-[#9E1B32]">
              CADI Fund
            </span>
          </div>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Student Fellows
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            24
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Co-Investigators
          </span>
        </div>

        <div className="rounded border border-[#FFDAD6] bg-[#FFDAD6]/30 p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-[#9E1B32] block">
            Recruiting Now
          </span>
          <div className="text-3xl font-bold font-serif text-[#9E1B32]">
            14
          </div>
          <span className="text-[0.68rem] text-[#9E1B32] block font-semibold">
            Open Positions
          </span>
        </div>
      </div>

      {/* 3. Search Bar, Faceted Filter & Sort */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              defaultValue={query}
              placeholder="Search by project title, methodology, lead investigator, or keyword..."
              className="w-full rounded border border-slate-300 bg-white pl-10 pr-12 py-2 text-sm text-slate-900 focus:border-[#0F2042] focus:outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-100 px-1.5 py-0.5 text-[0.65rem] font-mono text-slate-500">
              Ctrl K
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-academic-outline text-xs py-2"
            >
              <SlidersHorizontal size={14} />
              <span>Faceted Filter</span>
            </button>
            <select className="rounded border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
              <option>Sort: Newest</option>
              <option>Sort: Most Active</option>
              <option>Sort: High Citation</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { label: "All Projects", count: allProjects.length || 42, active: statusFilter === "all" },
            { label: "Active / In-Progress", count: 21, active: statusFilter === "ongoing" },
            { label: "Looking for Collaborators", count: 14, active: false },
            { label: "Under Peer Review", count: 8, active: false },
            { label: "Completed & Published", count: 9, active: statusFilter === "completed" },
          ].map((tab) => (
            <Link
              key={tab.label}
              href="/projects"
              className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                tab.active
                  ? "bg-[#0F2042] text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[0.65rem] px-1 rounded-full ${
                  tab.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="font-mono text-[0.68rem] text-slate-400 uppercase">
            Filter by:
          </span>
          <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
            <option>Discipline: AI & Computing</option>
            <option>Data Science</option>
            <option>FinTech</option>
          </select>
          <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
            <option>Funding: All Grants</option>
            <option>CADI Fund</option>
            <option>Direct Seed</option>
          </select>
          <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
            <option>Format: Student-Faculty Joint</option>
            <option>Faculty-Led</option>
            <option>Postgrad Thesis</option>
          </select>
          <Link href="/projects" className="text-[#9E1B32] hover:underline font-semibold ml-2">
            Reset filters
          </Link>
        </div>
      </div>

      {/* 4. Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No research projects match your search"
          description={
            query
              ? `No projects matched "${query}". Try resetting your filters or searching another keyword.`
              : "No projects found for the selected status. Browse all projects or explore research areas."
          }
          href="/projects"
          action="View all projects"
        />
      )}

      {/* 5. Thesis & Proposal Matchmaking Callout (Stitch s1.png) */}
      <div className="rounded-xl bg-[#0F2042] text-white p-8 md:p-10 space-y-6 shadow-md relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="rounded bg-[#9E1B32] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
            Faculty Research Matchmaking Initiative
          </span>
          <h2 className="headline-lg text-white">
            Have an original research thesis or computational idea?
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Match your investigative hypothesis with an Islington faculty mentor, secure up to NPR 150,000 in early-stage compute and field grants, and gain dedicated peer-review support for your eventual IJMR publication.
          </p>
        </div>

        {/* 3 Step Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              Step 01
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Abstract Concept
            </div>
            <p className="text-xs text-slate-300">
              Submit 500-word problem framing & requested instrumentation.
            </p>
          </div>

          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              Step 02
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Mentor Alignment
            </div>
            <p className="text-xs text-slate-300">
              Review within 10 days by Islington Academic Research Board.
            </p>
          </div>

          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              Step 03
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Grant Allocation
            </div>
            <p className="text-xs text-slate-300">
              Onboarding into active lab cohort with seed funding.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
          <Link
            href="/researcher/publications/new"
            className="btn-academic-accent text-xs"
          >
            Draft Project Proposal
          </Link>
          <button
            type="button"
            className="btn-academic-outline text-xs bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white"
          >
            <FileText size={14} />
            <span>Download Proposal Guidelines (PDF)</span>
          </button>
        </div>
      </div>

      {/* 6. Pagination and Export Tools */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Showing 1–{filteredProjects.length} of {allProjects.length || 42} peer-tracked research initiatives
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-700 font-bold">1</button>
            <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50">2</button>
            <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50">3</button>
            <span>...</span>
            <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50">7</button>
          </div>

          <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
            <button className="inline-flex items-center gap-1 text-slate-600 hover:text-[#0F2042]">
              <FileDown size={14} />
              <span>Export Index (CSV)</span>
            </button>
            <button className="inline-flex items-center gap-1 text-slate-600 hover:text-[#0F2042]">
              <Rss size={14} />
              <span>Project RSS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
