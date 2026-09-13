import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FilePlus2,
  MessageSquareText,
} from "lucide-react";
import { Badge, buttonVariants } from "@/components/ui";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import type { ResearcherDashboardData } from "@/features/researcher/queries";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const metricLabels: Array<{
  key: keyof ResearcherDashboardData["metrics"];
  label: string;
}> = [
  { key: "total", label: "Total" },
  { key: "submitted", label: "Submitted" },
  { key: "underReview", label: "Under review" },
  { key: "changesRequested", label: "Changes requested" },
  { key: "published", label: "Published" },
  { key: "rejected", label: "Rejected" },
];

export function ResearcherDashboardView({
  data,
}: {
  data: ResearcherDashboardData;
}) {
  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div>
          <p className="workspace-overline">Researcher overview</p>
          <h1 className="workspace-page-title">
            Welcome, {data.identity.displayName}
          </h1>
          <p className="workspace-page-description">
            See what needs your response, submit research, and follow each
            publication through review.
          </p>
          {data.identity.publicProfile && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <span className="font-semibold text-[var(--color-ink)]">
                {data.identity.publicProfile.name}
              </span>
              {data.identity.publicProfile.position && (
                <span>{data.identity.publicProfile.position}</span>
              )}
              <DemoBadge demo={data.identity.publicProfile.isDemo} />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {data.identity.publicProfile && (
            <Link
              href={`/researchers/${data.identity.publicProfile.slug}`}
              className={buttonVariants({ variant: "secondary" })}
            >
              Public profile
            </Link>
          )}
          <Link
            href="/researcher/publications/new"
            className={buttonVariants()}
          >
            <FilePlus2 aria-hidden="true" size={16} /> Submit publication
          </Link>
        </div>
      </header>

      <section
        className="workspace-section"
        aria-labelledby="needs-action-title"
      >
        <div className="workspace-section-heading">
          <div>
            <p className="workspace-overline">Priority</p>
            <h2 id="needs-action-title" className="workspace-section-title">
              Needs your action
            </h2>
          </div>
          <Badge>{data.needsAction.length} records</Badge>
        </div>
        {data.needsAction.length === 0 ? (
          <div className="workspace-panel flex items-start gap-3 border-[var(--color-success-border)] bg-[var(--color-success-soft)] p-5">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[var(--color-success)]"
              size={19}
            />
            <div>
              <h3 className="font-sans text-sm font-bold text-[var(--color-ink)]">
                Nothing needs your attention right now
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Any requested changes will appear here with direct links to
                feedback and editing.
              </p>
            </div>
          </div>
        ) : (
          <ol className="workspace-panel border-[var(--color-warning-border)]">
            {data.needsAction.map((publication) => (
              <li
                key={publication.id}
                className="workspace-record border-l-4 border-l-amber-500 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={publication.status} />
                    <DemoBadge demo={publication.is_demo} />
                  </div>
                  <h3 className="mt-2 break-words font-sans text-base font-bold text-[var(--color-ink)]">
                    {publication.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Review the recorded feedback, update the submission, and
                    resubmit it.
                  </p>
                  <p className="mt-2 text-xs text-[var(--color-text-subtle)]">
                    Updated {formatDate(publication.updated_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/researcher/publications/${publication.id}#review-history`}
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    <MessageSquareText aria-hidden="true" size={15} /> View
                    feedback
                  </Link>
                  <Link
                    href={`/researcher/publications/${publication.id}#edit-resubmit`}
                    className={buttonVariants()}
                  >
                    Edit and resubmit
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section
        className="workspace-section"
        aria-labelledby="submission-summary-title"
      >
        <div className="workspace-section-heading">
          <h2 id="submission-summary-title" className="workspace-section-title">
            Submission status
          </h2>
          <Link href="/researcher/publications" className="text-link text-sm">
            View all submissions
          </Link>
        </div>
        <dl className="workspace-status-strip">
          {metricLabels.map(({ key, label }) => (
            <div
              key={key}
              className={
                key === "changesRequested" && data.metrics[key] > 0
                  ? "workspace-status-item bg-[var(--color-warning-soft)]"
                  : "workspace-status-item"
              }
            >
              <dt className="workspace-status-label">{label}</dt>
              <dd className="workspace-status-value">{data.metrics[key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="workspace-section"
        aria-labelledby="recent-submissions-title"
      >
        <div className="workspace-section-heading">
          <h2 id="recent-submissions-title" className="workspace-section-title">
            Recent submissions
          </h2>
        </div>
        {data.recentSubmissions.length === 0 ? (
          <div className="workspace-panel p-6 text-center sm:p-8">
            <h3 className="font-sans text-base font-bold">
              No submissions yet
            </h3>
            <p className="mx-auto mt-1 max-w-lg text-sm text-[var(--color-text-muted)]">
              Start with a title and abstract. The record stays private until an
              administrator publishes it.
            </p>
            <Link
              href="/researcher/publications/new"
              className={buttonVariants({ className: "mt-5" })}
            >
              Submit a publication
            </Link>
          </div>
        ) : (
          <ol className="workspace-panel">
            {data.recentSubmissions.map((publication) => (
              <li
                key={publication.id}
                className="workspace-record sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={publication.status} />
                    <DemoBadge demo={publication.is_demo} />
                    <span className="text-xs text-[var(--color-text-subtle)]">
                      Updated {formatDate(publication.updated_at)}
                    </span>
                  </div>
                  <h3 className="mt-2 break-words font-sans text-base font-bold text-[var(--color-ink)]">
                    {publication.title}
                  </h3>
                </div>
                <Link
                  href={`/researcher/publications/${publication.id}`}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Open <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-5">
        <Link href="/researcher/publications/new" className={buttonVariants()}>
          <FilePlus2 aria-hidden="true" size={16} /> Submit publication
        </Link>
        <Link href="/research" className={buttonVariants({ variant: "ghost" })}>
          <BookOpen aria-hidden="true" size={16} /> Browse public research
        </Link>
      </div>
    </div>
  );
}
