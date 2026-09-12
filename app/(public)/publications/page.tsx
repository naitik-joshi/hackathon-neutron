import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listPublications } from "@/features/research/queries";
import { PageHeader } from "@/components/shared/page-header";
import { SetupState } from "@/components/shared/empty-state";
import { PublicationList } from "@/components/research/publication-list";
import { SearchForm } from "@/components/research/search-form";
export default async function Publications({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const raw = (await searchParams).q;
  const q = typeof raw === "string" ? raw.slice(0, 100) : "";
  const data = isSupabaseConfigured() ? await listPublications(q) : null;
  return (
    <>
      <PageHeader
        eyebrow="Discover / Publications"
        title="Published research"
        description="Explore the latest 50 publications approved for the public collection. No account needed."
      />
      <SearchForm query={q} />
      {data === null ? <SetupState /> : <PublicationList items={data} />}
    </>
  );
}
