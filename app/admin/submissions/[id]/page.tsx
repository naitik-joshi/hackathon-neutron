import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ExternalLink } from "lucide-react";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { ReviewHistory } from "@/components/shared/review-history";
import { FormMessage, buttonVariants } from "@/components/ui";
import { ReviewForm } from "@/features/submissions/review-form";
import { getPublicationReviews } from "@/features/submissions/queries";
import { requireRole } from "@/lib/auth/guards";

export const metadata = {
  title: "Review publication | Islington R&D Digital Hub",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function AdminSubmissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { client } = await requireRole(["admin"]);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { data: publication, error } = await client
    .from("publications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Could not load submission");
  if (!publication) notFound();

  const [submitterResult, researcherLinks, projectLinks, reviews] =
    await Promise.all([
      publication.submitted_by
        ? client
            .from("profiles")
            .select("display_name")
            .eq("id", publication.submitted_by)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      client
        .from("publication_researchers")
        .select("researcher_id")
        .eq("publication_id", id),
      client
        .from("publication_projects")
        .select("project_id")
        .eq("publication_id", id),
      getPublicationReviews(id),
    ]);
  const researcherIds = (researcherLinks.data ?? []).map(
    (link) => link.researcher_id,
  );
  const projectIds = (projectLinks.data ?? []).map((link) => link.project_id);
  const [researchersResult, projectsResult] = await Promise.all([
    researcherIds.length
      ? client
          .from("researchers")
          .select("id,name,slug")
          .in("id", researcherIds)
      : Promise.resolve({ data: [], error: null }),
    projectIds.length
      ? client.from("projects").select("id,title,slug").in("id", projectIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const updated = (await searchParams).updated === "1";

  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div className="min-w-0">
          <p className="workspace-overline">Admin / Publication record</p>
          <h1 className="workspace-page-title max-w-4xl">
            {publication.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={publication.status} />
            <DemoBadge demo={publication.is_demo} />
            <span className="text-xs text-[var(--color-text-subtle)]">
              Record {publication.id.slice(0, 8)} · Received{" "}
              {formatDate(publication.created_at)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {publication.status === "published" && (
            <Link
              href={`/publications/${publication.slug}`}
              className={buttonVariants({ variant: "secondary" })}
            >
              Public record <ExternalLink aria-hidden="true" size={14} />
            </Link>
          )}
          <Link
            href="/admin/submissions"
            className={buttonVariants({ variant: "secondary" })}
          >
            Back to queue
          </Link>
        </div>
      </header>

      {updated && (
        <FormMessage tone="success">
          Review decision recorded. The publication status is now up to date.
        </FormMessage>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,.65fr)]">
        <div className="space-y-6">
          <section
            className="workspace-panel p-5 sm:p-7"
            aria-labelledby="submission-abstract-title"
          >
            <h2
              id="submission-abstract-title"
              className="workspace-section-title"
            >
              Submission details
            </h2>
            <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[var(--color-text)]">
              {publication.abstract}
            </p>
            <dl className="mt-6 grid gap-4 border-t border-[var(--color-border)] pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-bold">Submitted by</dt>
                <dd className="mt-1 text-[var(--color-text-muted)]">
                  {submitterResult.data?.display_name || "Researcher account"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Last updated</dt>
                <dd className="mt-1 text-[var(--color-text-muted)]">
                  {formatDate(publication.updated_at)}
                </dd>
              </div>
              <div>
                <dt className="font-bold">DOI</dt>
                <dd className="mt-1 break-all text-[var(--color-text-muted)]">
                  {publication.doi || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Year</dt>
                <dd className="mt-1 text-[var(--color-text-muted)]">
                  {publication.year || "Not provided"}
                </dd>
              </div>
            </dl>
          </section>

          <ReviewHistory reviews={reviews} />

          {researchersResult.data?.length || projectsResult.data?.length ? (
            <section
              className="workspace-panel p-5 sm:p-6"
              aria-labelledby="connected-records-title"
            >
              <h2
                id="connected-records-title"
                className="workspace-section-title"
              >
                Connected public records
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Researchers
                  </h3>
                  {researchersResult.data?.length ? (
                    <ul className="mt-2 space-y-2">
                      {researchersResult.data.map((researcher) => (
                        <li key={researcher.id}>
                          <Link
                            href={`/researchers/${researcher.slug}`}
                            className="text-link text-sm"
                          >
                            {researcher.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      None linked.
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Projects
                  </h3>
                  {projectsResult.data?.length ? (
                    <ul className="mt-2 space-y-2">
                      {projectsResult.data.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-link text-sm"
                          >
                            {project.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      None linked.
                    </p>
                  )}
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <aside
          className="workspace-panel p-5 sm:p-6 xl:sticky xl:top-28"
          aria-labelledby="decision-title"
        >
          <p className="workspace-overline">Available action</p>
          <h2
            id="decision-title"
            className="mt-2 font-sans text-lg font-bold text-[var(--color-ink)]"
          >
            Review decision
          </h2>
          <p className="mt-2 mb-5 text-sm text-[var(--color-text-muted)]">
            Use only the actions available for the current workflow status.
            Notes are required when requesting changes or rejecting.
          </p>
          <ReviewForm id={id} status={publication.status} />
        </aside>
      </div>
    </div>
  );
}
