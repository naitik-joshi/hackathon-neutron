import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listProjects } from "@/features/projects/queries";
import { PageHeader } from "@/components/shared/page-header";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import type { Project } from "@/lib/supabase/database.types";

export const metadata = {
  title: "Research Projects & Labs",
  description:
    "Explore collaborative research initiatives, active labs, and student-faculty projects across Islington College.",
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
  const validStatuses = ["proposed", "ongoing", "completed", "archived"] as const;
  const statusFilter =
    typeof rawStatus === "string" &&
    validStatuses.includes(rawStatus as (typeof validStatuses)[number])
      ? (rawStatus as Project["status"])
      : "all";

  // Fetch all projects for accurate metrics and filtering
  const allProjects = await listProjects();

  const counts = {
    all: allProjects.length,
    ongoing: allProjects.filter((p) => p.status === "ongoing").length,
    proposed: allProjects.filter((p) => p.status === "proposed").length,
    completed: allProjects.filter((p) => p.status === "completed").length,
  };

  // Filter projects based on status and search query
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

  const totalPublications = allProjects.reduce(
    (sum, p) => sum + p.publicationCount,
    0,
  );

  return (
    <>
      <PageHeader
        eyebrow="Discover / Projects & Labs"
        title="Collaborative Research Projects & Labs"
        description="Explore ongoing interdisciplinary research across Islington College. Connect with student investigators, faculty mentors, open codebases, and funded initiatives."
      />

      {/* Structured Academic Ledger / Quick Metric Bar */}
      <section aria-label="Project Statistics" className="my-8 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <div className="border-r border-slate-100 p-2 sm:p-3 last:border-r-0">
          <span className="eyebrow block">Total Cohorts</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#142c43]">
              {counts.all}
            </span>
            <span className="text-xs text-slate-500">Initiatives</span>
          </div>
        </div>

        <div className="border-r border-slate-100 p-2 sm:p-3 sm:border-r last:border-r-0">
          <span className="eyebrow block">Active Labs</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700">
              {counts.ongoing}
            </span>
            <span className="text-xs text-slate-500">In-Progress</span>
          </div>
        </div>

        <div className="border-r border-slate-100 p-2 sm:p-3 last:border-r-0">
          <span className="eyebrow block">New Proposals</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-700">
              {counts.proposed}
            </span>
            <span className="text-xs text-slate-500">Forming</span>
          </div>
        </div>

        <div className="p-2 sm:p-3">
          <span className="eyebrow block">Linked Papers</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">
              {totalPublications}
            </span>
            <span className="text-xs text-slate-500">Peer-Reviewed</span>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <ProjectFilterBar
        currentStatus={statusFilter}
        query={query}
        counts={counts}
      />

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
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

      {/* Bottom CTA to Connect or Submit */}
      <section className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Have an idea for an interdisciplinary lab?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Faculty members and student researchers can submit manuscripts and proposed projects for review.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/research"
            className="text-link text-sm font-semibold"
          >
            Browse research areas →
          </Link>
          <Link
            href="/researcher/publications/new"
            className="text-link text-sm font-semibold"
          >
            Contribute research →
          </Link>
        </div>
      </section>
    </>
  );
}
