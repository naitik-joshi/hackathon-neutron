import { Badge } from "@/components/ui";
import type { PublicationStatus } from "@/lib/supabase/database.types";
const labels: Record<PublicationStatus, string> = { draft: "Draft", submitted: "Submitted", under_review: "Under Review", changes_requested: "Changes Requested", published: "Published", rejected: "Rejected" };
export function StatusBadge({ status }: { status: PublicationStatus }) { return <Badge className={status === "published" ? "bg-emerald-100 text-emerald-900" : status === "changes_requested" ? "bg-amber-100 text-amber-900" : ""}>{labels[status]}</Badge>; }
export function DemoBadge({ demo }: { demo: boolean }) { return demo ? <Badge className="bg-amber-100 text-amber-900">DEMO DATA</Badge> : null; }
