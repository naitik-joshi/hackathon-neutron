import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, Inbox } from "lucide-react";
import { AttentionList } from "@/components/admin/attention-list";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui";
import { getAdminOverview } from "@/features/operations/queries";
import { getAdminDashboardData } from "@/features/submissions/admin-queries";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const metadata = { title: "Admin overview | Islington R&D Digital Hub" };

export default async function Admin() {
  const [{ metrics, recentSubmissions, recentInterests }, { attention }] =
    await Promise.all([getAdminDashboardData(), getAdminOverview()]);
  const summary = [
    ["Submitted", metrics.submitted],
    ["Under review", metrics.underReview],
    ["Changes requested", metrics.changesRequested],
    ["Published", metrics.published],
    ["Rejected", metrics.rejected],
    ["Project interests", metrics.totalInterestCount],
  ] as const;

  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div>
          <p className="workspace-overline">Research operations</p>
          <h1 className="workspace-page-title">Admin overview</h1>
          <p className="workspace-page-description">
            See records that need attention, review publication submissions, and
            read student project interests.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/submissions" className={buttonVariants()}>
            <FileCheck2 aria-hidden="true" size={16} /> Review queue
          </Link>
          <Link
            href="/admin/interests"
            className={buttonVariants({ variant: "secondary" })}
          >
            <Inbox aria-hidden="true" size={16} /> Interest inbox
          </Link>
        </div>
      </header>

      <AttentionList items={attention} />

      <section
        className="workspace-section"
        aria-labelledby="operations-status-title"
      >
        <div className="workspace-section-heading">
          <h2 id="operations-status-title" className="workspace-section-title">
            Operational status
          </h2>
        </div>
        <dl className="workspace-status-strip">
          {summary.map(([label, value]) => (
            <div
              key={label}
              className={
                label === "Changes requested" && value > 0
                  ? "workspace-status-item bg-[var(--color-warning-soft)]"
                  : "workspace-status-item"
              }
            >
              <dt className="workspace-status-label">{label}</dt>
              <dd className="workspace-status-value">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="workspace-section"
        aria-labelledby="queue-preview-title"
      >
        <div className="workspace-section-heading">
          <div>
            <h2 id="queue-preview-title" className="workspace-section-title">
              Publication review queue
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Recent submissions that may need an admin decision.
            </p>
          </div>
          <Link href="/admin/submissions" className="text-link text-sm">
            Open full queue
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <div className="workspace-panel flex items-start gap-3 p-5">
            <CheckCircle2
              aria-hidden="true"
              className="text-[var(--color-success)]"
              size={19}
            />
            <div>
              <h3 className="font-sans text-sm font-bold">
                No submissions awaiting review
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                New researcher submissions will appear here.
              </p>
            </div>
          </div>
        ) : (
          <ol className="workspace-panel">
            {recentSubmissions.map((submission) => (
              <li
                key={submission.id}
                className="workspace-record sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={submission.status} />
                    <DemoBadge demo={submission.is_demo} />
                    <span className="text-xs text-[var(--color-text-subtle)]">
                      Received {formatDate(submission.created_at)}
                    </span>
                  </div>
                  <h3 className="mt-2 break-words font-sans text-base font-bold text-[var(--color-ink)]">
                    {submission.title}
                  </h3>
                </div>
                <Link
                  href={`/admin/submissions/${submission.id}`}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Review <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section
        className="workspace-section"
        aria-labelledby="interest-preview-title"
      >
        <div className="workspace-section-heading">
          <div>
            <h2 id="interest-preview-title" className="workspace-section-title">
              Recent project interests
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Messages recorded by signed-in participants.
            </p>
          </div>
          <Link href="/admin/interests" className="text-link text-sm">
            Open interest inbox
          </Link>
        </div>
        {recentInterests.length === 0 ? (
          <div className="workspace-panel p-5 text-sm text-[var(--color-text-muted)]">
            No project interests have been recorded.
          </div>
        ) : (
          <ol className="workspace-panel">
            {recentInterests.map((interest) => (
              <li
                key={interest.id}
                className="workspace-record sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <DemoBadge demo={interest.is_demo} />
                    <span className="break-all text-sm font-bold text-[var(--color-ink)]">
                      {interest.contact_email}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
                    {interest.message}
                  </p>
                </div>
                <time
                  className="text-xs text-[var(--color-text-subtle)]"
                  dateTime={interest.created_at}
                >
                  {formatDate(interest.created_at)}
                </time>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
