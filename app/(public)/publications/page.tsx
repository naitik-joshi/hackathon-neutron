import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listPublications } from "@/features/research/queries";
import { directorySearchSchema } from "@/features/research/filters";
import { PageIntro } from "@/components/shared/page-intro";
import { SetupState, EmptyState } from "@/components/shared/empty-state";
import { SearchForm } from "@/components/research/search-form";
import { PublicationList } from "@/components/research/publication-list";

export const metadata = {
  title: "Publications",
  description: "Read published research and follow its connected context.",
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
      <PageIntro
        eyebrow="Discover · Publications"
        title="Read the public research record"
        description="This index contains published records only. Search currently matches publication titles, then follow each output to its authors and connected project context."
        actions={
          <a
            href="https://ijmr.islingtoncollege.edu.np/index.php/IJMR"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Visit the official IJMR journal ↗
          </a>
        }
      />
      <div className="mt-10">
        <SearchForm
          query={q}
          label="Search published publication titles"
          placeholder="Search publication titles"
          id="publication-query"
        />
      </div>
      {items === null ? (
        <SetupState />
      ) : items.length ? (
        <section className="mt-10" aria-labelledby="publication-results-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-kicker">Published collection</p>
              <h2 id="publication-results-title" className="type-h3 mt-1">
                {q ? `Titles matching “${q}”` : "Recently published"}
              </h2>
            </div>
            <p className="text-sm text-muted">
              {items.length} {items.length === 1 ? "record" : "records"}
            </p>
          </div>
          <PublicationList items={items} />
        </section>
      ) : (
        <div className="mt-10">
          <EmptyState
            title={
              q
                ? `No published titles match “${q}”`
                : "No publications have been published yet"
            }
            description="Try a broader title search or explore the research themes."
            href={q ? "/publications" : "/research"}
            action={q ? "Clear search" : "Explore research areas"}
          />
        </div>
      )}
      <div className="mt-12 border-t border-[var(--color-border)] pt-8">
        <Link href="/projects" className="text-link">
          Continue to active research projects →
        </Link>
      </div>
    </div>
  );
}
