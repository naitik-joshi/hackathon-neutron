import Link from "next/link";
import { listAreas, listPublications } from "@/features/research/queries";
import { listProjects } from "@/features/projects/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SearchForm } from "@/components/research/search-form";
import { AreaList } from "@/components/research/area-list";
import { PublicationList } from "@/components/research/publication-list";
import { ProjectCard } from "@/components/projects/project-card";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
export default async function Home() {
  const configured = isSupabaseConfigured();
  const [areas, projects, publications] = configured
    ? await Promise.all([
        listAreas(),
        listProjects({ limit: 4 }),
        listPublications("", 4),
      ])
    : [[], [], []];
  return (
    <div className="space-y-8 pb-12">
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#9e1b32]">
              Islington College / R&D Digital Hub
            </p>
            <h1 className="display-lg">
              From curiosity to connected research.
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Explore research areas, meet the people behind the work, and
              follow projects through their published outputs.
            </p>
            <SearchForm />
          </div>
          <aside className="rounded-lg bg-[#eff4ff] p-6 space-y-4 self-start">
            <h2 className="headline-sm">Choose your starting point</h2>
            <Link href="/research" className="btn-academic-primary w-full">
              Explore research areas
            </Link>
            <Link href="/researchers" className="btn-academic-outline w-full">
              Meet researchers
            </Link>
            <Link href="/projects" className="btn-academic-outline w-full">
              Discover projects
            </Link>
            <p className="text-sm text-slate-600">
              Public research is open to everyone. Fictional records are marked
              DEMO DATA.
            </p>
          </aside>
        </div>
      </section>
      <section className="bg-[#0f2042] text-white">
        <div className="page-shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Discover", "Start with a topic.", "/research"],
            ["Understand", "Read the connected work.", "/publications"],
            ["Connect", "Explore public researcher profiles.", "/researchers"],
            ["Participate", "Check a project's next steps.", "/projects"],
          ].map(([title, copy, href], i) => (
            <div key={title}>
              <p className="text-sm text-teal-200">0{i + 1}</p>
              <h2 className="text-xl text-white mt-2">{title}</h2>
              <p className="my-3 text-sm text-slate-300">{copy}</p>
              <Link
                href={href}
                className="underline focus-visible:outline-white"
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </section>
      {!configured ? (
        <div className="page-shell">
          <SetupState />
        </div>
      ) : (
        <>
          <section className="page-shell space-y-5">
            <h2 className="headline-lg">Research areas</h2>
            {areas.length ? (
              <AreaList areas={areas.slice(0, 4)} />
            ) : (
              <EmptyState
                title="Research areas are being prepared"
                description="Explore published work while the directory grows."
                href="/publications"
                action="Browse publications"
              />
            )}
            <Link href="/research" className="inline-block underline">
              All research areas →
            </Link>
          </section>
          <section className="page-shell space-y-5">
            <h2 className="headline-lg">Explore projects</h2>
            {projects.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No projects to show yet"
                description="Start with a research area to explore the available work."
              />
            )}
          </section>
          <section className="page-shell space-y-5">
            <h2 className="headline-lg">Recent published outputs</h2>
            <PublicationList items={publications} />
            <Link href="/publications" className="inline-block underline">
              All publications →
            </Link>
          </section>
        </>
      )}
      <section className="page-shell">
        <div className="rounded-lg bg-[#eff4ff] p-6 md:p-8 space-y-4">
          <h2 className="headline-lg">Find your next research connection</h2>
          <p>
            Browse people and projects, then check the available participation
            options on each project.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/researchers" className="btn-academic-primary">
              Explore researchers
            </Link>
            <Link href="/auth/sign-up" className="btn-academic-outline">
              Create a student account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
