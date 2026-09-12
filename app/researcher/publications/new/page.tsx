import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { SubmissionForm } from "@/features/publications/submission-form";
export default async function NewPublication() { await requireRole(["researcher"]); return <><PageHeader eyebrow="Researcher / New publication" title="Submit your research" description="Give readers a clear title and an abstract that explains why your work matters. Fields marked * are required." /><SubmissionForm /></>; }
