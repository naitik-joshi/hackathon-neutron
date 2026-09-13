import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { Button, Input, buttonVariants } from "@/components/ui";
import { getAdminSubmissions } from "@/features/submissions/admin-queries";
import { requireRole } from "@/lib/auth/guards";

export const metadata = {
  title: "Publication review queue | Islington R&D Digital Hub",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const currentStatus = params.status || "active";
  const query = params.q || "";
  const { items, counts } = await getAdminSubmissions({
    status: currentStatus,
    query,
  });
  const filters = [
    ["active", "Active", counts.active],
    ["submitted", "Submitted", counts.submitted],
    ["under_review", "Under review", counts.underReview],
    ["changes_requested", "Changes requested", counts.changesRequested],
    ["published", "Published", counts.published],
    ["all", "All", counts.all],
  ] as const;

  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div>
          <p className="workspace-overline">Admin / Publications</p>
          <h1 className="workspace-page-title">Review queue</h1>
          <p className="workspace-page-description">
            Search submissions, filter by workflow status, and open a record to
            make an available decision.
          </p>
        </div>
        <Link
          href="/admin"
          className={buttonVariants({ variant: "secondary" })}
        >
          Admin overview
        </Link>
      </header>

      <section
        className="workspace-section"
        aria-labelledby="queue-controls-title"
      >
        <h2 id="queue-controls-title" className="sr-only">
          Queue controls
        </h2>
        <form
          method="GET"
          action="/admin/submissions"
          className="workspace-panel grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div className="relative">
            <label htmlFor="submission-search" className="sr-only">
              Search submissions
            </label>
            <Search
              aria-hidden="true"
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
            />
            <Input
              id="submission-search"
              name="q"
              defaultValue={query}
              placeholder="Search title, abstract, or DOI"
              className="pl-10"
            />
            {currentStatus !== "active" && (
              <input type="hidden" name="status" value={currentStatus} />
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>
        <nav
          aria-label="Submission status filters"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {filters.map(([id, label, count]) => {
            const active = currentStatus === id;
            const href = `/admin/submissions?status=${id}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
            return (
              <Link
                key={id}
                href={href}
                aria-current={active ? "page" : undefined}
                className={buttonVariants({
                  variant: active ? "primary" : "secondary",
                  className: "shrink-0",
                })}
              >
                {label} <span aria-label={`${count} records`}>{count}</span>
              </Link>
            );
          })}
        </nav>
        {(query || currentStatus !== "active") && (
          <Link href="/admin/submissions" className="text-link w-fit text-sm">
            Clear search and filters
          </Link>
        )}
      </section>

      <section
        className="workspace-section"
        aria-labelledby="queue-records-title"
      >
        <div className="workspace-section-heading">
          <h2 id="queue-records-title" className="workspace-section-title">
            Submission records
          </h2>
          <span className="text-sm font-semibold text-[var(--color-text-muted)]">
            {items.length} shown
          </span>
        </div>
        {items.length === 0 ? (
          <div className="workspace-panel p-7 text-center">
            <h3 className="font-sans text-base font-bold">
              No submissions match this view
            </h3>
            <p className="mx-auto mt-1 max-w-lg text-sm text-[var(--color-text-muted)]">
              Adjust the search or status filter to continue.
            </p>
            <Link
              href="/admin/submissions"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-5",
              })}
            >
              View active queue
            </Link>
          </div>
        ) : (
          <ol className="workspace-panel">
            {items.map((item) => (
              <li
                key={item.id}
                className="workspace-record lg:grid-cols-[minmax(0,1fr)_12rem_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />
                    <DemoBadge demo={item.is_demo} />
                    <span className="text-xs text-[var(--color-text-subtle)]">
                      Record {item.id.slice(0, 8)}
                    </span>
                  </div>
                  <h3 className="mt-2 break-words font-sans text-base font-bold text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
                    {item.abstract}
                  </p>
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  <p className="font-semibold text-[var(--color-ink)]">
                    {item.submitterName || "Researcher submission"}
                  </p>
                  <p className="mt-1 text-xs">
                    Received {formatDate(item.created_at)}
                  </p>
                </div>
                <Link
                  href={`/admin/submissions/${item.id}`}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Open record <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
