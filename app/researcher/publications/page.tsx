import Link from "next/link";
import { ArrowRight, FilePlus2 } from "lucide-react";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { FormMessage, buttonVariants } from "@/components/ui";
import { requireRole } from "@/lib/auth/guards";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function MyPublications({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; resubmitted?: string }>;
}) {
  const { client, profile } = await requireRole(["researcher"]);
  const { data, error } = await client
    .from("publications")
    .select("*")
    .eq("submitted_by", profile.id)
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Could not load submissions");
  const params = await searchParams;

  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div>
          <p className="workspace-overline">Publication workflow</p>
          <h1 className="workspace-page-title">My publications</h1>
          <p className="workspace-page-description">
            Track what you submitted, what needs action, and when each record
            last changed.
          </p>
        </div>
        <Link href="/researcher/publications/new" className={buttonVariants()}>
          <FilePlus2 aria-hidden="true" size={16} /> Submit publication
        </Link>
      </header>

      {params.submitted === "1" && (
        <FormMessage tone="success">
          Publication submitted for review.
        </FormMessage>
      )}
      {params.resubmitted === "1" && (
        <FormMessage tone="success">
          Publication updated and resubmitted for review.
        </FormMessage>
      )}

      <section
        className="workspace-section"
        aria-labelledby="publication-records-title"
      >
        <div className="workspace-section-heading">
          <h2
            id="publication-records-title"
            className="workspace-section-title"
          >
            Submission records
          </h2>
          <span className="text-sm font-semibold text-[var(--color-text-muted)]">
            {data.length} total
          </span>
        </div>
        {data.length === 0 ? (
          <div className="workspace-panel p-7 text-center">
            <h3 className="font-sans text-base font-bold">
              No publications submitted
            </h3>
            <p className="mx-auto mt-1 max-w-lg text-sm text-[var(--color-text-muted)]">
              Your private submission records will appear here after you send
              the first publication for review.
            </p>
            <Link
              href="/researcher/publications/new"
              className={buttonVariants({ className: "mt-5" })}
            >
              Submit publication
            </Link>
          </div>
        ) : (
          <ol className="workspace-panel">
            {data.map((publication) => {
              const needsAction = publication.status === "changes_requested";
              return (
                <li
                  key={publication.id}
                  className={`workspace-record sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${needsAction ? "border-l-4 border-l-amber-500 bg-[var(--color-warning-soft)]" : ""}`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={publication.status} />
                      <DemoBadge demo={publication.is_demo} />
                      {needsAction && (
                        <span className="text-xs font-bold text-[var(--color-warning)]">
                          Action required
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 break-words font-sans text-base font-bold text-[var(--color-ink)]">
                      {publication.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                      Submitted {formatDate(publication.created_at)} · Updated{" "}
                      {formatDate(publication.updated_at)}
                    </p>
                  </div>
                  <Link
                    href={`/researcher/publications/${publication.id}`}
                    className={buttonVariants({
                      variant: needsAction ? "primary" : "secondary",
                    })}
                  >
                    {needsAction ? "View feedback" : "Open record"}{" "}
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
