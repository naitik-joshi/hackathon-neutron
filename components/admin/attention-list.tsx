import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge, Card, buttonVariants } from "@/components/ui";
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
    <section id="needs-attention" aria-labelledby="needs-attention-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Configured freshness checks</p>
          <h2 id="needs-attention-title" className="mt-1 text-2xl">
            Needs attention
          </h2>
        </div>
        <Badge>{items.length} records</Badge>
      </div>

      {items.length === 0 ? (
        <Card className="flex items-start gap-3 border-emerald-200 bg-emerald-50/50">
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-emerald-700"
            size={20}
          />
          <div>
            <h3 className="text-lg">Nothing currently needs attention.</h3>
            <p className="mt-1 text-sm text-slate-600">
              No record has crossed the configured hackathon freshness windows.
            </p>
          </div>
        </Card>
      ) : (
        <ol className="grid gap-4">
          {items.map((item) => (
            <li key={item.key}>
              <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-slate-500"
                    size={19}
                  />
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge className={severityStyles[item.severity]}>
                        {item.severity} priority
                      </Badge>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {item.entityType}
                      </span>
                    </div>
                    <h3 className="truncate text-lg">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.reason}</p>
                    <time
                      className="mt-2 block text-xs text-slate-500"
                      dateTime={item.timestamp}
                    >
                      Last updated{" "}
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
                  className={buttonVariants({
                    variant: "secondary",
                    className: "shrink-0",
                  })}
                >
                  Inspect record
                </Link>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-4 text-xs text-slate-500">
        These are configurable demo defaults for hackathon operations, not
        institutional policy or service-level commitments.
      </p>
    </section>
  );
}
