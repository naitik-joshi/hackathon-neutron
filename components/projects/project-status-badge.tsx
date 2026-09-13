import { Badge } from "@/components/ui";
import type { Project } from "@/lib/supabase/database.types";

const statusLabels: Record<Project["status"], string> = {
  proposed: "Proposed",
  ongoing: "Active / Ongoing",
  completed: "Completed",
  archived: "Archived",
};

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: Project["status"];
  className?: string;
}) {
  const colorClasses: Record<Project["status"], string> = {
    proposed: "bg-sky-100 text-sky-900 border border-sky-200",
    ongoing: "bg-emerald-100 text-emerald-900 border border-emerald-200",
    completed: "bg-slate-100 text-slate-800 border border-slate-200",
    archived: "bg-amber-100 text-amber-900 border border-amber-200",
  };

  return (
    <Badge className={`${colorClasses[status]} ${className ?? ""}`}>
      {statusLabels[status]}
    </Badge>
  );
}
