"use client";

import { useActionState, useState } from "react";
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { submitPublication } from "./actions";

export function SubmissionForm() {
  const [state, action, pending] = useActionState(submitPublication, {});
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [title, setTitle] = useState(
    "DevaTokenizer: Subword Byte-Pair Segmentation Optimized for Conjunct Consonants in Contemporary Nepali Text"
  );
  const [abstract, setAbstract] = useState(
    "Background: Modern pre-trained language models encounter severe token fragmentation when handling Devanagari script, particularly the rich conjunct consonant orthography pervasive in contemporary Nepali writing.\n\nMethods: We present DevaTokenizer, an enhanced byte-pair encoding variant incorporating orthographic boundary constraints that preserve syllabic glyph integrity.\n\nFindings: Empirical results show a 34.2% reduction in sequence length inflation and an 18.6% acceleration in Slurm GPU throughput.\n\nSignificance: The tokenizer provides an open foundation for resource-efficient NLP models tailored to Himalayan computational linguistics."
  );
  const [doi, setDoi] = useState("10.5281/zenodo.10884291");
  const [year, setYear] = useState<number>(2025);
  const [isDemo, setIsDemo] = useState(false);

  return (
    <form action={action} className="space-y-8">
      {/* Hidden inputs to preserve backend contract */}
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="abstract" value={abstract} />
      <input type="hidden" name="doi" value={doi} />
      <input type="hidden" name="year" value={year} />
      {isDemo && <input type="hidden" name="is_demo" value="on" />}

      {/* 1. Wizard Stepper Bar (Stitch s8.png) */}
      <div className="academic-card p-4 md:p-5 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {[
            { num: 1, label: "Step 1: Type & Scope", status: "completed" },
            { num: 2, label: "Step 2: Metadata & Abstract", status: "completed" },
            { num: 3, label: "Step 3: Files & Artifacts", status: "active" },
            { num: 4, label: "Step 4: Authors & ORCID", status: "pending" },
            { num: 5, label: "Step 5: Reviewers & COI", status: "pending" },
          ].map((st) => (
            <button
              key={st.num}
              type="button"
              onClick={() => setCurrentStep(st.num)}
              className={`text-left p-2.5 rounded border transition-all ${
                st.num === currentStep
                  ? "border-[#0F2042] bg-[#0F2042] text-white shadow-xs"
                  : st.status === "completed"
                    ? "border-slate-200 bg-[#FAFBFD] text-slate-700 hover:border-slate-300"
                    : "border-slate-100 bg-slate-50/50 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between text-[0.62rem] font-mono">
                <span className={st.num === currentStep ? "text-[#89F5E7]" : ""}>
                  {st.status === "completed" ? "COMPLETED" : st.status === "active" ? "ACTIVE" : "PENDING"}
                </span>
                {st.status === "completed" && (
                  <CheckCircle2 size={12} className="text-[#0F766E]" />
                )}
              </div>
              <div className="font-semibold text-xs mt-1 truncate">
                {st.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main 8:4 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Interactive Step Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1 & 2 Inputs: Editable Title & Abstract */}
          {currentStep <= 2 && (
            <div className="academic-card p-6 md:p-8 space-y-6">
              <h3 className="headline-sm text-[#0F2042]">
                Manuscript Title & Structured Abstract
              </h3>

              <div>
                <label htmlFor="title-input">Manuscript Title *</label>
                <input
                  id="title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-[#0F2042] focus:outline-none"
                  placeholder="Full scholarly title..."
                />
              </div>

              <div>
                <label htmlFor="abstract-input">Structured Abstract *</label>
                <textarea
                  id="abstract-input"
                  required
                  rows={8}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-[#0F2042] focus:outline-none font-serif"
                  placeholder="Background, Methods, Findings, Significance..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="doi-input">DOI (optional)</label>
                  <input
                    id="doi-input"
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="w-full rounded border border-slate-300 bg-white p-2.5 text-xs font-mono text-slate-900"
                    placeholder="10.5281/example"
                  />
                </div>
                <div>
                  <label htmlFor="year-input">Publication Year</label>
                  <input
                    id="year-input"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 bg-white p-2.5 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isDemo}
                  onChange={(e) => setIsDemo(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F2042]"
                />
                <span>This is demonstration data. Flag with visible DEMO badge.</span>
              </label>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-academic-primary text-xs py-2 px-5"
              >
                Proceed to Files & Artifacts (Step 3) →
              </button>
            </div>
          )}

          {/* Step 3: Files & Artifacts (Stitch s8.png) */}
          {currentStep >= 3 && (
            <div className="space-y-6">
              <div className="academic-card p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-[0.65rem] text-slate-400 uppercase font-bold">
                      Current Stage • ID: IJMR-SUB-2025-0841
                    </span>
                    <h3 className="headline-sm text-[#0F2042]">
                      Step 3 of 5: Primary Manuscript & Reproducibility Artifacts
                    </h3>
                  </div>
                  <span className="pill-badge pill-published text-[0.62rem]">
                    Automated Integrity Agent Online
                  </span>
                </div>

                {/* Double-Blind Peer Review Compliance Rule */}
                <div className="rounded border border-amber-200 bg-amber-50/70 p-4 text-xs space-y-1 text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 text-[0.78rem]">
                    <ShieldCheck size={16} className="text-amber-700" />
                    <span>Double-Blind Peer Review Compliance Rule</span>
                  </div>
                  <p className="leading-relaxed text-amber-800">
                    IJMR strictly mandates blinding. Ensure all primary manuscript files (PDF/DOCX) contain <strong>no author names, institutional affiliations, specific lab references, or grant acknowledgments</strong> in the main body. Upload non-anonymized credits exclusively in the separate Title Page card below.
                  </p>
                </div>

                {/* Anonymized Primary Manuscript Upload Card */}
                <div className="rounded border border-slate-200 bg-[#FAFBFD] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      Anonymized Primary Manuscript Document (Required) *
                    </span>
                    <span className="text-[0.68rem] font-mono text-slate-400">
                      Accepted: PDF, LaTeX (ZIP), DOCX • Max: 50MB
                    </span>
                  </div>

                  <div className="rounded border border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-[#0F2042] p-2 text-white">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>IJMR-2025-MANUSCRIPT-ANON-DRAFT-v3.pdf</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[0.65rem] text-slate-600 font-semibold">
                            3.4 MB
                          </span>
                        </div>
                        <div className="text-[0.68rem] text-slate-500 font-mono">
                          Compiled LaTeX preprint • Uploaded today at 14:22 NPT
                        </div>
                        <div className="flex items-center gap-3 text-[0.68rem] font-mono text-[#0F766E] pt-1">
                          <span>✓ Auto-scan: 0 Author Names detected (Double-Blind Verified)</span>
                          <span>•</span>
                          <span>Word count: 7,420 words</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <button type="button" className="btn-academic-outline text-[0.68rem] py-1 px-2.5">
                        Preview PDF
                      </button>
                      <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600" title="Replace">
                        <RefreshCw size={13} />
                      </button>
                      <button type="button" className="p-1.5 text-red-500 hover:text-red-700" title="Remove">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title Page & Author Declaration File */}
                <div className="rounded border border-slate-200 bg-[#FAFBFD] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      Title Page & Author Declaration File (Non-Anonymized) *
                    </span>
                    <span className="font-mono text-[0.65rem] text-[#9E1B32] font-semibold">
                      Confidential to Managing Editors
                    </span>
                  </div>

                  <div className="rounded border border-slate-200 bg-white p-3 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-[#9E1B32]" />
                      <div>
                        <span className="font-semibold text-slate-800">
                          Title_Page_Authors_Affiliations_CADI.docx
                        </span>
                        <span className="text-slate-400 ml-2">240 KB</span>
                      </div>
                    </div>
                    <span className="text-[#0F766E] text-[0.68rem]">✓ Verified</span>
                  </div>
                </div>

                {/* Supplementary Datasets & Code */}
                <div className="rounded border border-slate-200 bg-[#FAFBFD] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      Supplementary Datasets & Reproducibility Packages (IJMR Open Science Standard)
                    </span>
                    <span className="pill-badge pill-published text-[0.6rem]">
                      FAIR Compliant
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="rounded border border-slate-200 bg-white p-3 space-y-1">
                      <div className="text-slate-500 text-[0.65rem]">Zenodo Research Archive</div>
                      <div className="font-semibold text-[#0F2042] truncate">
                        zenodo.org/records/10884291
                      </div>
                      <div className="text-[0.65rem] text-slate-400">DevaTokenizer-Annotated (34.2 MB)</div>
                    </div>

                    <div className="rounded border border-slate-200 bg-white p-3 space-y-1">
                      <div className="text-slate-500 text-[0.65rem]">Code Capsule & Scripts</div>
                      <div className="font-semibold text-[#0F2042] truncate">
                        github.com/islington-research/nepal-nlp
                      </div>
                      <div className="text-[0.65rem] text-slate-400">Slurm orchestration harnesses</div>
                    </div>
                  </div>
                </div>

                {/* Ethics Approval */}
                <div className="rounded border border-slate-200 bg-white p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#0F766E]" />
                    <div>
                      <strong className="text-slate-900 block font-serif">
                        Institutional Ethics Board Approval Certificate (IRB) Clearance
                      </strong>
                      <span className="text-slate-500 font-mono text-[0.68rem]">
                        Protocol #IRB-2024-082-CADI registered under Islington College Academic Ethics Council
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0F766E]">VALIDATED</span>
                </div>
              </div>

              {/* Review Metadata Summary Card */}
              <div className="academic-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#0F766E]" />
                    <span className="font-serif font-bold text-sm text-[#0F2042]">
                      Review Metadata & Manuscript Scope (Steps 1 & 2)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-academic-outline text-[0.68rem] py-0.5 px-2"
                  >
                    Edit Metadata
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-mono text-slate-400 text-[0.65rem] uppercase">
                    Registered Paper Title
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#0F2042]">
                    {title}
                  </h4>
                  <div className="font-mono text-slate-400 text-[0.65rem] uppercase pt-2">
                    Structured Abstract (240 Words)
                  </div>
                  <p className="body-editorial text-xs text-slate-700 line-clamp-4 whitespace-pre-wrap">
                    {abstract}
                  </p>
                </div>
              </div>

              {/* Next Previews: Authors & Reviewers */}
              <div className="academic-card p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono text-xs font-bold uppercase text-slate-500">
                    Step 4 Preview: Author Roster & Affiliation Map
                  </span>
                  <span className="font-mono text-[0.68rem] text-slate-400">3 Authors Configured</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded bg-[#FAFBFD] p-2.5 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2042] text-white text-[0.6rem] font-bold">
                        AS
                      </div>
                      <div>
                        <strong className="text-slate-900">Dr. Aasha Sharma</strong>
                        <span className="text-[0.68rem] text-slate-500 ml-2">Lead & Corresponding • CADI</span>
                      </div>
                    </div>
                    <span className="font-mono text-[0.65rem] text-[#0F766E]">ORCID: 0000-0002-8419-4912 ✓</span>
                  </div>

                  <div className="flex items-center justify-between rounded bg-[#FAFBFD] p-2.5 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-white text-[0.6rem] font-bold">
                        NP
                      </div>
                      <div>
                        <strong className="text-slate-900">Niraj Pokhrel</strong>
                        <span className="text-[0.68rem] text-slate-500 ml-2">Student Fellow • Co-First</span>
                      </div>
                    </div>
                    <span className="font-mono text-[0.65rem] text-[#0F766E]">ORCID: 0009-0004-1290-7718 ✓</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="academic-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-academic-outline text-xs"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Metadata</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-[#0F766E] font-mono">
                  <CheckCircle2 size={14} />
                  <span>All mandatory files uploaded</span>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" className="btn-academic-outline text-xs">
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-academic-accent text-xs shadow-sm py-2 px-4"
                  >
                    {pending ? "Lodging Manuscript…" : "Submit Manuscript for Review →"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {state.error && (
            <div className="alert alert-error text-xs">
              {state.error}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Integrity Checklist, Milestones & Handling Editors (Stitch s8.png) */}
        <aside className="lg:col-span-4 space-y-6 text-xs">
          {/* Integrity Checklist Card */}
          <div className="academic-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-serif font-bold text-sm text-[#0F2042] flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#0F766E]" />
                <span>Integrity Checklist</span>
              </span>
              <span className="rounded bg-emerald-100 text-[#065F46] px-2 py-0.5 text-[0.62rem] font-bold font-mono">
                5/6 Ready
              </span>
            </div>

            <p className="text-slate-600 text-[0.72rem] leading-relaxed">
              Automated prescreen validates submission parameters against COPE and IJMR open-access guidelines:
            </p>

            <div className="space-y-2 text-slate-700 text-[0.75rem]">
              {[
                { label: "Double-Blind Blinding: No author names or institutions in paper body", ok: true },
                { label: "Visual Resolution: All 6 diagrams comply with min 300 DPI vector", ok: true },
                { label: "Structured Abstract: Explicit Background, Methods, Findings sections", ok: true },
                { label: "Open Data Availability: Zenodo benchmark & GitHub script tags", ok: true },
                { label: "Compute Infrastructure: Islington AI Slurm cluster statement", ok: true },
                { label: "Author Verification: 1 co-author ORCID confirmation remaining", ok: false },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className={c.ok ? "text-[#0F766E] shrink-0 mt-0.5" : "text-amber-500 shrink-0 mt-0.5"}
                  />
                  <span className={c.ok ? "" : "text-amber-700"}>{c.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex justify-between font-mono text-[0.68rem]">
                <span className="text-slate-500">Rigor Confidence Score:</span>
                <strong className="text-[#0F2042]">93.5%</strong>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0F2042] h-full w-[93.5%]" />
              </div>
            </div>
          </div>

          {/* Review Milestones Card */}
          <div className="academic-card p-5 space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
              Review Milestones
            </span>

            <div className="space-y-2.5 font-mono text-[0.7rem]">
              <div className="flex justify-between">
                <span className="text-slate-600">Desk Review (Triage):</span>
                <strong className="text-slate-900">3–5 Days</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Double-Blind Peer Review:</span>
                <strong className="text-slate-900">21 Days</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">First Decision Notice:</span>
                <strong className="text-[#0F2042]">Avg 28 Days</strong>
              </div>
            </div>

            <div className="rounded bg-[#FAFBFD] p-2.5 border border-slate-200 text-[0.68rem] text-slate-600 space-y-0.5">
              <div className="font-bold text-[#0F766E]">100% Article Processing Charge Waiver</div>
              <p>Funded by the Islington College Research Endowment. No fees are charged to authors.</p>
            </div>
          </div>

          {/* Handling Editors Card */}
          <div className="academic-card p-5 space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
              Handling Editors
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F2042] text-white font-bold text-[0.65rem]">
                  BT
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Dr. Bikash Thapa</div>
                  <div className="text-[0.68rem] text-slate-500">Section Editor • Applied AI</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-[0.65rem]">
                  DM
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Prof. David Miller</div>
                  <div className="text-[0.68rem] text-slate-500">Editor-in-Chief • London Met</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Submission Clinic */}
          <div className="rounded border border-[#bfdbfe] bg-[#eff6ff] p-4 space-y-2 text-xs text-[#1e40af]">
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#1e40af] block">
              Pre-Submission Clinic
            </span>
            <p className="text-[0.72rem] leading-relaxed">
              Students and first-time faculty authors are invited to attend the weekly manuscript triage sessions:
            </p>
            <div className="text-[0.68rem] font-mono">
              📅 Every Friday • 15:00 – 17:00 NPT<br />
              📍 Alan Turing Research Block, Room 402
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
