import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listPublications } from "@/features/research/queries";
import { directorySearchSchema } from "@/features/research/filters";
import { PageHeader } from "@/components/shared/page-header";
import { SetupState } from "@/components/shared/empty-state";
import { SearchForm } from "@/components/research/search-form";
import { PublicationList } from "@/components/research/publication-list";
export const metadata = {
  title: "Publications",
  description:
    "Explore published research and its connected people and projects.",
};
export default async function Publications({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = directorySearchSchema.parse(await searchParams);
  const items = isSupabaseConfigured() ? await listPublications(q) : null;
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Discover / Publications"
        title="Published research"
        description="Read publication abstracts and follow their connections to researchers and projects. Search currently matches publication titles."
      />
      <SearchForm query={q} />
      {items ? (
        <>
          <p className="mb-4 text-sm text-slate-600">
            Showing {items.length} results (up to 50).
          </p>
          <PublicationList items={items} />
        </>
      ) : (
        <SetupState />
      )}
    </div>
  );
}
