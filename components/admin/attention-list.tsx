import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge, buttonVariants } from "@/components/ui";
import type {
  AttentionItem,
  AttentionSeverity,
} from "@/features/operations/rules";

const severityStyles: Record<AttentionSeverity, string> = {
  high: "border-red-200 bg-red-50 text-red-800",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  low: "border-blue-200 bg-blue-50 text-blue-800",
};

export function AttentionList({ items }: { items: AttentionItem[] }) {
  return (
    <section
      id="needs-attention"
      className="workspace-section"
      aria-labelledby="needs-attention-title"
    >
      <div className="workspace-section-heading">
        <div>
          <p className="workspace-overline">Priority</p>
          <h2 id="needs-attention-title" className="workspace-section-title">
            Needs attention
          </h2>
        </div>
        <Badge>{items.length} records</Badge>
      </div>
      {items.length === 0 ? (
        <div className="workspace-panel flex items-start gap-3 border-[var(--color-success-border)] bg-[var(--color-success-soft)] p-5">
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[var(--color-success)]"
            size={19}
          />
          <div>
            <h3 className="font-sans text-sm font-bold">
              Nothing currently needs attention
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              No record has crossed the configured hackathon freshness windows.
            </p>
          </div>
        </div>
      ) : (
        <ol className="workspace-panel">
          {items.map((item) => (
            <li
              key={item.key}
              className="workspace-record sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="flex min-w-0 items-start gap-3">
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-warning)]"
                  size={18}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={severityStyles[item.severity]}>
                      {item.severity} priority
                    </Badge>
                    <span className="text-xs font-semibold capitalize text-[var(--color-text-muted)]">
                      {item.entityType}
                    </span>
                  </div>
                  <h3 className="mt-2 break-words font-sans text-base font-bold text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {item.reason}
                  </p>
                  <time
                    className="mt-2 block text-xs text-[var(--color-text-subtle)]"
                    dateTime={item.timestamp}
                  >
                    Updated{" "}
                    {new Date(item.timestamp).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                </div>
              </div>
              <Link
                href={item.href}
                className={buttonVariants({ variant: "secondary" })}
              >
                Inspect record
              </Link>
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs text-[var(--color-text-subtle)]">
        Freshness windows are hackathon demonstration defaults, not
        institutional policy.
      </p>
    </section>
  );
}
