import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listProjects } from "@/features/projects/queries";
import { projectSearchSchema } from "@/features/research/filters";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";

export const metadata = {
  title: "Projects",
  description: "Explore research projects, their people and published outputs.",
};

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[] }>;
}) {
  const { q, status } = projectSearchSchema.parse(await searchParams);
  const projects = isSupabaseConfigured()
    ? await listProjects({ query: q, status })
    : null;
  const filtered = Boolean(q) || status !== "all";

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Understand · Projects"
        title="See research taking shape"
        description="Projects turn themes into recorded work. Follow each project to its researchers, research areas, published outputs and participation path."
        actions={
          <Link href="/research" className="text-link">
            Browse research themes →
          </Link>
        }
      />
      <div className="mt-10">
        <ProjectFilterBar currentStatus={status} query={q} />
      </div>
      {projects === null ? (
        <SetupState />
      ) : projects.length ? (
        <section className="mt-10" aria-labelledby="project-results-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-kicker">
                {filtered ? "Filtered projects" : "Project index"}
              </p>
              <h2 id="project-results-title" className="type-h3 mt-1">
                {q
                  ? `Results for “${q}”`
                  : status === "all"
                    ? "Recorded research projects"
                    : `${status.replace("_", " ")} projects`}
              </h2>
            </div>
            <p className="text-sm text-muted">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No projects match these filters"
            description="Clear the current filters or continue through the research-area directory."
            href="/projects"
            action="Clear project filters"
          />
        </div>
      )}
    </div>
  );
}
