import Link from "next/link";
import {
  FileCheck2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import { AttentionList } from "@/components/admin/attention-list";
import { getAdminOverview } from "@/features/operations/queries";
import { getAdminDashboardData } from "@/features/submissions/admin-queries";
import { StatusBadge, DemoBadge } from "@/components/shared/status-badge";

export const metadata = {
  title: "Research Operations & Editorial Board | IJMR Admin",
};

export default async function Admin() {
  const [
    { metrics, recentSubmissions, recentInterests },
    { attention },
  ] = await Promise.all([getAdminDashboardData(), getAdminOverview()]);

  const pendingAttentionCount =
    metrics.submitted + metrics.underReview + metrics.changesRequested;

  return (
    <div className="space-y-10 pb-16">
      {/* Top Operations Header */}
      <div className="border-b border-[#e2e8f0] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              <span>Islington Research Operations</span>
              <span>•</span>
              <span>Editorial Secretariat</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#0f172a]">
              Academic Editorial & Triage Desk
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              Oversee the peer review pipeline, adjudicate reviewer evaluations, and manage student research participation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/submissions"
              className="inline-flex items-center gap-2 rounded-lg bg-[#002147] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#001733]"
            >
              <FileCheck2 className="h-4 w-4" />
              Open Review Queue ({pendingAttentionCount})
            </Link>
            <Link
              href="/admin/interests"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Inbox className="h-4 w-4 text-blue-700" />
              Interest Inbox ({metrics.totalInterestCount})
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Real-Time Academic Operations KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Awaiting Triage</span>
            <Clock className="h-4 w-4 text-[#ea580c]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {metrics.submitted}
          </div>
          <div className="mt-1 text-xs text-[#ea580c] font-medium">
            New submissions
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Under Peer Review</span>
            <FileCheck2 className="h-4 w-4 text-[#0284c7]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {metrics.underReview}
          </div>
          <div className="mt-1 text-xs text-[#0284c7] font-medium">
            Active evaluation
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Revisions Requested</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {metrics.changesRequested}
          </div>
          <div className="mt-1 text-xs text-amber-700 font-medium">
            With authors
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Repository Published</span>
            <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {metrics.published}
          </div>
          <div className="mt-1 text-xs text-[#16a34a] font-medium">
            Publicly readable
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Student Interests</span>
            <Inbox className="h-4 w-4 text-[#002147]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">
            {metrics.totalInterestCount}
          </div>
          <div className="mt-1 text-xs text-slate-600 font-medium">
            Project applications
          </div>
        </div>
      </div>

      {/* Featured Primary Action: Publication Review & Editorial Verdicts */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-xs font-semibold text-[#166534]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              Active Editorial Adjudication
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0f172a]">
              Peer Review Synthesis & Institutional Publishing
            </h2>
            <p className="max-w-2xl text-sm text-[#64748b]">
              Evaluate submitted manuscripts, review private peer review feedback history, formulate binding editorial decisions (Start Review, Request Changes, Reject, or Publish to the open repository).
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#002147] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001733] whitespace-nowrap"
          >
            Review Submissions Queue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <AttentionList items={attention} />

      {/* Active Submissions Needing Editorial Attention */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0f172a]">
              Submissions Requiring Editorial Action
            </h2>
            <p className="text-xs text-[#64748b]">
              Latest manuscripts submitted for triage or under active peer review
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
          >
            View all ({recentSubmissions.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentSubmissions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-slate-50/70 rounded-lg px-2 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={sub.status} />
                    <DemoBadge demo={sub.is_demo} />
                    <span className="font-mono text-xs text-slate-500">
                      MS-{sub.id.slice(0, 8)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base hover:text-blue-700 transition-colors">
                    <Link href={`/admin/submissions/${sub.id}`}>
                      {sub.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submitted on{" "}
                    {new Date(sub.created_at).toLocaleDateString("en-GB", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <Link
                    href={`/admin/submissions/${sub.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span>Adjudicate Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">
            No active submissions in the review queue.
          </p>
        )}
      </div>

      {/* Student Project Expressions of Interest Feed */}
      {recentInterests.length > 0 && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0f172a]">
                Student Project Expressions of Interest
              </h2>
              <p className="text-xs text-[#64748b]">
                Inquiries from students applying to participate in active research initiatives
              </p>
            </div>
            <Link
              href="/admin/interests"
              className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              Open Inbox ({metrics.totalInterestCount}) <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentInterests.map((interest) => (
              <div
                key={interest.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">
                      {interest.contact_email}
                    </span>
                    <DemoBadge demo={interest.is_demo} />
                    <span className="font-mono text-slate-400">
                      PRJ-{interest.project_id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 italic">
                    &quot;{interest.message}&quot;
                  </p>
                </div>
                <span className="font-mono text-slate-400 whitespace-nowrap">
                  {new Date(interest.created_at).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Operations & Standards Grid */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#0f172a] mb-4">
          Scholarly Governance & Standards
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-xs font-semibold text-[#1e40af]">
                Editorial Desk
              </span>
              <ShieldCheck className="h-4 w-4 text-[#64748b]" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#0f172a]">
              COPE Single-Blind Triage
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Verify manuscript scopes, initial formatting, ethical clearance, and plagiarism checks before assigning peer review.
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 text-xs font-semibold text-[#475569]">
                Reviewer Governance
              </span>
              <Award className="h-4 w-4 text-[#64748b]" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#0f172a]">
              Private Review Feedback
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Review notes and recommendations remain strictly confidential between editorial staff and submitting researchers.
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 text-xs font-semibold text-[#475569]">
                Open Access
              </span>
              <BookOpen className="h-4 w-4 text-[#64748b]" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#0f172a]">
              Institutional Repository
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Approved publications automatically deploy with public read access under CC-BY 4.0 open knowledge standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
