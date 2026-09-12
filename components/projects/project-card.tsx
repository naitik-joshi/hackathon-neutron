import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { DemoBadge } from "@/components/shared/status-badge";
import { ProjectStatusBadge } from "./project-status-badge";
import type { Project } from "@/lib/supabase/database.types";
import type { ProjectWithRelations } from "@/features/projects/queries";

export function ProjectCard({
  project,
}: {
  project: Project | ProjectWithRelations;
}) {
  const connected = "publicationCount" in project;
  const canParticipate =
    project.status === "ongoing" || project.status === "proposed";

  return (
    <article className="project-card interactive-surface">
      <div className="flex flex-wrap gap-2">
        <DemoBadge demo={project.is_demo} />
        <ProjectStatusBadge status={project.status} />
      </div>
      <h2 className="type-h3 mt-4 break-words">
        <Link href={`/projects/${project.slug}`} className="entity-title-link">
          {project.title}
        </Link>
      </h2>
      <p className="mt-3 line-clamp-3 text-sm text-muted">{project.summary}</p>
      {connected && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Users size={15} aria-hidden="true" />
            {project.researchers.length} researchers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={15} aria-hidden="true" />
            {project.publicationCount} published outputs
          </span>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link
          href={`/projects/${project.slug}`}
          className="text-link inline-flex items-center gap-1.5"
        >
          Understand this project <ArrowRight size={15} aria-hidden="true" />
        </Link>
        {canParticipate && (
          <Link
            href={`/projects/${project.slug}#get-involved`}
            className="text-link"
          >
            Get involved
          </Link>
        )}
      </div>
    </article>
  );
}
