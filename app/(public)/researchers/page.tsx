import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listResearchers } from "@/features/research/queries";
import { directorySearchSchema } from "@/features/research/filters";
import { PageHeader } from "@/components/shared/page-header";
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
      <PageHeader
        eyebrow="Connect / Researchers"
        title="People behind the research"
        description="Explore public researcher profiles, research areas, projects and published outputs. Search by researcher name."
      />
      <SearchForm
        query={q}
        action="/researchers"
        label="Find researchers by name"
      />
      {items === null ? (
        <SetupState />
      ) : items.length ? (
        <>
          <p className="mb-4 text-sm text-slate-600">
            Showing {items.length} profiles (up to 100).
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <ResearcherCard key={r.id} researcher={r} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No matching researchers"
          description="Try another name or explore the research areas."
        />
      )}
    </div>
  );
}
