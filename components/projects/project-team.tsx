import Link from "next/link";
import { User } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { DemoBadge } from "@/components/shared/status-badge";
import type { Researcher } from "@/lib/supabase/database.types";

export function ProjectTeam({ researchers }: { researchers: Researcher[] }) {
  if (researchers.length === 0) {
    return (
      <Card>
        <span className="eyebrow block">Research Team</span>
        <p className="mt-3 text-sm text-slate-600">
          Faculty mentors and student investigators are currently being appointed to this project.
        </p>
      </Card>
    );
  }

  const [lead, ...members] = researchers;
  const leadDisplayName = lead.name.replace(/^DEMO DATA — /, "");
  const leadInitials = leadDisplayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Principal Investigator / Lead Researcher Card */}
      <Card>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="eyebrow">Principal Investigator</span>
          <Badge className="bg-blue-50 text-blue-800 border border-blue-200">
            Project Lead
          </Badge>
        </div>

        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#142c43] font-mono text-base font-bold text-white shadow-sm">
            {leadInitials || <User size={22} />}
          </div>
          <div>
            <DemoBadge demo={lead.is_demo} />
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {leadDisplayName}
            </h3>
            <p className="text-xs font-semibold text-blue-700">
              {lead.position.replace(/^DEMO DATA — /, "")}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {lead.bio.replace(/^DEMO DATA — /, "")}
        </p>

        <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
          <Link
            href={`/researchers/${lead.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 px-3 font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
          >
            <User size={14} aria-hidden="true" />
            View Academic Profile
          </Link>
        </div>
      </Card>

      {/* Additional Team Members */}
      {members.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="eyebrow">Collaborators & Fellows</span>
            <span className="font-mono text-xs text-slate-500">
              {members.length} {members.length === 1 ? "Researcher" : "Researchers"}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map((member) => {
              const name = member.name.replace(/^DEMO DATA — /, "");
              const initials = name
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div key={member.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-semibold text-slate-700">
                      {initials || <User size={14} />}
                    </div>
                    <div>
                      <Link
                        href={`/researchers/${member.slug}`}
                        className="text-sm font-semibold text-slate-900 hover:text-blue-700 transition-colors block"
                      >
                        {name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {member.position.replace(/^DEMO DATA — /, "")}
                      </p>
                    </div>
                  </div>
                  <DemoBadge demo={member.is_demo} />
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
