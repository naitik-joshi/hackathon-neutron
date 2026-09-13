import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { ReviewHistory } from "@/components/shared/review-history";
import { buttonVariants } from "@/components/ui";
import { EditPublicationForm } from "@/features/publications/edit-publication-form";
import { editablePublicationStatuses } from "@/features/publications/mutations";
import { getPublicationReviews } from "@/features/submissions/queries";
import { requireRole } from "@/lib/auth/guards";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function ResearcherPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { client, profile } = await requireRole(["researcher"]);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { data: publication, error } = await client
    .from("publications")
    .select("*")
    .eq("id", id)
    .eq("submitted_by", profile.id)
    .maybeSingle();
  if (error) throw new Error("Could not load your publication.");
  if (!publication) notFound();
  const reviews = await getPublicationReviews(id);
  const editable = editablePublicationStatuses.includes(
    publication.status as (typeof editablePublicationStatuses)[number],
  );
  const changesRequested = publication.status === "changes_requested";

  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div className="min-w-0">
          <p className="workspace-overline">Publication record</p>
          <h1 className="workspace-page-title max-w-4xl">
            {publication.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={publication.status} />
            <DemoBadge demo={publication.is_demo} />
            <span className="text-xs text-[var(--color-text-subtle)]">
              Updated {formatDate(publication.updated_at)}
            </span>
          </div>
        </div>
        <Link
          href="/researcher/publications"
          className={buttonVariants({ variant: "secondary" })}
        >
          All publications
        </Link>
      </header>

      {changesRequested && (
        <div
          className="workspace-panel border-l-4 border-l-amber-500 bg-[var(--color-warning-soft)] p-5"
          role="status"
        >
          <h2 className="font-sans text-base font-bold text-[var(--color-ink)]">
            Changes are requested
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Read the latest feedback below, then update and resubmit this
            record.
          </p>
          <a
            href="#review-history"
            className="text-link mt-3 inline-block text-sm"
          >
            Go to feedback
          </a>
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(19rem,.75fr)]">
        <div className="space-y-6">
          <section
            className="workspace-panel p-5 sm:p-7"
            aria-labelledby="abstract-title"
          >
            <h2 id="abstract-title" className="workspace-section-title">
              Abstract
            </h2>
            <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[var(--color-text)]">
              {publication.abstract}
            </p>
            <dl className="mt-6 grid gap-4 border-t border-[var(--color-border)] pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-bold text-[var(--color-ink)]">DOI</dt>
                <dd className="mt-1 break-all text-[var(--color-text-muted)]">
                  {publication.doi || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[var(--color-ink)]">Year</dt>
                <dd className="mt-1 text-[var(--color-text-muted)]">
                  {publication.year || "Not provided"}
                </dd>
              </div>
            </dl>
          </section>
          <div id="review-history" className="scroll-mt-28">
            <ReviewHistory reviews={reviews} />
          </div>
        </div>

        <section
          id="edit-resubmit"
          className="workspace-panel scroll-mt-28 p-5 sm:p-6"
        >
          {editable ? (
            <>
              <p className="workspace-overline">Next action</p>
              <h2 className="mt-2 font-sans text-lg font-bold text-[var(--color-ink)]">
                Edit and resubmit
              </h2>
              <p className="mt-2 mb-5 text-sm text-[var(--color-text-muted)]">
                Saving sends the updated record back to the review queue.
              </p>
              <EditPublicationForm publication={publication} />
            </>
          ) : (
            <>
              <p className="workspace-overline">Current state</p>
              <h2 className="mt-2 font-sans text-lg font-bold text-[var(--color-ink)]">
                Editing is unavailable
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {publication.status === "published"
                  ? "This publication is public and cannot be edited from the submission workspace."
                  : publication.status === "rejected"
                    ? "This submission is closed. Review the feedback and contact the R&D team if you need guidance."
                    : "This submission is locked while the R&D team reviews it."}
              </p>
              {publication.status === "published" && (
                <Link
                  href={`/publications/${publication.slug}`}
                  className="text-link mt-5 inline-block text-sm"
                >
                  View public publication
                </Link>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
