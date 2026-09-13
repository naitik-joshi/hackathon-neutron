import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import type {
  Publication,
  Researcher,
  Project,
  Area,
} from "@/lib/supabase/database.types";

type PublicPublication = Publication & {
  authors?: Researcher[];
  projects?: Project[];
  areas?: Area[];
};

export function PublicationList({
  items,
  mode = "public",
}: {
  items: PublicPublication[];
  mode?: "public" | "researcher" | "admin";
}) {
  if (!items.length)
    return (
      <EmptyState
        title={
          mode === "researcher"
            ? "Your first publication starts here"
            : "No publications connected yet"
        }
        description={
          mode === "researcher"
            ? "Submit your research for administrative review."
            : "Browse the full publication index or return as more research is published."
        }
        href={
          mode === "researcher"
            ? "/researcher/publications/new"
            : "/publications"
        }
        action={
          mode === "researcher" ? "Submit a publication" : "Browse publications"
        }
      />
    );

  if (mode !== "public") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="mb-4 flex flex-wrap gap-2">
              <DemoBadge demo={item.is_demo} />
              <StatusBadge status={item.status} />
              {item.year && (
                <span className="text-sm text-muted">{item.year}</span>
              )}
            </div>
            <h2 className="type-h3">{item.title}</h2>
            <p className="my-4 line-clamp-3 text-muted">{item.abstract}</p>
            {mode === "admin" ? (
              <Link
                href={`/admin/submissions/${item.id}`}
                className="text-link"
              >
                Review submission →
              </Link>
            ) : (
              <Link
                href={`/researcher/publications/${item.id}`}
                className="text-link"
              >
                {item.status === "draft" || item.status === "changes_requested"
                  ? "Review and resubmit →"
                  : "View submission and feedback →"}
              </Link>
            )}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="publication-index border-y border-[var(--color-border)]">
      {items.map((item, index) => (
        <article key={item.id} className="publication-row">
          <div className="publication-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <DemoBadge demo={item.is_demo} />
              <span>Published</span>
              {item.year && <span>· {item.year}</span>}
              {item.areas?.slice(0, 2).map((area) => (
                <span key={area.id}>· {area.name}</span>
              ))}
            </div>
            <h2 className="type-h3 mt-2 break-words">
              <Link
                href={`/publications/${item.slug}`}
                className="entity-title-link"
              >
                {item.title}
              </Link>
            </h2>
            {item.authors && item.authors.length > 0 && (
              <p className="mt-2 text-sm text-muted">
                By {item.authors.map((author) => author.name).join(", ")}
              </p>
            )}
            <p className="mt-3 line-clamp-2 max-w-4xl text-sm text-muted">
              {item.abstract}
            </p>
          </div>
          <Link
            href={`/publications/${item.slug}`}
            className="publication-action"
            aria-label={`Read ${item.title}`}
          >
            Read <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
}
