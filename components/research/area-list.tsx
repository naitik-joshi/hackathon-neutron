import Link from "next/link";
import { Card } from "@/components/ui";
import { DemoBadge } from "@/components/shared/status-badge";
import type { Area } from "@/lib/supabase/database.types";
export function AreaList({ areas }: { areas: Area[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {areas.map((area) => (
        <Card key={area.id}>
          <DemoBadge demo={area.is_demo} />
          <h2 className="mt-3 text-2xl">{area.name}</h2>
          <p className="my-4 text-slate-600">{area.description}</p>
          <Link href={`/research/${area.slug}`} className="text-link">
            Explore this area →
          </Link>
        </Card>
      ))}
    </div>
  );
}
