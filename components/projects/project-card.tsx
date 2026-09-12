import Link from "next/link";
import { ArrowRight, BookOpen, Users, Layers } from "lucide-react";
import { Card } from "@/components/ui";
import { DemoBadge } from "@/components/shared/status-badge";
import { ProjectStatusBadge } from "./project-status-badge";
import type { ProjectWithRelations } from "@/features/projects/queries";

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const accentBorder =
    project.status === "ongoing"
      ? "border-t-4 border-t-emerald-600"
      : project.status === "proposed"
        ? "border-t-4 border-t-blue-600"
        : "border-t-4 border-t-slate-400";

  return (
    <Card
      className={`flex flex-col justify-between transition-all hover:shadow-md ${accentBorder}`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            <DemoBadge demo={project.is_demo} />
          </div>
          <span className="font-mono text-xs text-slate-500">
            PRJ-{project.id.slice(0, 8)}
          </span>
        </div>

        <h3 className="text-2xl hover:text-blue-700 transition-colors">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>

        <p className="mt-3 text-slate-600 leading-relaxed line-clamp-3">
          {project.summary}
        </p>

        {project.areas.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 mr-1">
              <Layers size={13} aria-hidden="true" />
              Area:
            </span>
            {project.areas.map((area) => (
              <Link
                key={area.id}
                href={`/research/${area.slug}`}
                className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {area.name.replace(/^DEMO DATA — /, "")}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            {project.researchers.length > 0 ? (
              <span className="flex items-center gap-1.5 font-medium text-slate-800">
                <Users
                  size={14}
                  className="text-slate-500"
                  aria-hidden="true"
                />
                {project.researchers
                  .map((r) => r.name.replace(/^DEMO DATA — /, ""))
                  .join(", ")}
              </span>
            ) : (
              <span className="text-slate-500">Research team not linked</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {project.publicationCount > 0 && (
              <span className="flex items-center gap-1 font-mono text-slate-600">
                <BookOpen size={13} aria-hidden="true" />
                {project.publicationCount}{" "}
                {project.publicationCount === 1 ? "paper" : "papers"}
              </span>
            )}
            <Link
              href={`/projects/${project.slug}`}
              className="text-link inline-flex items-center gap-1 text-xs font-semibold"
            >
              View project <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
