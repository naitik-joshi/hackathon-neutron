import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InitialsAvatar } from "@/components/shared/initials-avatar";
import { DemoBadge } from "@/components/shared/status-badge";
import type { Researcher, Area } from "@/lib/supabase/database.types";

export function ResearcherCard({
  researcher,
}: {
  researcher: Researcher & { areas?: Area[] };
}) {
  return (
    <article className="researcher-card interactive-surface">
      <InitialsAvatar name={researcher.name} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <DemoBadge demo={researcher.is_demo} />
          <p className="section-kicker">Researcher</p>
        </div>
        <h2 className="type-h3 mt-2 break-words">
          <Link
            href={`/researchers/${researcher.slug}`}
            className="entity-title-link"
          >
            {researcher.name}
          </Link>
        </h2>
        {researcher.position && (
          <p className="mt-1 text-sm font-semibold text-[var(--color-ink-soft)]">
            {researcher.position}
          </p>
        )}
        {researcher.bio && (
          <p className="mt-3 line-clamp-3 text-sm text-muted">
            {researcher.bio}
          </p>
        )}
        {researcher.areas && researcher.areas.length > 0 && (
          <div
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Research areas"
          >
            {researcher.areas.slice(0, 3).map((area) => (
              <span key={area.id} className="entity-chip">
                {area.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <Link
        href={`/researchers/${researcher.slug}`}
        className="researcher-card-action"
        aria-label={`View ${researcher.name}`}
      >
        <span className="sr-only sm:not-sr-only">View profile</span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </article>
  );
}
