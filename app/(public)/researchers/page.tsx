import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listResearchers } from "@/features/research/queries";
import { directorySearchSchema } from "@/features/research/filters";
import { PageIntro } from "@/components/shared/page-intro";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { SearchForm } from "@/components/research/search-form";
import { ResearcherCard } from "@/components/research/researcher-card";

export const metadata = {
  title: "Researchers",
  description: "Explore public researcher profiles and connected work.",
};

export default async function Researchers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = directorySearchSchema.parse(await searchParams);
  const items = isSupabaseConfigured() ? await listResearchers(q) : null;

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Connect · Researchers"
        title="Meet the people behind the work"
        description="Public profiles connect stored researcher identities to their themes, projects and published outputs. Search currently matches researcher names."
        actions={
          <Link href="/research" className="text-link">
            Start with a research area →
          </Link>
        }
      />
      <div className="mt-10">
        <SearchForm
          query={q}
          action="/researchers"
          label="Find researchers by name"
          id="researcher-query"
          placeholder="Search researcher names"
        />
      </div>
      {items === null ? (
        <SetupState />
      ) : items.length ? (
        <section className="mt-10" aria-labelledby="researcher-results-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h2 id="researcher-results-title" className="type-h3">
              {q ? `People matching “${q}”` : "Researcher directory"}
            </h2>
            <p className="text-sm text-muted">
              {items.length} {items.length === 1 ? "profile" : "profiles"}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((researcher) => (
              <ResearcherCard key={researcher.id} researcher={researcher} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10">
          <EmptyState
            title={
              q
                ? `No researchers match “${q}”`
                : "No researcher profiles are available yet"
            }
            description="Try another name or begin with the research-area directory."
            href="/research"
            action="Explore research areas"
          />
        </div>
      )}
    </div>
  );
}
