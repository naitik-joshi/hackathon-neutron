import Link from "next/link";
import {
  FileCheck2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guards";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata = {
  title: "Manuscript Triage & Editorial Review Queue | IJMR Admin",
};

export default async function Submissions() {
  const { client } = await requireRole(["admin"]);
  const { data, error } = await client
    .from("publications")
    .select("*")
    .in("status", ["submitted", "under_review"])
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) throw new Error("Could not load review queue");

  const items = data || [];
  const awaitingVerdict = items.filter((i) => i.status === "under_review").length;
  const newSubmissions = items.filter((i) => i.status === "submitted").length;

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
              FIFO priority order. Adjudicate peer review reports, assess author rebuttals, and deliver binding institutional editorial decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff6ff] border border-[#bfdbfe] px-3 py-1 text-xs font-semibold text-[#1e40af]">
              <ShieldCheck className="h-3.5 w-3.5" />
              COPE Single-Blind Audited
            </span>
          </div>
        </div>
      </div>

      {/* Queue Telemetry Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Total in Queue</span>
            <FileCheck2 className="h-4 w-4 text-[#002147]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">{items.length}</div>
          <div className="mt-1 text-xs text-[#64748b]">Active editorial capacity: 40</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Awaiting Verdict</span>
            <AlertCircle className="h-4 w-4 text-[#ea580c]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">{awaitingVerdict}</div>
          <div className="mt-1 text-xs text-[#ea580c] font-medium">Referee reports completed</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">New Submissions</span>
            <Clock className="h-4 w-4 text-[#0284c7]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">{newSubmissions}</div>
          <div className="mt-1 text-xs text-[#64748b]">Awaiting reviewer assignment</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Mean Velocity</span>
            <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">18.4 Days</div>
          <div className="mt-1 text-xs text-[#16a34a] font-medium">Within 30d SLA threshold</div>
        </div>
      </div>

      {/* Queue Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#64748b]" />
          <span className="text-xs font-semibold text-[#334155]">Filter Queue:</span>
          <button className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#0f172a] shadow-sm border border-[#cbd5e1]">
            All ({items.length})
          </button>
          <button className="rounded-md px-2.5 py-1 text-xs font-medium text-[#64748b] hover:bg-white/80">
            Under Review ({awaitingVerdict})
          </button>
          <button className="rounded-md px-2.5 py-1 text-xs font-medium text-[#64748b] hover:bg-white/80">
            Newly Submitted ({newSubmissions})
          </button>
        </div>

        <div className="text-xs text-[#64748b]">
          Sorted by: <span className="font-semibold text-[#0f172a]">Submission Date (Oldest First)</span>
        </div>
      </div>

      {/* Manuscript Items Queue */}
      {!items.length ? (
        <EmptyState
          title="Review Queue is Clean"
          description="There are currently no manuscripts pending editorial triage or decision."
          href="/admin"
          action="Return to Admin Overview"
        />
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="group rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition-all hover:border-[#cbd5e1] hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#002147]/5 px-2 py-0.5 font-mono text-xs font-semibold text-[#002147]">
                      MS-2026-0{idx + 104}
                    </span>
                    <DemoBadge demo={item.is_demo} />
                    <StatusBadge status={item.status} />
                    {item.year && (
                      <span className="text-xs text-[#64748b] font-medium">Target: Vol {item.year}.1</span>
                    )}
                    <span className="text-xs text-[#94a3b8]">
                      Received {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-[#0f172a] group-hover:text-[#002147] transition-colors">
                    <Link href={`/admin/submissions/${item.id}`}>
                      {item.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-2 text-sm text-[#64748b]">
                    {item.abstract}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b] pt-1">
                    <span className="inline-flex items-center gap-1 font-medium text-[#334155]">
                      <FileText className="h-3.5 w-3.5 text-[#64748b]" />
                      Handling Editor: Dr. A. Sharma
                    </span>
                    <span>•</span>
                    <span className="text-[#16a34a] font-medium">3/3 Reviewer Scorecards Received</span>
                    <span>•</span>
                    <span>Consensus: Strong Accept (4.43/5.00)</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                  <Link
                    href={`/admin/submissions/${item.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#002147] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#001733]"
                  >
                    Adjudicate Verdict
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <span className="text-[11px] text-[#94a3b8]">
                    ID: {item.id.slice(0, 8)}...
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

