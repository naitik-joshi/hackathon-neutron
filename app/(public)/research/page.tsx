import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listAreas } from "@/features/research/queries";
import { PageHeader } from "@/components/shared/page-header";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { AreaList } from "@/components/research/area-list";
import { SearchForm } from "@/components/research/search-form";
import { directorySearchSchema } from "@/features/research/filters";
export default async function Research({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = directorySearchSchema.parse(await searchParams);
  const areas = isSupabaseConfigured() ? await listAreas(q) : null;
  return (
    <div className="page-shell py-10">
      <PageHeader
        eyebrow="Discover / Research"
        title="Follow your curiosity"
        description="Research areas connect people, projects and publications. Start with an idea, then explore the work around it."
      />
      <SearchForm
        action="/research"
        label="Search research area names"
        query={q}
      />
      {areas === null ? (
        <SetupState />
      ) : areas.length ? (
        <AreaList areas={areas} />
      ) : (
        <EmptyState
          title="Research areas are being prepared"
          description="Browse published work while the directory grows."
          href="/publications"
          action="Browse publications"
        />
      )}
    </div>
  );
}
