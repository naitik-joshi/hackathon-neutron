import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { Card, buttonClass } from "@/components/ui";
export default async function ResearcherDashboard() {
  const { profile, client } = await requireRole(["researcher"]);
  const { count, error } = await client
    .from("publications")
    .select("id", { count: "exact", head: true })
    .eq("submitted_by", profile.id);
  if (error) throw new Error("Could not load submissions");
  return (
    <>
      <PageHeader
        eyebrow="Researcher workspace"
        title={profile.display_name || "Your research workspace"}
        description="Share your research with the institution. Follow each submission from review to publication."
      />
      <Card>
        <p className="eyebrow">Researcher account</p>
        <h2 className="my-3 text-2xl">{count ?? 0} publication submissions</h2>
        <p className="mb-6">
          Your next step: submit an output, or check the status of your existing
          work.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/researcher/publications/new" className={buttonClass}>
            Submit a publication
          </Link>
          <Link href="/researcher/publications" className="text-link">
            View my submissions →
          </Link>
        </div>
      </Card>
    </>
  );
}
