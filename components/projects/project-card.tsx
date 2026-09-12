import Link from "next/link";
import { Card } from "@/components/ui";
import { DemoBadge } from "@/components/shared/status-badge";
import { ProjectStatusBadge } from "./project-status-badge";
import type { Project } from "@/lib/supabase/database.types";
import type { ProjectWithRelations } from "@/features/projects/queries";
export function ProjectCard({
  project,
}: {
  project: Project | ProjectWithRelations;
}) {
  return (
    <Card className="space-y-4 min-w-0 break-words">
      <div className="flex flex-wrap gap-2">
        <DemoBadge demo={project.is_demo} />
        <ProjectStatusBadge status={project.status} />
      </div>
      <h2 className="headline-sm">{project.title}</h2>
      <p className="text-sm text-slate-600">{project.summary}</p>
      {"publicationCount" in project && (
        <p className="text-sm">
          {project.publicationCount} linked published outputs
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="btn-academic-outline"
        >
          View project
        </Link>
        <Link
          href={`/projects/${project.slug}#get-involved`}
          className="inline-flex items-center underline"
        >
          Get involved →
        </Link>
      </div>
    </Card>
  );
}
