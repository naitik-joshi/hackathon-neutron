import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { PublicationList } from "@/components/research/publication-list";
export default async function Submissions() {
  const { client } = await requireRole(["admin"]);
  const { data, error } = await client
    .from("publications")
    .select("*")
    .in("status", ["submitted", "under_review"])
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw new Error("Could not load review queue");
  return (
    <>
      <PageHeader
        eyebrow="Admin / Submissions"
        title="Ready for review"
        description="Oldest first. Review up to 100 pending submissions; publication requires an explicit approval."
      />
      <PublicationList items={data} mode="admin" />
    </>
  );
}
