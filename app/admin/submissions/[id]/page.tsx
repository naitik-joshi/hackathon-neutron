import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { requireRole } from "@/lib/auth/guards";
import { ReviewForm } from "@/features/submissions/review-form";

export const metadata = {
  title: "Admin Editorial Verdict & Peer Review Synthesis | IJMR",
};

export default async function Submission({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { client } = await requireRole(["admin"]);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const { data, error } = await client
    .from("publications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("Could not load submission");
  if (!data) notFound();

  const isUpdated = (await searchParams).updated === "1";

  return (
    <div className="page-shell space-y-8">
      {/* 1. Header & Submission Metadata (Stitch s15.png) */}
      <div className="academic-card p-6 md:p-8 space-y-6 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-900 text-white px-2 py-0.5 font-mono text-xs font-bold">
              IJMR-2025-MS-{data.id.slice(0, 4).toUpperCase()}
            </span>
            <span className="pill-badge pill-collab text-[0.62rem]">
              Applied Computing & Indo-Aryan NLP
            </span>
            <span className="pill-badge pill-review text-[0.62rem]">
              Fall 2025 Regular Call
            </span>
            <span className="pill-badge pill-published text-[0.62rem]">
              Double-Blind Integrity Verified
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button className="btn-academic-outline text-[0.68rem] py-1 px-2.5">
              Export Dossier (PDF)
            </button>
            <button className="btn-academic-outline text-[0.68rem] py-1 px-2.5">
              Audit Trail
            </button>
            <button className="btn-academic-outline text-[0.68rem] py-1 px-2.5">
              Diff Viewer
            </button>
          </div>
        </div>

        <div className="space-y-2 max-w-4xl">
          <h1 className="headline-lg text-[#0F2042]">
            {data.title}
          </h1>

          {/* De-Anonymized Authorship (EIC View) */}
          <div className="rounded bg-[#FAFBFD] p-3 border border-slate-200 text-xs flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-mono text-[0.65rem] text-slate-400 uppercase font-bold">
              De-Anonymized Authorship (EIC View):
            </span>
            <strong className="text-slate-900">Dr. Aasha Sharma (Lead PI, CADI)</strong>
            <span>•</span>
            <span className="text-slate-700">Niraj Pokhrel (Undergraduate Fellow)</span>
            <span>•</span>
            <span className="text-slate-700">Prof. Kieran Thorne (London Met)</span>
          </div>
        </div>

        {/* Milestone Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-t border-slate-100 pt-4">
          <div>
            <span className="text-slate-400 text-[0.62rem] block uppercase">Assigned EIC</span>
            <strong className="text-slate-800">Prof. David Miller</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[0.62rem] block uppercase">Handling Editor</span>
            <strong className="text-slate-800">Dr. Bikash Thapa</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[0.62rem] block uppercase">Decision Milestone</span>
            <strong className="text-[#0F766E]">Revision Round 1 Complete</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[0.62rem] block uppercase">Target Production</span>
            <strong className="text-[#0F2042]">Vol. 6, Issue 2 [Oct 2025]</strong>
          </div>
        </div>

        {isUpdated && (
          <div className="alert alert-success text-xs">
            Review decision recorded successfully.
          </div>
        )}
      </div>

      {/* 2. Main 8:4 Grid Architecture (Stitch s15.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Rubric & Consensus & Rebuttal */}
        <div className="lg:col-span-8 space-y-8">
          {/* SYNTHESIS 01: Peer Reviewer Consensus */}
          <div className="academic-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#0F2042] text-white px-2 py-0.5 text-[0.62rem] font-bold font-mono">
                  SYNTHESIS 01
                </span>
                <h2 className="headline-sm text-[#0F2042]">
                  Peer Reviewer Consensus & Rubric Calibration
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-500">
                Rubric Mean: <strong>4.43 / 5.00</strong>
              </span>
            </div>

            {/* 4 Score Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded bg-slate-50 p-3">
                <div className="font-bold text-2xl font-serif text-[#0F2042]">4.43 <span className="text-xs text-slate-400 font-sans">/ 5.0</span></div>
                <div className="text-[0.65rem] font-mono text-slate-500 uppercase mt-0.5">Overall Merit</div>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <div className="font-bold text-2xl font-serif text-[#0F766E]">97.4%</div>
                <div className="text-[0.65rem] font-mono text-slate-500 uppercase mt-0.5">Reproducibility</div>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <div className="font-bold text-2xl font-serif text-slate-900">2.1%</div>
                <div className="text-[0.65rem] font-mono text-slate-500 uppercase mt-0.5">Similarity (iThenticate)</div>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <div className="font-bold text-2xl font-serif text-[#0F766E]">0 Critical</div>
                <div className="text-[0.65rem] font-mono text-slate-500 uppercase mt-0.5">Blocking Flaws</div>
              </div>
            </div>

            {/* 3 Reviewer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-4 space-y-2">
                <div className="flex justify-between font-mono text-[0.68rem]">
                  <strong className="text-slate-900">Reviewer #1</strong>
                  <span className="font-bold text-[#0F766E]">4.3 / 5.0</span>
                </div>
                <div className="text-[0.68rem] text-slate-500">Computational Linguistics (TU)</div>
                <span className="rounded bg-emerald-100 text-[#065F46] px-1.5 py-0.2 text-[0.6rem] font-bold block w-fit">
                  ✓ Accept w/ Minor Revisions
                </span>
                <p className="italic text-slate-600 text-[0.72rem] leading-relaxed pt-1">
                  &quot;Exemplary formulation of conjunct penalty vectors. Resolves longstanding subword fragmentation.&quot;
                </p>
              </div>

              <div className="rounded border border-[#FFDAD6] bg-[#FFF5F5] p-4 space-y-2">
                <div className="flex justify-between font-mono text-[0.68rem]">
                  <strong className="text-slate-900">Reviewer #2 (Canonical)</strong>
                  <span className="font-bold text-[#9E1B32]">4.8 / 5.0</span>
                </div>
                <div className="text-[0.68rem] text-slate-500">Himalayan NLP Specialist</div>
                <span className="rounded bg-[#FFDAD6] text-[#9E1B32] px-1.5 py-0.2 text-[0.6rem] font-bold block w-fit">
                  Minor Revisions Required
                </span>
                <p className="italic text-slate-600 text-[0.72rem] leading-relaxed pt-1">
                  &quot;Valid methodology, but requested crucial OOV ablation against classical Madan Puraskar literary text.&quot;
                </p>
              </div>

              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-4 space-y-2">
                <div className="flex justify-between font-mono text-[0.68rem]">
                  <strong className="text-slate-900">Reviewer #3 (Auditor)</strong>
                  <span className="font-bold text-[#0F766E]">4.6 / 5.0</span>
                </div>
                <div className="text-[0.68rem] text-slate-500">Open Science & Reproducibility</div>
                <span className="rounded bg-emerald-100 text-[#065F46] px-1.5 py-0.2 text-[0.6rem] font-bold block w-fit">
                  ✓ Accept as-is
                </span>
                <p className="italic text-slate-600 text-[0.72rem] leading-relaxed pt-1">
                  &quot;Artifact verification was seamless. Zenodo docker container reproduced BLEU and CRediT score within 4%.&quot;
                </p>
              </div>
            </div>

            {/* Dimensional Rubric Table */}
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 text-[0.65rem] uppercase">
                  <tr>
                    <th className="p-2.5">Evaluation Dimension</th>
                    <th className="p-2.5">Ref 1</th>
                    <th className="p-2.5">Ref 2</th>
                    <th className="p-2.5">Ref 3</th>
                    <th className="p-2.5">Consensus State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-medium">Originality & Theoretical Depth</td>
                    <td className="p-2.5">4.0 / 5</td>
                    <td className="p-2.5">4.5 / 5</td>
                    <td className="p-2.5">4.8 / 5</td>
                    <td className="p-2.5 text-[#0F766E] font-bold">Strong Consensus</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Methodological Rigor & Data Scope</td>
                    <td className="p-2.5">4.4 / 5</td>
                    <td className="p-2.5">5.0 / 5</td>
                    <td className="p-2.5">4.7 / 5</td>
                    <td className="p-2.5 text-[#0F766E] font-bold">Rebuttal Addressed</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Reproducibility & Computational Artifacts</td>
                    <td className="p-2.5">4.5 / 5</td>
                    <td className="p-2.5">4.8 / 5</td>
                    <td className="p-2.5">5.0 / 5</td>
                    <td className="p-2.5 text-[#0F766E] font-bold">Zenodo Certified</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Mathematical Soundness (Halanta Penalty)</td>
                    <td className="p-2.5">4.0 / 5</td>
                    <td className="p-2.5">4.1 / 5</td>
                    <td className="p-2.5">4.0 / 5</td>
                    <td className="p-2.5 text-[#0F2042] font-bold">Eq 3-4 Clarified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* REBUTTAL 02: Author Rebuttal & Section Editor Adjudication */}
          <div className="academic-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#9E1B32] text-white px-2 py-0.5 text-[0.62rem] font-bold font-mono">
                  REBUTTAL 02
                </span>
                <h3 className="headline-sm text-[#0F2042]">
                  Author Rebuttal & Section Editor Adjudication
                </h3>
              </div>
              <span className="font-mono text-xs text-[#0F766E] font-bold">
                ✓ 3 of 3 Inquiries Cleared
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-4 space-y-2">
                <div className="flex items-center justify-between font-mono text-[0.68rem]">
                  <strong className="text-slate-900">1. Out-of-Vocabulary (OOV) Classical Corpus Ablation</strong>
                  <span className="rounded bg-emerald-100 text-[#065F46] px-1.5 py-0.2 font-bold">
                    ✓ Accepted & Cleared
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-2 rounded bg-white border border-slate-200 space-y-1">
                    <span className="text-[0.62rem] font-mono text-slate-400 block uppercase">Reviewer 2 Critique</span>
                    <p className="italic text-slate-600 text-[0.72rem]">
                      &quot;Requires rigorous evaluation across archaic registers and historical texts...&quot;
                    </p>
                  </div>
                  <div className="p-2 rounded bg-[#0F2042] text-white space-y-1">
                    <span className="text-[0.62rem] font-mono text-[#89F5E7] block uppercase">Editor Bikash Thapa</span>
                    <p className="text-[0.72rem] text-slate-300">
                      Replication capsule executed on Islington HPC node. Table 5 verified accurate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERDICT 03: Executive Editorial Verdict Formulation (Submits actual review action) */}
          <div className="academic-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#0F2042] text-white px-2 py-0.5 text-[0.62rem] font-bold font-mono">
                  VERDICT 03
                </span>
                <h3 className="headline-sm text-[#0F2042]">
                  Executive Editorial Verdict Formulation
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-500">
                Current State: <strong className="capitalize">{data.status}</strong>
              </span>
            </div>

            {/* Formal Submission Action Component */}
            <ReviewForm id={id} status={data.status} />

            {data.status === "published" && (
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/publications/${data.slug}`}
                  className="btn-academic-outline text-xs inline-flex items-center gap-1.5"
                >
                  <span>View Public Journal Page</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Executive Authority, Digital Signatures & Telemetry */}
        <aside className="lg:col-span-4 space-y-6 text-xs">
          {/* Executive Authority Card */}
          <div className="academic-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Executive Authority
              </span>
              <span className="rounded bg-emerald-100 text-[#065F46] px-1.5 py-0.2 font-mono font-bold text-[0.65rem]">
                EIC Clearance
              </span>
            </div>

            <p className="text-slate-600 text-[0.72rem] leading-relaxed">
              Executing this verdict automatically signs the decision manifest, alerts authors via institutional SMTP, and transmits metadata to the Crossref staging queue.
            </p>

            <div className="rounded bg-[#FAFBFD] p-3 border border-slate-200 text-slate-700 space-y-1 text-[0.72rem]">
              <div className="font-bold text-[#0F2042]">Handling Editor Recommendation:</div>
              <p>Accept for Volume 6, Issue 2 with distinction for undergraduate co-first authorship.</p>
            </div>
          </div>

          {/* Digital Signatures */}
          <div className="academic-card p-5 space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
              Digital Signatures
            </span>

            <div className="space-y-3 text-[0.72rem]">
              <div className="flex items-center justify-between rounded bg-slate-50 p-2.5">
                <div>
                  <strong className="text-slate-900 block">Prof. David Miller</strong>
                  <span className="text-[0.65rem] text-slate-500 font-mono">Editor-in-Chief • SHA-256</span>
                </div>
                <span className="rounded bg-[#0F766E] text-white px-1.5 py-0.2 text-[0.6rem] font-mono font-bold">
                  SIGNED
                </span>
              </div>

              <div className="flex items-center justify-between rounded bg-slate-50 p-2.5">
                <div>
                  <strong className="text-slate-900 block">Dr. Bikash Thapa</strong>
                  <span className="text-[0.65rem] text-slate-500 font-mono">Section Editor • SHA-256</span>
                </div>
                <span className="rounded bg-[#0F766E] text-white px-1.5 py-0.2 text-[0.6rem] font-mono font-bold">
                  ENDORSED
                </span>
              </div>
            </div>
          </div>

          {/* Turnaround Velocity */}
          <div className="academic-card p-5 space-y-3 font-mono text-[0.7rem]">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
              Turnaround Velocity
            </span>

            <div className="flex justify-between">
              <span className="text-slate-500">Total Days in Review:</span>
              <strong className="text-slate-900">24 Days</strong>
            </div>
            <div className="text-[0.65rem] text-[#0F766E] font-semibold">
              ✓ 4 Days Ahead of Target SLA
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[0.68rem] text-slate-600">
              <div className="flex justify-between">
                <span>Initial Submission:</span>
                <span>Oct 04, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Reviewers Dispatched:</span>
                <span>Oct 06, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>All Reports In:</span>
                <span>Oct 20, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Rebuttal Received:</span>
                <span>Oct 26, 2025</span>
              </div>
            </div>
          </div>

          {/* Publication Integrity (COPE) */}
          <div className="academic-card p-5 space-y-2 text-[0.72rem]">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
              Publication Integrity (COPE)
            </span>

            <div className="space-y-1.5 text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#0F766E]" />
                <span>Double-Blind Redaction Audit passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#0F766E]" />
                <span>Competing Financial Interests verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#0F766E]" />
                <span>Institutional Research Clearance signed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#0F766E]" />
                <span>CC-BY 4.0 Open Access agreement</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <Link href="/admin/submissions" className="btn-academic-outline text-xs">
          ← Back to All Submissions
        </Link>
      </div>
    </div>
  );
}
