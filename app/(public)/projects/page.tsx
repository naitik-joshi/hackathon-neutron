import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listProjects } from "@/features/projects/queries";
import { projectSearchSchema } from "@/features/research/filters";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { Input, Select, Button } from "@/components/ui";
export const metadata = {
  title: "Projects",
  description:
    "Explore research projects and their connected people and published outputs.",
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
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Understand / Projects"
        title="Explore research projects"
        description="Follow the connections between research areas, people and published outputs. Project status reflects the recorded lifecycle."
      />
      <form
        action="/projects"
        role="search"
        aria-label="Find projects"
        className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1 min-w-0">
          <label htmlFor="project-query">Search project titles</label>
          <Input
            id="project-query"
            name="q"
            type="search"
            maxLength={100}
            defaultValue={q}
          />
        </div>
        <div>
          <label htmlFor="project-status">Status</label>
          <Select id="project-status" name="status" defaultValue={status}>
            {["all", "proposed", "ongoing", "completed", "archived"].map(
              (s) => (
                <option key={s} value={s}>
                  {s === "all"
                    ? "All statuses"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ),
            )}
          </Select>
        </div>
        <Button type="submit">Search</Button>
        <Link href="/projects" className="py-3 underline">
          Reset
        </Link>
      </form>
      {projects === null ? (
        <SetupState />
      ) : projects.length ? (
        <>
          <p className="mb-4 text-sm text-slate-600">
            Showing {projects.length} results (up to 50).
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No matching projects"
          description="Try another title or status, or explore research areas."
        />
      )}
    </div>
  );
}
