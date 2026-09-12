import Link from "next/link";
import { Card } from "@/components/ui";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { Publication } from "@/lib/supabase/database.types";
export function PublicationList({
  items,
  mode = "public",
}: {
  items: Publication[];
  mode?: "public" | "researcher" | "admin";
}) {
  if (!items.length)
    return (
      <EmptyState
        title={
          mode === "researcher"
            ? "Your first publication starts here"
            : "No publications to show"
        }
        description={
          mode === "researcher"
            ? "Submit your research for administrative review."
            : "Try another search or return as more research is published."
        }
        href={
          mode === "researcher" ? "/researcher/publications/new" : "/research"
        }
        action={
          mode === "researcher"
            ? "Submit a publication"
            : "Explore research areas"
        }
      />
    );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id}>
          <div className="mb-4 flex flex-wrap gap-2">
            <DemoBadge demo={item.is_demo} />
            <StatusBadge status={item.status} />
            {item.year && (
              <span className="text-sm text-slate-500">{item.year}</span>
            )}
          </div>
          <h2 className="text-2xl">{item.title}</h2>
          <p className="my-4 line-clamp-3 text-slate-600">{item.abstract}</p>
          {mode === "admin" ? (
            <Link href={`/admin/submissions/${item.id}`} className="text-link">
              Review submission →
            </Link>
          ) : item.status === "published" ? (
            <Link href={`/publications/${item.slug}`} className="text-link">
              Read publication →
            </Link>
          ) : (
            <p className="text-sm text-slate-600">
              {item.status === "changes_requested"
                ? "Contact the administrator for requested changes; resubmission editing is coming next."
                : item.status === "rejected"
                  ? "Contact the administrator to discuss the review outcome."
                  : "Your submission is private while the review is in progress."}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
