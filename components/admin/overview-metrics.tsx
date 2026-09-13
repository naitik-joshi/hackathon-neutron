import Link from "next/link";
import { Card } from "@/components/ui";
import type { AdminOverviewMetrics } from "@/features/operations/queries";

export function OverviewMetrics({
  metrics,
}: {
  metrics: AdminOverviewMetrics;
}) {
  const items = [
    {
      label: "Published publications",
      value: metrics.publishedPublications,
      href: "/publications",
      action: "View public collection",
    },
    {
      label: "Pending or reviewing",
      value: metrics.pendingReviews,
      href: "/admin/submissions",
      action: "Open review queue",
    },
    {
      label: "Projects",
      value: metrics.projects,
      href: "/projects",
      action: "View project records",
    },
    {
      label: "Needs attention",
      value: metrics.needsAttention,
      href: "#needs-attention",
      action: "Review attention list",
    },
  ];

  return (
    <section aria-labelledby="overview-metrics-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Live records</p>
          <h2 id="overview-metrics-title" className="mt-1 text-2xl">
            Operations overview
          </h2>
        </div>
        {metrics.changesRequested > 0 && (
          <p className="text-sm text-slate-600">
            {metrics.changesRequested} awaiting researcher changes
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-sm font-semibold text-slate-600">{item.label}</p>
            <p className="my-3 font-mono text-3xl font-semibold text-slate-950">
              {item.value}
            </p>
            <Link href={item.href} className="text-link text-sm">
              {item.action} →
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
