import { Badge } from "@/components/ui";
import type { PublicationStatus } from "@/lib/supabase/database.types";
const labels: Record<PublicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  changes_requested: "Changes Requested",
  published: "Published",
  rejected: "Rejected",
};
export function StatusBadge({ status }: { status: PublicationStatus }) {
  const styles: Record<PublicationStatus, string> = {
    draft: "border-slate-300 bg-slate-100 text-slate-800",
    submitted: "border-blue-200 bg-blue-50 text-blue-800",
    under_review: "border-violet-200 bg-violet-50 text-violet-800",
    changes_requested: "border-amber-200 bg-amber-50 text-amber-900",
    published: "border-emerald-200 bg-emerald-50 text-emerald-900",
    rejected: "border-red-200 bg-red-50 text-red-800",
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
}
export function DemoBadge({ demo }: { demo: boolean }) {
  return demo ? (
    <Badge className="bg-amber-100 text-amber-900">DEMO DATA</Badge>
  ) : null;
}
