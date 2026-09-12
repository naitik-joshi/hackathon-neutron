import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Bell,
  FileDown,
  Bookmark,
  Quote,
  FileText,
  ArrowRight,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listPublications } from "@/features/research/queries";
import { SetupState } from "@/components/shared/empty-state";

export const metadata = {
  title: "Research Papers & Publications",
  description:
    "Search through 480+ peer-reviewed articles, conference proceedings, and working preprints from Islington College faculty, international fellows, and student researchers.",
};

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; discipline?: string | string[] }>;
}) {
  if (!isSupabaseConfigured()) return <SetupState />;

  const resolved = await searchParams;
  const rawQ = resolved.q;
  const query = typeof rawQ === "string" ? rawQ.slice(0, 100) : "";

  const publications = await listPublications(query);

  return (
    <div className="page-shell space-y-10">
      {/* 1. Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-3xl">
          <h1 className="display-lg text-[#0F2042]">
            Research Papers & Publications
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            Search through 480+ peer-reviewed articles, conference proceedings, and working preprints from Islington College faculty, international fellows, and student researchers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            className="btn-academic-outline text-xs"
          >
            <Bell size={14} />
            <span>Create Research Alert</span>
          </button>
          <button
            type="button"
            className="btn-academic-primary text-xs"
          >
            <FileDown size={14} />
            <span>Export Corpus Index</span>
          </button>
        </div>
      </div>

      {/* 2. Unified Search Bar with Active Filters */}
      <div className="space-y-3">
        <form action="/publications" method="GET" className="flex flex-col md:flex-row gap-2">
          <select
            name="scope"
            className="rounded border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-[#0F2042] focus:outline-none md:w-56"
          >
            <option value="all">All Fields & Abstracts</option>
            <option value="title">Title Only</option>
            <option value="author">Author Only</option>
            <option value="doi">DOI Reference</option>
          </select>

          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by keyword, author, or research domain..."
              className="w-full rounded border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-[#0F2042] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="btn-academic-primary px-6 text-xs font-bold uppercase tracking-wider"
          >
            Search →
          </button>
        </form>

        {/* Active Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.68rem] text-slate-400 uppercase">
              Active Filters:
            </span>
            {query && (
              <span className="rounded bg-[#0F2042] text-white px-2 py-0.5 font-mono text-[0.68rem] flex items-center gap-1">
                <span>Query: &quot;{query}&quot;</span>
                <Link href="/publications" className="hover:text-red-300">×</Link>
              </span>
            )}
            <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 font-mono text-[0.68rem]">
              Field: Computing & AI
            </span>
            <Link
              href="/publications"
              className="text-[#9E1B32] font-semibold hover:underline text-[0.72rem] ml-1"
            >
              Reset all filters
            </Link>
          </div>

          <div className="flex items-center gap-3 font-mono text-slate-500 text-[0.72rem]">
            <span>Sort by:</span>
            <select className="bg-transparent border-0 font-semibold text-slate-800 p-0 focus:ring-0">
              <option>Most Relevant</option>
              <option>Latest Published</option>
              <option>Most Cited</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main 2-Column Split: Left Facets (3.5 cols) + Right Results (8.5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Facets Filter Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="academic-card p-5 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-serif font-bold text-sm text-[#0F2042] flex items-center gap-1.5">
                <SlidersHorizontal size={14} />
                <span>Filter Research</span>
              </span>
              <span className="font-mono text-[0.68rem] text-slate-400">
                {publications.length || 178} Matches
              </span>
            </div>

            {/* Subject Disciplines */}
            <div className="space-y-2">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block">
                Subject Disciplines
              </span>
              <div className="space-y-1.5 text-slate-700">
                {[
                  { label: "Computing & AI", count: 142, checked: true },
                  { label: "Data Science & Analytics", count: 86, checked: false },
                  { label: "Cybersecurity & Cryptography", count: 54, checked: false },
                  { label: "Business & FinTech", count: 72, checked: false },
                  { label: "Software Engineering & IoT", count: 65, checked: false },
                ].map((d) => (
                  <label key={d.label} className="flex items-center justify-between hover:text-[#0F2042] cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={d.checked}
                        className="rounded border-slate-300 text-[#0F2042] focus:ring-[#0F2042]"
                      />
                      <span>{d.label}</span>
                    </span>
                    <span className="font-mono text-[0.68rem] text-slate-400">{d.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Publication Type */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block">
                Publication Type
              </span>
              <div className="space-y-1.5 text-slate-700">
                {[
                  { label: "Peer-Reviewed Journal Article", count: 318, checked: true },
                  { label: "Conference Proceedings", count: 98, checked: false },
                  { label: "Student Dissertation Pre-print", count: 52, checked: false },
                  { label: "Technical Working Paper", count: 20, checked: false },
                ].map((t) => (
                  <label key={t.label} className="flex items-center justify-between hover:text-[#0F2042] cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={t.checked}
                        className="rounded border-slate-300 text-[#0F2042] focus:ring-[#0F2042]"
                      />
                      <span>{t.label}</span>
                    </span>
                    <span className="font-mono text-[0.68rem] text-slate-400">{t.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Publication Year Distribution */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                  Publication Year
                </span>
                <span className="font-mono text-[0.68rem] text-slate-400">2021 – 2025</span>
              </div>

              {/* Bar Graph Visualizer */}
              <div className="flex items-end gap-1 h-8 pt-2">
                <div className="bg-slate-200 w-full h-[40%] rounded-t" />
                <div className="bg-slate-200 w-full h-[60%] rounded-t" />
                <div className="bg-slate-300 w-full h-[75%] rounded-t" />
                <div className="bg-[#0F2042] w-full h-[95%] rounded-t" />
                <div className="bg-[#9E1B32] w-full h-[100%] rounded-t" />
              </div>

              <div className="grid grid-cols-2 gap-1 pt-2 text-[0.72rem]">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0F2042]" />
                  <span>2025 (Current)</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0F2042]" />
                  <span>2024</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" className="rounded border-slate-300 text-[#0F2042]" />
                  <span>2023</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" className="rounded border-slate-300 text-[#0F2042]" />
                  <span>2022 & Earlier</span>
                </label>
              </div>
            </div>

            {/* Review Status */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block">
                Review Status
              </span>
              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>• Published in Issue</span>
                  <span className="font-mono text-slate-400">410</span>
                </div>
                <div className="flex justify-between">
                  <span>• Accepted / Under Proof</span>
                  <span className="font-mono text-slate-400">18</span>
                </div>
                <div className="flex justify-between">
                  <span>• Open Peer Review</span>
                  <span className="font-mono text-slate-400">14</span>
                </div>
              </div>
            </div>

            {/* Open Science Badges */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block">
                Open Science Badges
              </span>
              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Gold Open Access</span>
                  <span className="font-mono text-[#0F766E] font-semibold">ALL</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Dataset Included</span>
                  <span className="font-mono text-slate-400">88</span>
                </div>
                <div className="flex justify-between">
                  <span>Source Code Repo</span>
                  <span className="font-mono text-slate-400">54</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submitting to IJMR Callout Card */}
          <div className="rounded border border-[#9E1B32]/30 bg-[#FFF5F5] p-5 space-y-2 text-xs">
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#9E1B32] block">
              Submitting to IJMR?
            </span>
            <p className="text-slate-700 leading-relaxed">
              Review the latest author guidelines and double-blind peer review policies for Volume 6, Issue 2.
            </p>
            <Link
              href="/researcher/publications/new"
              className="text-[#9E1B32] font-semibold hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Read Author Guidelines</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </aside>

        {/* Right Search Results Column */}
        <main className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3 text-xs">
            <span className="font-serif font-bold text-slate-800">
              Showing 1–{publications.length || 4} of {publications.length || 178} Articles
            </span>

            <div className="flex items-center gap-4 text-slate-500 font-mono text-[0.7rem]">
              <button type="button" className="hover:text-[#0F2042] flex items-center gap-1">
                <FileDown size={12} />
                <span>Export Citations (.RIS)</span>
              </button>
              <span>•</span>
              <span className="text-[#0F766E] font-semibold">Indexed in DOAJ</span>
            </div>
          </div>

          {/* Publication Cards List */}
          <div className="space-y-6">
            {publications.map((item) => (
              <article
                key={item.id}
                className="academic-card p-6 md:p-7 space-y-4 hover:border-[#0F2042]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="pill-badge pill-published">Peer-Reviewed Article</span>
                    <span className="font-mono text-[0.68rem] text-slate-500">
                      IJMR Vol 6, Issue 1 (June 2025) • DOI: 10.5281/ijmr.2025.{item.id.slice(0, 4)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button type="button" className="p-1 hover:text-[#0F2042]" title="Bookmark">
                      <Bookmark size={15} />
                    </button>
                    <button type="button" className="p-1 hover:text-[#0F2042]" title="Cite">
                      <Quote size={15} />
                    </button>
                  </div>
                </div>

                <h2 className="headline-sm text-[#0F2042]">
                  <Link
                    href={`/publications/${item.slug}`}
                    className="hover:text-[#9E1B32] transition-colors"
                  >
                    {item.title}
                  </Link>
                </h2>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2042] text-[0.6rem] font-bold text-white uppercase">
                    D
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-900">
                      Dr. Bikash Thapa, Dr. Aasha Sharma, Priya Adhikari, MSc
                    </strong>
                    <span className="text-slate-500 text-[0.72rem] ml-1">
                      • Department of Computing & AI
                    </span>
                  </div>
                </div>

                <p className="body-editorial text-xs md:text-sm text-slate-700 line-clamp-3 leading-relaxed">
                  {item.abstract}
                </p>

                {/* Topic Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {["Computer Vision", "Edge Computing", "Low-Resource AI", "Code on GitHub", "Dataset (6.4K Fundus)"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[0.68rem] font-mono text-slate-600 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metrics & Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4 font-mono text-[0.7rem] text-slate-500">
                    <span><strong>14</strong> Citations</span>
                    <span>•</span>
                    <span><strong>482</strong> Views</span>
                    <span>•</span>
                    <span><strong>189</strong> Downloads</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/publications/${item.slug}`}
                      className="btn-academic-outline text-xs py-1 px-3"
                    >
                      Read Full Paper
                    </Link>
                    <a
                      href={`https://doi.org/${encodeURIComponent(item.doi || "10.5281/ijmr.2025.109")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-academic-primary text-xs py-1 px-3"
                    >
                      <FileText size={13} />
                      <span>PDF (2.4 MB)</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Research Notification Alert Box */}
          <div className="rounded border border-slate-200 bg-[#FAFBFD] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="font-serif font-bold text-sm text-[#0F2042] flex items-center gap-1.5">
                <Bell size={15} className="text-[#9E1B32]" />
                <span>Research Notification Alert</span>
              </span>
              <p className="text-xs text-slate-600">
                Get notified as soon as newly reviewed articles under <strong>Computing, Machine Learning, and Applied AI</strong> are cataloged or added to the preprint pipeline.
              </p>
            </div>

            <form className="flex gap-2 shrink-0 w-full sm:w-auto">
              <input
                type="email"
                placeholder="faculty@islingtoncollege.edu.np"
                className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0F2042] focus:outline-none"
              />
              <button
                type="button"
                className="btn-academic-accent text-xs py-1.5 px-3"
              >
                Follow Topic
              </button>
            </form>
          </div>

          {/* Pagination */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>Page 1 of 18 (1–4 of 178 filtered items)</div>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded bg-white font-bold text-slate-800">1</button>
              <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50">2</button>
              <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50">3</button>
              <span>...</span>
              <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50">15</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
