import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui";
import { SubmissionForm } from "@/features/publications/submission-form";

export const metadata = {
  title: "Submit a Publication | Islington R&D Digital Hub",
  description: "Submit research information for administrative review.",
};

export default async function NewPublication() {
  await requireRole(["researcher"]);

  return (
    <div className="page-shell pb-16">
      <Link
        href="/researcher/publications"
        className="text-link mb-6 inline-block"
      >
        ← My publications
      </Link>
      <PageHeader
        eyebrow="Researcher / New publication"
        title="Submit your research"
        description="Provide a clear title and abstract for administrative review. DOI and year are optional. Fields marked * are required."
      />
      <Card className="max-w-3xl">
        <SubmissionForm />
      </Card>
    </div>
  );
}
