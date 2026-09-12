import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FilePlus2,
  ListChecks,
  MessageSquareText,
} from "lucide-react";
import { Badge, Card, buttonVariants } from "@/components/ui";
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
  { key: "total", label: "Total submissions" },
  { key: "submitted", label: "Submitted" },
  { key: "underReview", label: "Under review" },
  { key: "changesRequested", label: "Changes requested" },
  { key: "published", label: "Published" },
];

export function ResearcherDashboardView({
  data,
}: {
  data: ResearcherDashboardData;
}) {
  return (
    <div className="page-shell space-y-10 pb-16">
      <header className="academic-card overflow-hidden bg-white">
        <div className="border-b border-slate-200 bg-[#eff4ff] px-5 py-3 sm:px-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-[#0f2042]/15 bg-white text-[#0f2042]">
              Researcher workspace
            </Badge>
            <span className="text-xs text-slate-600">
              Private submission and review activity
            </span>
          </div>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-8">
          <div className="min-w-0">
            <p className="eyebrow">Your research activity</p>
            <h1 className="mt-2 break-words text-3xl tracking-[-0.025em] text-[#0f2042] sm:text-4xl">
              Welcome, {data.identity.displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Track submissions, respond to requested changes, and continue to
              public research when you are ready.
            </p>
            {data.identity.publicProfile && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span>{data.identity.publicProfile.name}</span>
                {data.identity.publicProfile.position && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{data.identity.publicProfile.position}</span>
                  </>
                )}
                <DemoBadge demo={data.identity.publicProfile.isDemo} />
              </div>
            )}
          </div>
          {data.identity.publicProfile && (
            <Link
              href={`/researchers/${data.identity.publicProfile.slug}`}
              className={buttonVariants({ variant: "secondary" })}
            >
              View public profile <ArrowRight aria-hidden="true" size={16} />
            </Link>
          )}
        </div>
      </header>

      <section aria-labelledby="researcher-actions-title">
        <div className="mb-4">
          <p className="eyebrow">Continue your work</p>
          <h2 id="researcher-actions-title" className="mt-1 text-2xl">
            Next actions
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/researcher/publications/new"
            className={buttonVariants({
              className: "min-h-14 justify-between px-5",
            })}
          >
            <span className="inline-flex items-center gap-2">
              <FilePlus2 aria-hidden="true" size={18} /> Submit a publication
            </span>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
          <Link
            href="/researcher/publications"
            className={buttonVariants({
              variant: "secondary",
              className: "min-h-14 justify-between px-5",
            })}
          >
            <span className="inline-flex items-center gap-2">
              <ListChecks aria-hidden="true" size={18} /> View all submissions
            </span>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
          <Link
            href="/research"
            className={buttonVariants({
              variant: "secondary",
              className: "min-h-14 justify-between px-5",
            })}
          >
            <span className="inline-flex items-center gap-2">
              <BookOpen aria-hidden="true" size={18} /> Browse public research
            </span>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section aria-labelledby="submission-summary-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Real submission records</p>
            <h2 id="submission-summary-title" className="mt-1 text-2xl">
              Submission summary
            </h2>
          </div>
          {data.metrics.rejected > 0 && (
            <p className="text-sm text-slate-600">
              Rejected: <strong>{data.metrics.rejected}</strong>
            </p>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {metricLabels.map(({ key, label }) => (
            <Card key={key} className="min-w-0 p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </dt>
              <dd className="mt-2 font-serif text-3xl font-bold text-[#0f2042]">
                {data.metrics[key]}
              </dd>
            </Card>
          ))}
        </dl>
      </section>

      <section aria-labelledby="needs-action-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Publication workflow</p>
            <h2 id="needs-action-title" className="mt-1 text-2xl">
              Needs your action
            </h2>
          </div>
          <Badge>{data.needsAction.length} records</Badge>
        </div>

        {data.needsAction.length === 0 ? (
          <Card className="border-emerald-200 bg-emerald-50/60">
            <h3 className="text-lg text-emerald-950">
              Nothing needs your attention right now.
            </h3>
            <p className="mt-2 text-sm text-emerald-900/80">
              Requested changes will appear here with direct links to feedback
              and resubmission.
            </p>
          </Card>
        ) : (
          <ol className="grid gap-4">
            {data.needsAction.map((publication) => (
              <li key={publication.id}>
                <Card className="border-amber-200 bg-amber-50/35 p-5 sm:p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={publication.status} />
                        <DemoBadge demo={publication.is_demo} />
                      </div>
                      <h3 className="mt-3 break-words text-xl text-[#0f2042]">
                        {publication.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        The R&amp;D team requested changes. Review the feedback,
                        update the submission, and resubmit it for review.
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Last updated {formatDate(publication.updated_at)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row md:shrink-0">
                      <Link
                        href={`/researcher/publications/${publication.id}#review-history`}
                        className={buttonVariants({ variant: "secondary" })}
                      >
                        <MessageSquareText aria-hidden="true" size={16} /> View
                        feedback
                      </Link>
                      <Link
                        href={`/researcher/publications/${publication.id}#edit-resubmit`}
                        className={buttonVariants()}
                      >
                        Edit and resubmit
                      </Link>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="recent-submissions-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h2 id="recent-submissions-title" className="mt-1 text-2xl">
              Recent submissions
            </h2>
          </div>
          {data.recentSubmissions.length > 0 && (
            <Link href="/researcher/publications" className="text-link text-sm">
              View all submissions →
            </Link>
          )}
        </div>

        {data.recentSubmissions.length === 0 ? (
          <Card className="border-dashed bg-slate-50/70 text-center">
            <h3 className="text-xl">No submissions yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              Your publication workflow will appear here after your first
              submission.
            </p>
            <Link
              href="/researcher/publications/new"
              className={buttonVariants({ className: "mt-5" })}
            >
              Submit a publication
            </Link>
          </Card>
        ) : (
          <ol className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5 shadow-[0_1px_2px_rgba(15,32,66,0.04)] sm:px-6">
            {data.recentSubmissions.map((publication) => (
              <li key={publication.id}>
                <Link
                  href={`/researcher/publications/${publication.id}`}
                  className="group flex flex-col gap-3 py-5 outline-none focus-visible:ring-2 focus-visible:ring-[#0f2042] focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={publication.status} />
                      <DemoBadge demo={publication.is_demo} />
                    </div>
                    <h3 className="mt-2 break-words text-lg text-[#0f2042] group-hover:underline">
                      {publication.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Created {formatDate(publication.created_at)} · Updated{" "}
                      {formatDate(publication.updated_at)}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0f2042]">
                    Open submission <ArrowRight aria-hidden="true" size={15} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
