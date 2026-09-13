import Link from "next/link";
import { SubmissionForm } from "@/features/publications/submission-form";
import { requireRole } from "@/lib/auth/guards";

export const metadata = {
  title: "Submit a Publication | Islington R&D Digital Hub",
  description: "Submit research information for administrative review.",
};

export default async function NewPublication() {
  await requireRole(["researcher"]);
  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div>
          <p className="workspace-overline">Publication workflow</p>
          <h1 className="workspace-page-title">Submit a publication</h1>
          <p className="workspace-page-description">
            Add the title and abstract that administrators will review. DOI and
            year are optional.
          </p>
        </div>
        <Link href="/researcher/publications" className="text-link text-sm">
          Back to publications
        </Link>
      </header>
      <div className="workspace-panel max-w-3xl p-5 sm:p-7">
        <SubmissionForm />
      </div>
    </div>
  );
}
