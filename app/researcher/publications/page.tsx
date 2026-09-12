import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { PublicationList } from "@/components/research/publication-list";
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
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Could not load submissions");
  return (
    <>
      <PageHeader
        eyebrow="Researcher / Publications"
        title="Your submissions"
        description="Track your latest 100 publications. Administrators review and publish institutional information."
      />
      {(await searchParams).submitted === "1" && (
        <p
          role="status"
          className="mb-6 rounded-lg bg-emerald-100 p-4 text-emerald-900"
        >
          Publication submitted for review.
        </p>
      )}
      {(await searchParams).resubmitted === "1" && (
        <p role="status" className="alert alert-success mb-6">
          Publication updated and resubmitted for review.
        </p>
      )}
      <PublicationList items={data} mode="researcher" />
    </>
  );
}
