import Link from "next/link";
import { ArrowRight, BookOpen, FolderKanban, Users } from "lucide-react";
import { DemoBadge } from "@/components/shared/status-badge";
import type { AreaDirectoryItem } from "@/features/research/queries";

export function AreaList({ areas }: { areas: AreaDirectoryItem[] }) {
  return (
    <div className="area-index border-y border-[var(--color-border)]">
      {areas.map((area, index) => (
        <article key={area.id} className="area-index-row">
          <div className="area-index-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DemoBadge demo={area.is_demo} />
              <p className="section-kicker">Research area</p>
            </div>
            <h2 className="type-h2 mt-2">
              <Link
                href={`/research/${area.slug}`}
                className="entity-title-link"
              >
                {area.name}
              </Link>
            </h2>
            <p className="mt-3 max-w-3xl text-muted">{area.description}</p>
            <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <div className="inline-flex items-center gap-1.5">
                <Users size={15} aria-hidden="true" />
                <dt className="sr-only">Researchers</dt>
                <dd>{area.researcherCount} researchers</dd>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <FolderKanban size={15} aria-hidden="true" />
                <dt className="sr-only">Projects</dt>
                <dd>{area.projectCount} projects</dd>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <BookOpen size={15} aria-hidden="true" />
                <dt className="sr-only">Published outputs</dt>
                <dd>{area.publicationCount} published outputs</dd>
              </div>
            </dl>
          </div>
          <Link
            href={`/research/${area.slug}`}
            className="area-index-action"
            aria-label={`Explore ${area.name}`}
          >
            Explore area <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
}
