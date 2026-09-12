import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { getPublicationReviews } from "@/features/submissions/queries";
import { editablePublicationStatuses } from "@/features/publications/mutations";
import { EditPublicationForm } from "@/features/publications/edit-publication-form";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { ReviewHistory } from "@/components/shared/review-history";
import { Card } from "@/components/ui";

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
  const editable = editablePublicationStatuses.some(
    (status) => status === publication.status,
  );

  return (
    <>
      <Link
        href="/researcher/publications"
        className="text-link mb-6 inline-block"
      >
        ← My publications
      </Link>
      <PageHeader
        eyebrow="Researcher / Publication"
        title={publication.title}
        description="See the current workflow state, respond to feedback when editing is available, and follow the private review history."
      />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)]">
        <div className="space-y-8">
          <Card>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={publication.status} />
              <DemoBadge demo={publication.is_demo} />
            </div>
            <h2 className="mt-6 text-2xl">Abstract</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">
              {publication.abstract}
            </p>
            <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-900">DOI</dt>
                <dd className="mt-1 text-slate-600">
                  {publication.doi || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Year</dt>
                <dd className="mt-1 text-slate-600">
                  {publication.year || "Not provided"}
                </dd>
              </div>
            </dl>
          </Card>
          <ReviewHistory reviews={reviews} />
        </div>
        <Card>
          {editable ? (
            <>
              <p className="eyebrow">Next action</p>
              <h2 className="mb-5 mt-2 text-2xl">Edit and resubmit</h2>
              <EditPublicationForm publication={publication} />
            </>
          ) : (
            <>
              <p className="eyebrow">Current state</p>
              <h2 className="mb-3 mt-2 text-2xl">Editing is unavailable</h2>
              <p className="text-sm text-slate-600">
                {publication.status === "published"
                  ? "This publication is public and can no longer be edited from the submission workspace."
                  : publication.status === "rejected"
                    ? "This submission is closed. Review the feedback and contact the R&D team if you need guidance."
                    : "This submission is locked while the R&D team reviews it."}
              </p>
              {publication.status === "published" && (
                <Link
                  href={`/publications/${publication.slug}`}
                  className="text-link mt-5 inline-block"
                >
                  View public publication →
                </Link>
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
