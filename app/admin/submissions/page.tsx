import Link from "next/link";
import {
  FileCheck2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Search,
  User,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guards";
import { getAdminSubmissions } from "@/features/submissions/admin-queries";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Input, Button } from "@/components/ui";

export const metadata = {
  title: "Manuscript Triage & Editorial Review Queue | IJMR Admin",
};

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const currentStatus = params.status || "active";
  const query = params.q || "";

  const { items, counts } = await getAdminSubmissions({
    status: currentStatus,
    query,
  });

  const filterTabs = [
    { id: "active", label: "Active Queue", count: counts.active },
    { id: "submitted", label: "Awaiting Triage", count: counts.submitted },
    { id: "under_review", label: "Under Review", count: counts.underReview },
    {
      id: "changes_requested",
      label: "Revisions",
      count: counts.changesRequested,
    },
    { id: "published", label: "Published", count: counts.published },
    { id: "all", label: "All Records", count: counts.all },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="border-b border-[#e2e8f0] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              <Link href="/admin" className="hover:underline">
                Admin Operations
              </Link>
              <span>/</span>
              <span>Editorial Triage Queue</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#0f172a]">
              Manuscript Review Queue
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              Review submitted publications, request changes, and publish
              records through the supported workflow.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff6ff] border border-[#bfdbfe] px-3 py-1 text-xs font-semibold text-[#1e40af]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Database-backed workflow
            </span>
          </div>
        </div>
      </div>

      {/* Queue Telemetry Cards (Real Database Metrics) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">
              Active Queue
            </span>
            <FileCheck2 className="h-4 w-4 text-[#002147]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {counts.active}
          </div>
          <div className="mt-1 text-xs text-[#64748b]">
            Requires editorial action
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">
              Awaiting Triage
            </span>
            <Clock className="h-4 w-4 text-[#ea580c]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {counts.submitted}
          </div>
          <div className="mt-1 text-xs text-[#ea580c] font-medium">
            Newly submitted
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">
              Under Peer Review
            </span>
            <AlertCircle className="h-4 w-4 text-[#0284c7]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {counts.underReview}
          </div>
          <div className="mt-1 text-xs text-[#0284c7] font-medium">
            Active review
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">
              Revisions Pending
            </span>
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {counts.changesRequested}
          </div>
          <div className="mt-1 text-xs text-amber-700 font-medium">
            Author revisions
          </div>
        </div>
      </div>

      {/* Search & Filter Deck */}
      <div className="space-y-3">
        {/* Search Bar */}
        <form method="GET" action="/admin/submissions" className="flex gap-2">
          <div className="relative flex-1">
            <label htmlFor="submission-search" className="sr-only">
              Search submissions
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} aria-hidden="true" />
            </div>
            <Input
              id="submission-search"
              name="q"
              defaultValue={query}
              placeholder="Search by manuscript title, abstract, or DOI..."
              className="pl-9 text-xs"
            />
            {currentStatus !== "active" && (
              <input type="hidden" name="status" value={currentStatus} />
            )}
          </div>
          <Button type="submit" className="text-xs py-2 px-4">
            Search
          </Button>
        </form>

        {/* Working Segmented Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-[#64748b] mr-1" />
            <span className="text-xs font-semibold text-[#334155] mr-1">
              Filter:
            </span>
            {filterTabs.map((tab) => {
              const isActive = currentStatus === tab.id;
              const searchParam = query
                ? `&q=${encodeURIComponent(query)}`
                : "";
              const href = `/admin/submissions?status=${tab.id}${searchParam}`;

              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                    isActive
                      ? "bg-[#002147] text-white font-semibold shadow-sm"
                      : "text-[#64748b] hover:bg-white hover:text-[#0f172a]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded px-1 text-[10px] font-mono ${
                      isActive
                        ? "bg-slate-700 text-blue-200"
                        : "bg-slate-200/70 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {(query || currentStatus !== "active") && (
            <Link
              href="/admin/submissions"
              className="text-xs text-blue-700 hover:underline font-semibold"
            >
              Reset filters
            </Link>
          )}
        </div>
      </div>

      {/* Manuscript Items Queue */}
      {!items.length ? (
        <EmptyState
          title="No manuscripts match your filter"
          description={
            query
              ? `No submissions found matching "${query}". Try adjusting your search or clearing the status filter.`
              : "There are currently no manuscripts in this queue category."
          }
          href="/admin/submissions"
          action="View Active Queue"
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition-all hover:border-[#cbd5e1] hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#002147]/5 px-2 py-0.5 font-mono text-xs font-semibold text-[#002147]">
                      MS-{item.id.slice(0, 8)}
                    </span>
                    <DemoBadge demo={item.is_demo} />
                    <StatusBadge status={item.status} />
                    {item.year && (
                      <span className="text-xs text-[#64748b] font-medium">
                        Year {item.year}
                      </span>
                    )}
                    <span className="text-xs text-[#94a3b8]">
                      Received{" "}
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-[#0f172a] group-hover:text-[#002147] transition-colors">
                    <Link href={`/admin/submissions/${item.id}`}>
                      {item.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-2 text-sm text-[#64748b] leading-relaxed">
                    {item.abstract}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b] pt-1 border-t border-slate-100">
                    {item.submitterName ? (
                      <span className="inline-flex items-center gap-1 font-medium text-[#334155]">
                        <User className="h-3.5 w-3.5 text-blue-700" />
                        Submitter: {item.submitterName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">
                        Author submission
                      </span>
                    )}

                    {item.doi && (
                      <span className="font-mono text-[11px] text-slate-500">
                        DOI: {item.doi}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                  <Link
                    href={`/admin/submissions/${item.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#002147] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#001733]"
                  >
                    <span>
                      {item.status === "submitted"
                        ? "Start Triage"
                        : item.status === "under_review"
                          ? "Review submission"
                          : item.status === "changes_requested"
                            ? "Inspect Feedback"
                            : "View Dossier"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <span className="font-mono text-[10px] text-[#94a3b8]">
                    UUID: {item.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
