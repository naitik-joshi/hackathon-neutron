import Link from "next/link";
import { ArrowUpRight, BookOpen, Network } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listAreas, listPublications } from "@/features/research/queries";
import { listProjects } from "@/features/projects/queries";
import { AreaList } from "@/components/research/area-list";
import { PublicationList } from "@/components/research/publication-list";
import { ProjectCard } from "@/components/projects/project-card";
import { SearchForm } from "@/components/research/search-form";
import { SetupState } from "@/components/shared/empty-state";
export default async function Home() {
  const configured = isSupabaseConfigured();
  const [areas, publications, projects] = configured
    ? await Promise.all([
        listAreas(),
        listPublications("", 4),
        listProjects({ status: "ongoing", limit: 2 }),
      ])
    : [[], [], []];
  return (
    <>
      <section className="hero-panel mb-14 grid gap-8 lg:grid-cols-[1.45fr_.85fr]">
        <div className="hero-copy">
          <p className="eyebrow">Islington College / Research & Development</p>
          <h1 className="my-5 max-w-3xl text-5xl leading-[1.02] md:text-6xl">
            Discover research.
            <br />
            Connect with its next chapter.
          </h1>
          <p className="mb-7 max-w-2xl text-lg text-slate-600">
            Find research, understand the work behind it, and discover where you
            can contribute to the Islington R&D community.
          </p>
          <SearchForm />
          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            <Link
              href="/publications"
              className="text-link inline-flex items-center gap-2"
            >
              <BookOpen aria-hidden="true" size={16} /> Browse publications
            </Link>
            <Link
              href="/projects"
              className="text-link inline-flex items-center gap-2"
            >
              <Network aria-hidden="true" size={16} /> Explore projects
            </Link>
          </div>
        </div>
        <aside className="journey-panel self-center">
          <p className="mb-6 text-xs uppercase tracking-[0.16em] text-blue-200">
            Your path through research
          </p>
          {[
            ["Discover", "Find an area that sparks your curiosity."],
            ["Understand", "Read the research and its purpose."],
            ["Connect", "Meet the people and projects behind it."],
            ["Participate", "Share your own research for review."],
          ].map(([title, text], i) => (
            <div
              key={title}
              className="flex gap-4 border-t border-white/15 py-4"
            >
              <span className="font-mono text-sm text-blue-200">0{i + 1}</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
      {!configured && <SetupState />}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Discover / Areas</p>
            <h2 className="text-3xl">Explore by research area</h2>
          </div>
          <Link href="/research" className="text-link">
            All research areas →
          </Link>
        </div>
        <AreaList areas={areas.slice(0, 4)} />
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Understand / Publications</p>
            <h2 className="text-3xl">Recently published</h2>
          </div>
          <Link href="/publications" className="text-link">
            All publications →
          </Link>
        </div>
        {configured && <PublicationList items={publications} />}
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Connect / Projects</p>
            <h2 className="text-3xl">Active projects</h2>
          </div>
          <Link href="/projects" className="text-link">
            All research projects →
          </Link>
        </div>
        {configured && projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">
            Ongoing research projects will appear here as teams publish them.
          </p>
        )}
      </section>
      <section className="participation-callout">
        <div>
          <p className="eyebrow text-blue-200">
            Participate / Researcher workflow
          </p>
          <h2 className="text-3xl">
            Make your research part of the conversation.
          </h2>
          <p className="mt-3 text-slate-600">
            Researchers can submit publications for institutional review.
          </p>
        </div>
        <Link
          href="/researcher/publications/new"
          className="inline-flex min-h-11 items-center gap-2 rounded bg-white px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Submit research <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </>
  );
}
