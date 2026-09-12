import Link from "next/link";
import { InitialsAvatar } from "@/components/shared/initials-avatar";
import { DemoBadge } from "@/components/shared/status-badge";
import type { Researcher } from "@/lib/supabase/database.types";

export function ProjectTeam({ researchers }: { researchers: Researcher[] }) {
  if (researchers.length === 0) {
    return (
      <div className="border-l-2 border-[var(--color-border-strong)] pl-4">
        <p className="section-kicker">Connected researchers</p>
        <p className="mt-2 text-sm text-muted">
          No public researcher profiles are linked to this project yet.
        </p>
        <Link href="/researchers" className="text-link mt-3 inline-block">
          Browse researchers →
        </Link>
      </div>
    );
  }

  return (
    <section aria-labelledby="project-team-title">
      <div className="flex items-end justify-between gap-3">
        <h2 id="project-team-title" className="type-h3">
          Connected researchers
        </h2>
        <span className="text-sm text-muted">{researchers.length}</span>
      </div>
      <div className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {researchers.map((member) => (
          <div key={member.id} className="flex min-w-0 items-center gap-3 py-4">
            <InitialsAvatar name={member.name} className="h-10 w-10 text-xs" />
            <div className="min-w-0 flex-1">
              <Link
                href={`/researchers/${member.slug}`}
                className="entity-title-link font-semibold"
              >
                {member.name}
              </Link>
              {member.position && (
                <p className="truncate text-xs text-muted">{member.position}</p>
              )}
            </div>
            <DemoBadge demo={member.is_demo} />
          </div>
        ))}
      </div>
    </section>
  );
}
