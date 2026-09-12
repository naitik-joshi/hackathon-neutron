import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listAreas } from "@/features/research/queries";
import { PageIntro } from "@/components/shared/page-intro";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { AreaList } from "@/components/research/area-list";
import { SearchForm } from "@/components/research/search-form";
import { directorySearchSchema } from "@/features/research/filters";

export const metadata = {
  title: "Research areas",
  description: "Begin with a research theme and follow its connected work.",
};

export default async function Research({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = directorySearchSchema.parse(await searchParams);
  const areas = isSupabaseConfigured() ? await listAreas(q) : null;

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Discover · Research areas"
        title="Begin with an idea"
        description="Research areas are thematic hubs. Each one brings together the people, projects and published work recorded around a shared question."
        actions={
          <Link href="/projects" className="text-link">
            Explore active work →
          </Link>
        }
      />
      <div className="mt-10">
        <SearchForm
          action="/research"
          label="Search research area names"
          query={q}
          id="area-query"
          placeholder="Search by research theme"
        />
      </div>
      {areas === null ? (
        <SetupState />
      ) : areas.length ? (
        <section className="mt-10" aria-labelledby="area-results-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h2 id="area-results-title" className="type-h3">
              {q ? `Results for “${q}”` : "Research themes"}
            </h2>
            <p className="text-sm text-muted">
              {areas.length} {areas.length === 1 ? "area" : "areas"}
            </p>
          </div>
          <AreaList areas={areas} />
        </section>
      ) : (
        <div className="mt-10">
          <EmptyState
            title={
              q
                ? `No research areas match “${q}”`
                : "Research areas are being prepared"
            }
            description={
              q
                ? "Try a broader theme or continue through published research."
                : "Browse published work while the thematic directory grows."
            }
            href={q ? "/research" : "/publications"}
            action={q ? "Clear search" : "Browse publications"}
          />
        </div>
      )}
    </div>
  );
}
