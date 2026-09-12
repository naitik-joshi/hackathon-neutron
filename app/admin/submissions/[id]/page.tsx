import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge, DemoBadge } from "@/components/shared/status-badge";
import { ReviewForm } from "@/features/submissions/review-form";
import { Card } from "@/components/ui";
export default async function Submission({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { client } = await requireRole(["admin"]);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { data, error } = await client
    .from("publications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Could not load submission");
  if (!data) notFound();
  return (
    <>
      <PageHeader
        eyebrow="Admin / Publication review"
        title={data.title}
        description="Check the research record before deciding whether it is ready for the public collection."
      />
      {(await searchParams).updated === "1" && (
        <p role="status" className="mb-5 rounded bg-emerald-100 p-4">
          Review decision saved.
        </p>
      )}
      <Card>
        <div className="flex gap-2">
          <StatusBadge status={data.status} />
          <DemoBadge demo={data.is_demo} />
        </div>
        <h2 className="mt-6 text-2xl">Abstract</h2>
        <p className="my-4 whitespace-pre-wrap">{data.abstract}</p>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-bold">DOI</dt>
            <dd>{data.doi || "Not provided"}</dd>
          </div>
          <div>
            <dt className="font-bold">Year</dt>
            <dd>{data.year || "Not provided"}</dd>
          </div>
          <div>
            <dt className="font-bold">Submitted by</dt>
            <dd className="break-all">
              {data.submitted_by || "Institutional seed / deleted account"}
            </dd>
          </div>
        </dl>
        <ReviewForm id={id} status={data.status} />
        {data.status === "published" && (
          <Link
            className="text-link mt-5 inline-block"
            href={`/publications/${data.slug}`}
          >
            View public publication →
          </Link>
        )}
      </Card>
      <Link className="text-link mt-6 inline-block" href="/admin/submissions">
        ← Back to submissions
      </Link>
    </>
  );
}
