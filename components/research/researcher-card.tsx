import Link from "next/link";
import { Card } from "@/components/ui";
import { DemoBadge } from "@/components/shared/status-badge";
import type { Researcher } from "@/lib/supabase/database.types";
export function ResearcherCard({ researcher }: { researcher: Researcher }) {
  return (
    <Card className="space-y-3 min-w-0 break-words">
      <DemoBadge demo={researcher.is_demo} />
      <h2 className="headline-sm">{researcher.name}</h2>
      {researcher.position && (
        <p className="text-sm font-semibold">{researcher.position}</p>
      )}
      {researcher.bio && (
        <p className="text-sm text-slate-600 line-clamp-3">{researcher.bio}</p>
      )}
      <Link
        href={`/researchers/${researcher.slug}`}
        className="inline-block underline"
      >
        View researcher →
      </Link>
    </Card>
  );
}
