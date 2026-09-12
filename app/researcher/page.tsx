import Link from "next/link";
import {
  FilePlus2,
  FolderGit2,
  Calendar,
  FileDown,
  Clock,
  Users,
  ExternalLink,
  MessageSquare,
  Activity,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guards";

export default async function ResearcherDashboard() {
  const { profile, client } = await requireRole(["researcher"]);
  const { count } = await client
    .from("publications")
    .select("id", { count: "exact", head: true })
    .eq("submitted_by", profile.id);

  const researcherName = profile.display_name || "Dr. Sharma";

  return (
    <div className="page-shell space-y-8">
      {/* 1. Header & Identity Ribbon (Stitch s5.png & s17.png) */}
      <div className="academic-card p-6 md:p-8 space-y-6 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#0F2042] text-xl font-bold font-serif text-white uppercase shrink-0">
              {researcherName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill-badge pill-collab text-[0.62rem]">
                  Faculty & PI Workspace
                </span>
                <span className="font-mono text-xs text-slate-500">
                  Fall Term 2025 • Grant # CADI-PRJ-2024-002
                </span>
              </div>
              <h1 className="headline-lg text-[#0F2042] mt-1">
                Welcome back, {researcherName}
              </h1>
              <p className="text-xs text-slate-500">
                Dept. of Computing & AI • Centre for Applied AI & Data Innovation (CADI) • Islington Academic Senate Member
              </p>
            </div>
          </div>

          {/* Persona Switcher */}
          <div className="flex items-center gap-2 rounded bg-slate-100 p-1 text-xs font-semibold self-start lg:self-center">
            <button
              type="button"
              className="rounded bg-[#0F2042] px-3 py-1.5 text-white shadow-xs"
            >
              Faculty & PI (Active)
            </button>
            <button
              type="button"
              className="rounded px-3 py-1.5 text-slate-600 hover:text-slate-900"
            >
              Student Fellow (Preview)
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/researcher/publications/new"
              className="btn-academic-primary text-xs py-2 px-4 shadow-sm"
            >
              <FilePlus2 size={15} />
              <span>New Manuscript Submission</span>
            </Link>
            <button type="button" className="btn-academic-outline text-xs py-2 px-3">
              <FolderGit2 size={15} />
              <span>Propose Project / Grant</span>
            </button>
            <button type="button" className="btn-academic-outline text-xs py-2 px-3">
              <Calendar size={15} />
              <span>Book Faculty Hours</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-academic-ghost text-xs text-slate-600 hover:text-[#0F2042]"
          >
            <FileDown size={14} />
            <span>Export Academic Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="academic-card p-5 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Active Research Grants
          </span>
          <div className="text-2xl font-bold font-serif text-[#0F2042]">
            NPR 1,850,000
          </div>
          <div className="text-[0.68rem] text-slate-500 flex items-center gap-1.5 pt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>2 Active Grants • Milestone in 14d</span>
          </div>
        </div>

        <div className="academic-card p-5 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Supervised Fellows
          </span>
          <div className="text-2xl font-bold font-serif text-[#0F2042]">
            6 / 6 Active
          </div>
          <div className="text-[0.68rem] text-slate-500 pt-1">
            4 Grad • 2 Undergrad • 2 Pending Defenses
          </div>
        </div>

        <div className="academic-card p-5 space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500">
              Journal Pipeline
            </span>
            <span className="rounded bg-emerald-100 text-[#065F46] px-1.5 py-0.2 text-[0.6rem] font-bold">
              New Today
            </span>
          </div>
          <div className="text-2xl font-bold font-serif text-[#0F2042]">
            {count ? `${count} Manuscripts` : "4 Manuscripts"}
          </div>
          <div className="text-[0.68rem] text-slate-500 pt-1">
            1 in Triage (Vol 6.2) • 1 Revision • 2 In Review
          </div>
        </div>

        <div className="academic-card p-5 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            A100 Compute Allocation
          </span>
          <div className="text-2xl font-bold font-serif text-[#0F766E]">
            640h / 1,200 hrs
          </div>
          <div className="text-[0.68rem] text-slate-500 flex justify-between pt-1">
            <span>Islington AI Cluster SXM4</span>
            <span className="font-mono">Slurm 23.02</span>
          </div>
        </div>
      </div>

      {/* 3. Main 8:4 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Research Projects & Sprints (Stitch s5.png) */}
          <div className="academic-card p-6 md:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0F2042]" />
                <h2 className="headline-sm text-[#0F2042]">
                  Active Research Projects & Sprints
                </h2>
              </div>
              <Link href="/projects" className="text-xs font-semibold text-[#0F2042] hover:underline">
                View All 5 Projects →
              </Link>
            </div>

            {/* Project 1 */}
            <div className="rounded border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-mono text-[0.68rem] text-slate-500">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-700">
                    CADI-PRJ-2024-002
                  </span>
                  <span>•</span>
                  <span>Stage 4 of 7: Benchmarking</span>
                  <span>•</span>
                  <span>Syllable-BPE Model</span>
                </div>
                <div className="font-mono font-bold text-[#0F2042]">
                  78% Sprint Progress
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F2042] h-full rounded-full w-[78%]" />
              </div>

              <h3 className="font-serif font-bold text-base text-[#0F2042]">
                <Link href="/projects/nepal-nlp" className="hover:underline">
                  NepalNLP: Open-Source Benchmark Suite & Morphological Tokenizers
                </Link>
              </h3>

              <div className="rounded bg-[#FAFBFD] p-3 text-xs text-slate-700 space-y-1">
                <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-400 block">
                  Current Sprint Goal (Ending Nov 04)
                </span>
                <p className="leading-relaxed">
                  Evaluating <strong>DevaMix-BERT</strong> on 18,500 conversational Nepali sentences; compiling Out-of-Vocabulary (OOV) distribution curves for review rebuttal.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Assigned Fellows:</span>
                  <div className="flex -space-x-1.5 font-bold text-[0.62rem]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F2042] text-white">NP</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white">MP</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700">+2</span>
                  </div>
                  <span className="text-slate-700">Niraj Pokhrel (Grad Lead) + 2</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn-academic-outline text-[0.68rem] py-1 px-2">Lab Repo</button>
                  <button className="btn-academic-outline text-[0.68rem] py-1 px-2">Milestone 3 Data</button>
                  <span className="rounded bg-[#000922] text-[#89F5E7] px-2 py-1 text-[0.68rem] font-bold">
                    Slurm #84910
                  </span>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="rounded border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-mono text-[0.68rem] text-slate-500">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-700">
                    MOHP / ISLINGTON COLLAB
                  </span>
                  <span>•</span>
                  <span>Stage 2 of 5: Anonymization</span>
                  <span>•</span>
                  <span>Health Informatics</span>
                </div>
                <div className="font-mono font-bold text-slate-600">
                  40% Sprint Progress
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F766E] h-full rounded-full w-[40%]" />
              </div>

              <h3 className="font-serif font-bold text-base text-[#0F2042]">
                Multilingual Clinical Notes Extraction for Rural Health Posts in Karnali
              </h3>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Fellow in charge:</span>
                  <strong className="text-slate-800">Bibek Bhattarai (Postgrad Intern)</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>Ethics Approval #IRB-24-03</span>
                  <button className="btn-academic-outline text-[0.68rem] py-1 px-2">Update Corpus</button>
                </div>
              </div>
            </div>
          </div>

          {/* Journal Publication & Review Pipeline (Stitch s5.png & s17.png) */}
          <div className="academic-card p-6 md:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#9E1B32]" />
                <h2 className="headline-sm text-[#0F2042]">
                  Journal Publication & Review Pipeline
                </h2>
              </div>
              <Link href="/researcher/publications" className="text-xs font-semibold text-[#0F2042] hover:underline flex items-center gap-1">
                <span>Manuscript Central</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            {/* Pipeline Item 1: In Triage */}
            <div className="rounded border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="pill-badge pill-collab text-[0.62rem]">
                  Stage 2: Desk Triage & Plagiarism Clearance
                </span>
                <div className="flex items-center gap-2 font-mono text-[0.68rem]">
                  <Link href="/researcher/publications" className="text-[#0F2042] hover:underline font-semibold">
                    Track Submission Receipt
                  </Link>
                  <span>•</span>
                  <Link href="/researcher/publications" className="text-slate-500 hover:underline">
                    View Dossier & Preferences
                  </Link>
                </div>
              </div>

              <div className="text-[0.68rem] font-mono text-slate-400">
                IJMR-2025-SUB-0841 • Vol 6, Issue 2 (Fall 2025)
              </div>

              <h3 className="font-serif font-bold text-base text-[#0F2042]">
                DevaTokenizer: Subword Byte-Pair Segmentation Optimized for Conjunct Consonants in Contemporary Nepali Text
              </h3>

              <p className="text-xs text-slate-600">
                Dr. Aasha Sharma (Lead & Corresponding), Niraj Pokhrel (Co-First), Prof. Kieran Thorne
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded bg-slate-50 p-3 text-[0.72rem] font-mono">
                <div>
                  <span className="text-slate-500 block text-[0.65rem]">Crossref SimCheck</span>
                  <strong className="text-[#0F766E]">0% Unquoted Overlap [PASSED]</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[0.65rem]">Assigned Section Editor</span>
                  <strong className="text-slate-800">Dr. Bikash Thapa</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[0.65rem]">SLA Target Verdict</span>
                  <strong className="text-[#9E1B32]">Oct 28 (4 days left)</strong>
                </div>
              </div>
            </div>

            {/* Pipeline Item 2: Revision Requested */}
            <div className="rounded border border-[#FFDAD6] bg-[#FFF5F5] p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="pill-badge pill-review text-[0.62rem]">
                  Minor Revision Requested (Due Nov 12, 2025)
                </span>
                <span className="font-mono text-[0.68rem] text-slate-500">
                  IJMR-2025-MS-0419
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[0.68rem] font-mono text-slate-500">Vol 6, Issue 2 Target</div>
                  <h3 className="font-serif font-bold text-base text-[#0F2042]">
                    DevaTokenizer: Subword Byte-Pair Segmentation Optimized for Conjunct Consonants
                  </h3>
                </div>
                <button type="button" className="btn-academic-accent text-xs py-1.5 px-3 shrink-0 shadow-xs">
                  Submit Rebuttal
                </button>
              </div>

              {/* Reviewer Commentary Quote */}
              <div className="rounded bg-white p-3 border border-[#FFDAD6] text-xs space-y-1">
                <div className="flex justify-between font-mono text-[0.68rem]">
                  <strong className="text-[#9E1B32]">REVIEWER #2 ACTIONABLE FEEDBACK:</strong>
                  <span className="text-slate-400">Decision Date: Oct 18, 2025</span>
                </div>
                <p className="italic text-slate-700 leading-relaxed font-serif text-[0.8rem]">
                  &quot;Requested comparative Out-of-Vocabulary (OOV) ablation against pre-trained XLM-RoBERTa base using the new Madan Puraskar literary corpus. Clarify subword boundary merges for Halanta conjuncts.&quot;
                </p>
                <div className="flex items-center gap-4 pt-1 font-mono text-[0.68rem] text-slate-500">
                  <a href="#" className="text-[#0F2042] font-semibold hover:underline">
                    View 3 Reviewer Commentaries
                  </a>
                  <span>•</span>
                  <a href="#" className="text-slate-600 hover:underline">
                    Download Tracked Changes (.docx)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Research Fellows & Thesis Supervision (Stitch s5.png) */}
          <div className="academic-card p-6 md:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="headline-sm text-[#0F2042]">
                  Research Fellows & Thesis Supervision
                </h3>
                <p className="text-xs text-slate-500">
                  Progress oversight, dissertation drafts, and defense milestones
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="btn-academic-outline text-xs py-1 px-2.5">
                  Open Mentorship Log
                </button>
                <button type="button" className="btn-academic-primary text-xs py-1 px-2.5">
                  + Schedule 1-on-1
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  initials: "NP",
                  name: "Niraj Pokhrel",
                  program: "M.Sc. Computing",
                  thesis: "DevaMix-BERT Subword Tokenizer Evaluation",
                  status: "Draft 85% Completed • Pre-defense: Nov 28, 2025",
                  action: "Review Draft v3",
                },
                {
                  initials: "PA",
                  name: "Pooja Adhikari",
                  program: "BSc (Hons) Computing",
                  thesis: "Cross-Lingual OCR for Historical Nepali Manuscripts",
                  status: "Dataset Labeling Complete • Next: Chapter 3 Methodology Review",
                  action: "Review Ch 3",
                },
                {
                  initials: "RS",
                  name: "Rohan Shrestha",
                  program: "BSc (Hons) AI",
                  thesis: "Speech Sentiment Corpora for Colloquial Dialects",
                  status: "Data Ethics Cleared • Next: Fine-tuning on A100 Slurm run",
                  action: "Authorize GPU",
                },
              ].map((f) => (
                <div
                  key={f.name}
                  className="rounded border border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2042] font-bold text-white uppercase text-xs shrink-0">
                      {f.initials}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-serif text-sm">{f.name}</strong>
                        <span className="font-mono text-[0.68rem] text-slate-500">{f.program}</span>
                      </div>
                      <div className="text-slate-700 text-xs">{f.thesis}</div>
                      <div className="text-[0.68rem] font-mono text-slate-400">{f.status}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button className="btn-academic-outline text-xs py-1 px-3">
                      {f.action}
                    </button>
                    <button className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50">
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 text-xs">
          {/* Mentorship Queue */}
          <div className="academic-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-serif font-bold text-sm text-[#0F2042] flex items-center gap-1.5">
                <Users size={15} />
                <span>Mentorship Queue</span>
              </span>
              <span className="rounded bg-[#9E1B32]/10 text-[#9E1B32] px-2 py-0.5 font-bold font-mono text-[0.65rem]">
                3 Pending
              </span>
            </div>

            <div className="rounded bg-slate-50 p-2.5 text-[0.68rem] font-mono text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Lab Supervision Capacity:</span>
                <strong className="text-slate-800">85% (5/6 slots)</strong>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-[#0F2042] h-full w-[85%]" />
              </div>
              <div className="text-slate-400 text-[0.62rem]">
                1 undergraduate slot remaining for Spring 2026 intake
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-slate-200 p-3 space-y-2">
                <div className="flex justify-between">
                  <strong className="text-slate-900 font-serif">Samir KC</strong>
                  <span className="text-slate-400 font-mono text-[0.65rem]">2d ago</span>
                </div>
                <div className="text-[0.68rem] font-mono text-slate-500">BSc Year 3 (AI) • CGPA 3.88</div>
                <p className="text-[0.72rem] text-slate-600 line-clamp-2">
                  Topic: &quot;Quantization of LLMs for Edge Deployments on Low-Wattage Nepali IoT Nodes.&quot;
                </p>
                <div className="flex gap-2 pt-1">
                  <button className="btn-academic-primary text-[0.68rem] py-1 px-3 flex-1">
                    Accept
                  </button>
                  <button className="btn-academic-outline text-[0.68rem] py-1 px-2">
                    View Brief
                  </button>
                </div>
              </div>

              <div className="rounded border border-slate-200 p-3 space-y-2">
                <div className="flex justify-between">
                  <strong className="text-slate-900 font-serif">Anmol Gurung</strong>
                  <span className="text-slate-400 font-mono text-[0.65rem]">5d ago</span>
                </div>
                <div className="text-[0.68rem] font-mono text-slate-500">BSc Year 3 (Computing) • CGPA 3.74</div>
                <p className="text-[0.72rem] text-slate-600 line-clamp-2">
                  Topic: &quot;LegalNLP: Automatic Summarization of Nepali Supreme Court Appellate Rulings.&quot;
                </p>
                <button className="btn-academic-outline w-full text-[0.68rem] py-1">
                  Review 300-word Brief
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="academic-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-serif font-bold text-sm text-[#0F2042] flex items-center gap-1.5">
                <Clock size={15} />
                <span>Upcoming Deadlines</span>
              </span>
              <a href="#" className="text-[0.68rem] text-[#0F2042] font-semibold hover:underline">
                Academic Calendar
              </a>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 border-l-2 border-[#9E1B32] pl-3 py-0.5">
                <div className="font-mono text-center shrink-0">
                  <div className="text-[#9E1B32] font-bold text-[0.65rem]">OCT</div>
                  <div className="text-lg font-bold text-slate-900 leading-none">31</div>
                </div>
                <div>
                  <span className="rounded bg-[#FFDAD6] text-[#9E1B32] px-1.5 py-0.2 text-[0.6rem] font-bold uppercase">
                    Urgent • Camera Ready
                  </span>
                  <div className="font-semibold text-slate-900 text-[0.78rem] pt-0.5">
                    IJMR Vol 6, Issue 2 Manuscript Final Proofs
                  </div>
                  <div className="text-[0.68rem] text-slate-500">Final copyedit signoff & author approval</div>
                </div>
              </div>

              <div className="flex items-start gap-3 border-l-2 border-slate-300 pl-3 py-0.5">
                <div className="font-mono text-center shrink-0">
                  <div className="text-slate-500 font-bold text-[0.65rem]">NOV</div>
                  <div className="text-lg font-bold text-slate-900 leading-none">05</div>
                </div>
                <div>
                  <span className="font-mono text-[0.65rem] text-slate-500 uppercase font-bold">
                    Grant Compliance
                  </span>
                  <div className="font-semibold text-slate-900 text-[0.78rem] pt-0.5">
                    CADI Mid-Term Progress Audit Submission
                  </div>
                  <div className="text-[0.68rem] text-slate-500">Deliverable report to Islington Research Board</div>
                </div>
              </div>

              <div className="flex items-start gap-3 border-l-2 border-slate-300 pl-3 py-0.5">
                <div className="font-mono text-center shrink-0">
                  <div className="text-slate-500 font-bold text-[0.65rem]">NOV</div>
                  <div className="text-lg font-bold text-slate-900 leading-none">14</div>
                </div>
                <div>
                  <span className="font-mono text-[0.65rem] text-slate-500 uppercase font-bold">
                    Keynote Lecture
                  </span>
                  <div className="font-semibold text-slate-900 text-[0.78rem] pt-0.5">
                    IJMR Annual Multidisciplinary Summit 2025
                  </div>
                  <div className="text-[0.68rem] text-slate-500">Topic: &quot;Sovereign AI Infrastructure for Himalayan Languages&quot;</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Cluster Telemetry */}
          <div className="rounded-xl bg-[#000922] text-white p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-xs text-[#89F5E7] uppercase font-bold flex items-center gap-1.5">
                <Activity size={14} />
                <span>AI Cluster Telemetry</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Node: a100-sxm4-node-01</span>
                <span className="text-[#89F5E7] font-bold">94% GPU Load</span>
              </div>

              <div className="rounded bg-slate-900 p-2.5 text-[0.68rem] text-slate-300 space-y-1 overflow-x-auto">
                <div className="text-slate-400 text-[0.62rem]">Job #84910 • Slurm batch</div>
                <div className="text-white">python devabert_pretrain.py --batch_size 64...</div>
                <div className="text-slate-500 text-[0.62rem]">Est: 4h 12m left</div>
              </div>

              <div className="flex justify-between text-[0.7rem] text-slate-400">
                <span>VRAM Usage: 76.4 GB / 80 GB</span>
                <span>Temp: 68°C</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <a
                href="#"
                className="text-[0.7rem] text-[#89F5E7] hover:underline flex items-center justify-between"
              >
                <span>Open Grafana Metrics Dashboard</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
