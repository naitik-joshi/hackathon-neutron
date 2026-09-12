import Link from "next/link";
import { User } from "lucide-react";
import { Card } from "@/components/ui";
import { DemoBadge } from "@/components/shared/status-badge";
import type { Researcher } from "@/lib/supabase/database.types";

export function ProjectTeam({ researchers }: { researchers: Researcher[] }) {
  if (researchers.length === 0) {
    return (
      <Card>
        <span className="eyebrow block">Research Team</span>
        <p className="mt-3 text-sm text-slate-600">
          No researchers are linked to this project record yet.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="eyebrow">Connected researchers</span>
        <span className="font-mono text-xs text-slate-500">
          {researchers.length}{" "}
          {researchers.length === 1 ? "Researcher" : "Researchers"}
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {researchers.map((member) => {
          const name = member.name.replace(/^DEMO DATA — /, "");
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-semibold text-slate-700">
                  {initials || <User size={14} />}
                </div>
                <div>
                  <Link href={`/researchers/${member.slug}`} className="text-sm font-semibold text-slate-900 hover:text-indigo-700 hover:underline">
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
  );
}
