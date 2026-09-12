import Link from "next/link";
import {
  FileCheck2,
  Users2,
  Clock,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guards";

export const metadata = {
  title: "Research Operations & Editorial Board | IJMR Admin",
};

export default async function Admin() {
  await requireRole(["admin"]);

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
              Oversee the peer review pipeline, adjudicate reviewer evaluations, and maintain COPE publishing standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/submissions"
              className="inline-flex items-center gap-2 rounded-lg bg-[#002147] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#001733]"
            >
              <FileCheck2 className="h-4 w-4" />
              Open Review Queue
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Queue In Triage</span>
            <FileCheck2 className="h-4 w-4 text-[#002147]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">14 Manuscripts</div>
          <div className="mt-1 text-xs text-[#16a34a] font-medium">4 ready for final verdict</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Editorial Velocity</span>
            <Clock className="h-4 w-4 text-[#0284c7]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">18.4 Days</div>
          <div className="mt-1 text-xs text-[#64748b]">COPE Target: &lt; 30 days</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Reviewer Roster</span>
            <Users2 className="h-4 w-4 text-[#475569]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">48 Active</div>
          <div className="mt-1 text-xs text-[#64748b]">98.2% on-time completion</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-xs font-medium uppercase tracking-wider">Vol 6.2 Output</span>
            <TrendingUp className="h-4 w-4 text-[#16a34a]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0f172a]">28 Published</div>
          <div className="mt-1 text-xs text-[#64748b]">100% CrossRef DOI verified</div>
        </div>
      </div>

      {/* Featured Primary Action: Publication Review & Editorial Verdicts */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-xs font-semibold text-[#166534]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              Active Editorial Queue
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0f172a]">
              Peer Review Synthesis & Publication Adjudication
            </h2>
            <p className="max-w-2xl text-sm text-[#64748b]">
              Access submitted manuscripts, review blind referee scorecards, review author rebuttals, and deliver binding institutional editorial decisions (Accept, Revisions, or Reject).
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#002147] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001733] whitespace-nowrap"
          >
            Review Pending Submissions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Academic Operations Modules Grid */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#0f172a] mb-4">
          Scholarly Operations & Governance
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:border-[#cbd5e1]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-xs font-semibold text-[#1e40af]">
                Editorial Desk
              </span>
              <ShieldCheck className="h-4 w-4 text-[#64748b]" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#0f172a]">Author Proofing & Camera-Ready</h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Verify high-resolution vector figures, citation cross-references, LaTeX compilation, and CC-BY 4.0 rights.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#002147]">
              <span>6 pending galleys</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:border-[#cbd5e1]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 text-xs font-semibold text-[#475569]">
                Quality Assurance
              </span>
              <Award className="h-4 w-4 text-[#64748b]" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#0f172a]">Double-Blind Referee Scorecards</h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Inspect 5-dimension scoring matrices (novelty, rigor, clarity, impact, data availability) across referee panels.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#002147]">
              <span>Scorecard Matrix</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:border-[#cbd5e1]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 text-xs font-semibold text-[#475569]">
                DOI Registry
              </span>
              <BookOpen className="h-4 w-4 text-[#64748b]" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#0f172a]">CrossRef & Metadata Minting</h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Batch deposit XML schema 5.3.1 deposits with CrossRef, OpenAlex, and Islington Institutional Repository.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#002147]">
              <span>Prefix 10.5555/ijmr</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

