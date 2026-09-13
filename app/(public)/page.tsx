import Link from "next/link";
import { ArrowRight, BookOpenText, Network, Search, Users } from "lucide-react";
import { listAreas, listPublications } from "@/features/research/queries";
import { listProjects } from "@/features/projects/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { settleLoad } from "@/lib/utilities/load-result";
import { Input, buttonVariants } from "@/components/ui";
import {
  EmptyState,
  ErrorState,
  SetupState,
} from "@/components/shared/empty-state";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

export default async function Home() {
  const configured = isSupabaseConfigured();
  const [areasResult, projectsResult, publicationsResult] = configured
    ? await Promise.all([
        settleLoad(
          listAreas(),
          "Research areas could not be loaded right now.",
        ),
        settleLoad(
          listProjects({ limit: 4 }),
          "Projects could not be loaded right now.",
        ),
        settleLoad(
          listPublications("", 4),
          "Published research could not be loaded right now.",
        ),
      ])
    : [null, null, null];

  const areas = areasResult?.ok ? areasResult.data : [];
  const projects = projectsResult?.ok ? projectsResult.data : [];
  const publications = publicationsResult?.ok ? publicationsResult.data : [];
  const featuredArea = areas[0];

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--color-navy)] text-[var(--color-text-on-dark)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--brand-spectrum-red),var(--brand-spectrum-yellow),var(--brand-spectrum-green),var(--brand-spectrum-teal),var(--brand-spectrum-blue))]" />
        <div className="section-shell grid items-end gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
          <div>
            <p className="text-sm font-semibold text-teal-200">
              Islington College · R&amp;D Digital Hub
            </p>
            <h1 className="type-display mt-5 max-w-4xl">
              See how Islington research connects.
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-slate-200 sm:text-xl">
              Discover areas of inquiry, understand the work, meet the people
              behind it and find a credible next step into participation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/research" className={buttonVariants()}>
                Explore research <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/projects"
                className={buttonVariants({
                  variant: "secondary",
                  className:
                    "border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10",
                })}
              >
                Find a project
              </Link>
            </div>
          </div>

          <form
            action="/search"
            method="GET"
            role="search"
            aria-label="Search public research"
            className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5 text-[var(--color-text)] shadow-[var(--shadow-raised)] sm:p-6"
          >
            <p className="section-kicker">Connected search</p>
            <h2 className="type-h3 mt-2">Search public research</h2>
            <p className="mt-2 text-sm text-muted">
              Find topics, people, projects and published work through one
              public search.
            </p>
            <label htmlFor="home-publication-search" className="mt-5">
              Topic, person, project or publication
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="home-publication-search"
                name="q"
                type="search"
                maxLength={100}
                placeholder="Search connected research"
              />
              <button className={buttonVariants()} type="submit">
                <Search size={17} aria-hidden="true" /> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid w-[calc(100%-2rem)] max-w-7xl gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Discover", "Choose a research area", "/research", Search],
            [
              "Understand",
              "Read published work",
              "/publications",
              BookOpenText,
            ],
            ["Connect", "Meet researchers", "/researchers", Users],
            ["Participate", "Explore active projects", "/projects", Network],
          ].map(([title, copy, href, Icon]) => (
            <Link
              key={title as string}
              href={href as string}
              className="group flex min-h-28 items-start gap-3 bg-[var(--color-surface)] px-4 py-6 transition-colors duration-[var(--motion-fast)] hover:bg-[var(--color-surface-muted)] sm:px-6"
            >
              <Icon
                className="mt-0.5 shrink-0 text-[var(--color-action)]"
                size={20}
                aria-hidden="true"
              />
              <span>
                <strong className="block font-serif text-lg">
                  {title as string}
                </strong>
                <span className="mt-1 block text-sm text-muted">
                  {copy as string}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {!configured ? (
        <div className="section-shell">
          <SetupState />
        </div>
      ) : (
        <>
          <section className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
              <div>
                <p className="section-kicker">A connected starting point</p>
                <h2 className="type-h2 mt-2">Begin with a research area</h2>
                <p className="mt-3 max-w-2xl text-muted">
                  Research areas organize the people, projects and published
                  work that make each topic meaningful.
                </p>
              </div>
              <Link
                href="/research"
                className="text-link self-end lg:justify-self-end"
              >
                Browse every research area →
              </Link>
            </div>

            <div className="mt-8">
              {!areasResult?.ok ? (
                <ErrorState
                  compact
                  title="Research areas are unavailable"
                  description={areasResult?.message ?? "Try again shortly."}
                />
              ) : featuredArea ? (
                <div className="grid overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
                  <div className="p-6 sm:p-9">
                    <DemoBadge demo={featuredArea.is_demo} />
                    <h3 className="type-h2 mt-4">{featuredArea.name}</h3>
                    <p className="mt-4 max-w-2xl text-muted">
                      {featuredArea.description}
                    </p>
                    <Link
                      href={`/research/${featuredArea.slug}`}
                      className={buttonVariants({ className: "mt-6" })}
                    >
                      Enter this research area{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                  <aside className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 lg:border-l lg:border-t-0 sm:p-8">
                    <p className="section-kicker">Follow the connections</p>
                    <ol className="mt-5 grid gap-4 text-sm">
                      <li>
                        <strong>01 · People</strong>
                        <span className="block text-muted">
                          Meet researchers connected to this area.
                        </span>
                      </li>
                      <li>
                        <strong>02 · Projects</strong>
                        <span className="block text-muted">
                          See how the topic becomes active work.
                        </span>
                      </li>
                      <li>
                        <strong>03 · Publications</strong>
                        <span className="block text-muted">
                          Read public outputs linked to the area.
                        </span>
                      </li>
                    </ol>
                  </aside>
                </div>
              ) : (
                <EmptyState
                  title="Research areas are being prepared"
                  description="Browse published work while the connected directory grows."
                  href="/publications"
                  action="Browse publications"
                />
              )}
            </div>
          </section>

          <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="section-shell">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="section-kicker">Research in progress</p>
                  <h2 className="type-h2 mt-2">Explore projects</h2>
                </div>
                <Link href="/projects" className="text-link">
                  All projects →
                </Link>
              </div>
              <div className="mt-7 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                {!projectsResult?.ok ? (
                  <div className="py-6">
                    <ErrorState
                      compact
                      title="Projects are unavailable"
                      description={
                        projectsResult?.message ?? "Try again shortly."
                      }
                    />
                  </div>
                ) : projects.length ? (
                  projects.slice(0, 3).map((project) => (
                    <article
                      key={project.id}
                      className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <DemoBadge demo={project.is_demo} />
                          <ProjectStatusBadge status={project.status} />
                        </div>
                        <h3 className="type-h3 mt-3 break-words">
                          {project.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted">
                          {project.summary}
                        </p>
                      </div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className={buttonVariants({ variant: "secondary" })}
                      >
                        View project
                      </Link>
                    </article>
                  ))
                ) : (
                  <div className="py-6">
                    <EmptyState
                      title="No projects to show yet"
                      description="Start with a research area while the project directory grows."
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="section-kicker">From the public collection</p>
                <h2 className="type-h2 mt-2">Recently published</h2>
                <p className="mt-3 text-muted">
                  Read public research, then follow its authors and connected
                  projects.
                </p>
                <Link
                  href="/publications"
                  className={buttonVariants({
                    variant: "secondary",
                    className: "mt-6",
                  })}
                >
                  Browse publications
                </Link>
              </div>
              <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                {!publicationsResult?.ok ? (
                  <div className="py-6">
                    <ErrorState
                      compact
                      title="Published research is unavailable"
                      description={
                        publicationsResult?.message ?? "Try again shortly."
                      }
                    />
                  </div>
                ) : publications.length ? (
                  publications.map((publication) => (
                    <article key={publication.id} className="py-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <DemoBadge demo={publication.is_demo} />
                        <StatusBadge status={publication.status} />
                        {publication.year && (
                          <span className="text-sm text-muted">
                            {publication.year}
                          </span>
                        )}
                      </div>
                      <h3 className="type-h3 mt-3">
                        <Link
                          href={`/publications/${publication.slug}`}
                          className="hover:text-[var(--color-action)]"
                        >
                          {publication.title}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">
                        {publication.abstract}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="py-6">
                    <EmptyState
                      title="No publications to show"
                      description="Explore research areas while the public collection grows."
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="bg-[var(--color-ruby)] text-white">
        <div className="section-shell grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold text-rose-100">Participation</p>
            <h2 className="type-h2 mt-2">
              Find a project where your interest can become action.
            </h2>
            <p className="mt-3 max-w-2xl text-rose-50">
              Browse current projects publicly. Sign in with a student account
              to record an expression of interest.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className={buttonVariants({
                className: "bg-white text-[var(--color-ruby)] hover:bg-rose-50",
              })}
            >
              Explore projects
            </Link>
            <Link
              href="/auth/sign-up"
              className={buttonVariants({
                variant: "secondary",
                className:
                  "border-white/50 bg-transparent text-white hover:border-white hover:bg-white/10",
              })}
            >
              Create student account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
