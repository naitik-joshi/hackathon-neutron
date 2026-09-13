import type { ReactNode } from "react";
import Link from "next/link";
import { SearchForm } from "@/components/research/search-form";
import { AreaList } from "@/components/research/area-list";
import { ResearcherCard } from "@/components/research/researcher-card";
import { ProjectCard } from "@/components/projects/project-card";
import { PublicationList } from "@/components/research/publication-list";
import {
  EmptyState,
  ErrorState,
  SetupState,
} from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { directorySearchSchema } from "@/features/research/filters";
import { searchPublicResearch } from "@/features/research/connected-search";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { settleLoad } from "@/lib/utilities/load-result";

export const metadata = {
  title: "Search",
  description:
    "Search Islington research areas, researchers, projects and published publications.",
};

function ResultGroup({
  id,
  title,
  count,
  browseHref,
  children,
}: {
  id: string;
  title: string;
  count: number;
  browseHref: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-[var(--color-border)] pt-8"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Connected results</p>
          <h2 id={id} className="type-h2 mt-1">
            {title}
          </h2>
        </div>
        <Link href={browseHref} className="text-link">
          Browse all →
        </Link>
      </div>
      {count ? (
        children
      ) : (
        <p className="text-sm text-muted">No matches in this group.</p>
      )}
    </section>
  );
}

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const { q } = directorySearchSchema.parse(await searchParams);
  const configured = isSupabaseConfigured();
  const result =
    configured && q
      ? await settleLoad(
          searchPublicResearch(q),
          "Connected search could not be loaded right now.",
        )
      : null;

  const total = result?.ok
    ? Object.values(result.data).reduce((sum, items) => sum + items.length, 0)
    : 0;

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Discover · Connected search"
        title="Search public research"
        description="One query searches research areas, people, projects and published publications—including their public connections. Private drafts and account data are never included."
      />
      <div className="mt-10">
        <SearchForm
          action="/search"
          query={q}
          label="Search all public research records"
          placeholder="Try a topic, researcher or project"
          id="connected-search-query"
        />
      </div>

      <div className="mt-10">
        {!configured ? (
          <SetupState />
        ) : !q ? (
          <EmptyState
            title="Enter a research question or topic"
            description="Results will be grouped by research area, researcher, project and published publication."
            href="/research"
            action="Browse research areas"
          />
        ) : !result?.ok ? (
          <ErrorState
            title="Search is temporarily unavailable"
            description={result?.message ?? "Try again shortly."}
          />
        ) : !total ? (
          <EmptyState
            title={`No public research matches “${q}”`}
            description="Try fewer words, a broader topic, or the name of a researcher or project."
            href="/search"
            action="Clear search"
          />
        ) : (
          <div className="grid gap-12" aria-live="polite">
            <p className="text-sm text-muted">
              {total} {total === 1 ? "result" : "results"} across the public
              research directory.
            </p>
            <ResultGroup
              id="area-search-results"
              title="Research areas"
              count={result.data.areas.length}
              browseHref="/research"
            >
              <AreaList areas={result.data.areas} />
            </ResultGroup>
            <ResultGroup
              id="researcher-search-results"
              title="Researchers"
              count={result.data.researchers.length}
              browseHref="/researchers"
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {result.data.researchers.map((researcher) => (
                  <ResearcherCard key={researcher.id} researcher={researcher} />
                ))}
              </div>
            </ResultGroup>
            <ResultGroup
              id="project-search-results"
              title="Projects"
              count={result.data.projects.length}
              browseHref="/projects"
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {result.data.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </ResultGroup>
            <ResultGroup
              id="publication-search-results"
              title="Published publications"
              count={result.data.publications.length}
              browseHref="/publications"
            >
              <PublicationList items={result.data.publications} />
            </ResultGroup>
          </div>
        )}
      </div>
    </div>
  );
}
