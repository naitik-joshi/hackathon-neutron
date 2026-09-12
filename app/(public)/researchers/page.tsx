import Link from "next/link";
import {
  Search,
  FileDown,
  UserPlus,
  Mail,
  Calendar,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listResearchers } from "@/features/research/queries";
import { SetupState } from "@/components/shared/empty-state";

export const metadata = {
  title: "Academic Faculty & Researcher Directory",
  description:
    "Discover Islington College faculty supervisors, student research fellows, cross-disciplinary investigators, and visiting scholars. Connect for co-authorship, supervision, and institutional project collaborations.",
};

export default async function ResearchersDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; role?: string | string[] }>;
}) {
  if (!isSupabaseConfigured()) return <SetupState />;

  const resolved = await searchParams;
  const rawQ = resolved.q;
  const query = typeof rawQ === "string" ? rawQ.slice(0, 100) : "";

  const researchers = await listResearchers(query);

  return (
    <div className="page-shell space-y-10">
      {/* 1. Header with Actions (Stitch reference) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-3xl">
          <h1 className="display-lg text-[#0F2042]">
            Academic Faculty & Researcher Directory
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            Discover Islington College faculty supervisors, student research fellows, cross-disciplinary investigators, and visiting scholars. Connect for co-authorship, supervision, and institutional project collaborations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button type="button" className="btn-academic-outline text-xs">
            <FileDown size={14} />
            <span>Export (CSV)</span>
          </button>
          <Link href="/account" className="btn-academic-outline text-xs">
            <span>Update Profile</span>
          </Link>
          <Link
            href="/researcher/publications/new"
            className="btn-academic-primary text-xs"
          >
            <UserPlus size={14} />
            <span>Register as Fellow</span>
          </Link>
        </div>
      </div>

      {/* 2. 5 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Active Roster
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            120+
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Active Academic Researchers
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Supervision
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            34
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Faculty Supervisors
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Fellows
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            68
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Student Research Fellows
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Synergy
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F766E]">
            28
          </div>
          <span className="text-[0.68rem] text-[#0F766E] block font-semibold">
            Matchings This Term
          </span>
        </div>

        <div className="rounded border border-[#DCE9FF] bg-[#EFF4FF] p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-[#0F2042] block">
            Vacancies
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            19
          </div>
          <span className="text-[0.68rem] text-[#0F2042] block font-semibold">
            Open Collaborations
          </span>
        </div>
      </div>

      {/* 3. Search & Tabs */}
      <div className="space-y-4">
        <form action="/researchers" method="GET" className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search researchers by name, domain, research interests, lab, or keywords (e.g. Dr. Aasha Sharma, Devanagari NLP, FinTech)..."
            className="w-full rounded border border-slate-300 bg-white pl-10 pr-12 py-2.5 text-sm text-slate-900 focus:border-[#0F2042] focus:outline-none"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-100 px-1.5 py-0.5 text-[0.65rem] font-mono text-slate-500">
            ⌘K
          </kbd>
        </form>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { label: "All Researchers", count: 120, active: true },
            { label: "Faculty Supervisors", count: 34, active: false },
            { label: "Student Fellows", count: 68, active: false },
            { label: "Principal Investigators", count: 18, active: false },
            { label: "Open for Mentorship", count: 22, active: false },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                tab.active
                  ? "bg-[#0F2042] text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[0.65rem] px-1 rounded-full ${
                  tab.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[0.68rem] text-slate-400 uppercase">
              Filter Disciplines:
            </span>
            <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
              <option>Dept. of Computing & AI</option>
              <option>Business & Finance</option>
              <option>Engineering & Robotics</option>
            </select>
            <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
              <option>Domain: All Research Areas</option>
              <option>Natural Language Processing</option>
              <option>Computer Vision</option>
              <option>FinTech & Blockchain</option>
            </select>
            <label className="flex items-center gap-1.5 cursor-pointer ml-2">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0F2042]" />
              <span>Accepting Students</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-[#0F2042]" />
              <span>Funded Labs Only</span>
            </label>
          </div>

          <Link href="/researchers" className="text-[#9E1B32] hover:underline font-semibold">
            Reset Filters
          </Link>
        </div>
      </div>

      {/* 4. Researchers Grid (Stitch reference image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchers.map((res) => {
          const cleanName = res.name.replace(/^DEMO DATA — /, "");
          const cleanPos = res.position.replace(/^DEMO DATA — /, "");

          return (
            <div
              key={res.id}
              className="academic-card p-6 flex flex-col justify-between space-y-4 hover:border-[#0F2042]"
            >
              <div className="space-y-3.5">
                {/* Top Role Badge */}
                <div className="flex items-center justify-between">
                  <span className="pill-badge pill-review">
                    PI • Editorial
                  </span>
                  <span className="font-mono text-[0.65rem] text-slate-400">
                    ID-{res.id.slice(0, 4)}
                  </span>
                </div>

                {/* Profile Header */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F2042] text-sm font-bold text-white uppercase shrink-0">
                    {cleanName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0F2042] leading-snug">
                      <Link
                        href={`/researchers/${res.slug}`}
                        className="hover:text-[#9E1B32] transition-colors"
                      >
                        {cleanName}
                      </Link>
                    </h3>
                    <div className="text-xs text-slate-600 font-medium">
                      {cleanPos}
                    </div>
                  </div>
                </div>

                {/* Lab & Affiliation */}
                <div className="text-[0.72rem] text-slate-500 line-clamp-1">
                  Centre for Applied AI & Data Innovation (CADI) • Dept. of Computing
                </div>

                {/* Status Chips */}
                <div className="flex flex-wrap gap-1">
                  <span className="rounded bg-[#E5EEFF] px-2 py-0.5 text-[0.65rem] font-semibold text-[#0F2042]">
                    IJMR Editorial Member
                  </span>
                  <span className="rounded bg-[#ECFDF5] px-2 py-0.5 text-[0.65rem] font-semibold text-[#065F46]">
                    Open for Mentorship
                  </span>
                </div>

                {/* 4-Metric Grid */}
                <div className="grid grid-cols-4 gap-1 text-center py-2 border-y border-slate-100 font-mono text-[0.68rem]">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">18</div>
                    <div className="text-slate-400 text-[0.6rem] uppercase">Papers</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">342</div>
                    <div className="text-slate-400 text-[0.6rem] uppercase">Citations</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">12</div>
                    <div className="text-slate-400 text-[0.6rem] uppercase">H-Index</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#9E1B32] text-sm">4</div>
                    <div className="text-slate-400 text-[0.6rem] uppercase">Grants</div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1 text-[0.65rem] font-mono text-slate-600">
                  {["#DevanagariNLP", "#LowResourceLLMs", "#EthicalAI"].map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Current Active Project Banner */}
                <div className="rounded border border-slate-200 bg-[#FAFBFD] p-2.5 text-xs space-y-0.5">
                  <span className="font-mono text-[0.62rem] font-bold text-slate-400 uppercase block">
                    Current Active Project
                  </span>
                  <div className="font-serif font-bold text-xs text-[#0F2042] truncate">
                    NepalNLP: Open-Source Benchmark Suite
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/researchers/${res.slug}`}
                  className="btn-academic-primary text-xs py-1 px-3 flex-1 text-center"
                >
                  View Full Profile
                </Link>
                <button
                  type="button"
                  className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title="Contact"
                >
                  <Mail size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Undergrad & Postgrad Matchmaking Banner (Stitch reference image) */}
      <div className="rounded-xl bg-[#0F2042] text-white p-8 md:p-10 space-y-6 shadow-md relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="rounded bg-[#9E1B32] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
            Undergraduate & Postgraduate Matchmaking
          </span>
          <h2 className="headline-lg text-white">
            Looking for a Research Supervisor for Your Final Year Project or IJMR Thesis?
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Islington College provides structured mentorship bridges connecting students directly with experienced faculty leads across AI, FinTech, and Renewable Energy domains.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              Step 01
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Explore Faculty Domains
            </div>
            <p className="text-xs text-slate-300">
              Review current publications, active grant priorities, and research tags in this directory to align your interests.
            </p>
          </div>

          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              Step 02
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Submit 300-Word Brief
            </div>
            <p className="text-xs text-slate-300">
              Draft an abstract covering your problem statement, suggested methodology, and expected contribution to Nepal&apos;s ecosystem.
            </p>
          </div>

          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              Step 03
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Book Office Hours
            </div>
            <p className="text-xs text-slate-300">
              Schedule direct 25-minute consultation slots with verified faculty through the automated IJMR Calendar integration.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
          <Link
            href="/researcher/publications/new"
            className="btn-academic-accent text-xs"
          >
            Submit Matchmaking Request
          </Link>
          <button
            type="button"
            className="btn-academic-outline text-xs bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white"
          >
            <Calendar size={14} />
            <span>Browse Open Office Hours</span>
          </button>
        </div>
      </div>
    </div>
  );
}
