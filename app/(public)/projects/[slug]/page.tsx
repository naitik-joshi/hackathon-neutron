import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Share2,
  Code2,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Terminal,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getProjectBySlug } from "@/features/projects/queries";
import { SetupState } from "@/components/shared/empty-state";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) {
    return { title: "Project Detail" };
  }
  const data = await getProjectBySlug(slug);
  if (!data) return { title: "Project Not Found" };
  return {
    title: `${data.project.title.replace(/^DEMO DATA — /, "")} | Projects`,
    description: data.project.summary.replace(/^DEMO DATA — /, "").slice(0, 160),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return <SetupState />;
  }

  const { slug } = await params;
  const data = await getProjectBySlug(slug);

  if (!data) {
    notFound();
  }

  const { project, areas, researchers, publications } = data;
  const cleanTitle = project.title.replace(/^DEMO DATA — /, "");
  const cleanSummary = project.summary.replace(/^DEMO DATA — /, "");
  const leadResearcher = researchers[0]?.name.replace(/^DEMO DATA — /, "") || "Dr. Aasha Sharma";
  const firstArea = areas[0]?.name.replace(/^DEMO DATA — /, "") || "Computing & AI";

  return (
    <div className="page-shell space-y-10">
      {/* 1. Top Badges & Header Strip */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill-badge pill-published">Active Research Project</span>
          <span className="pill-badge pill-review">Looking for 2 Student Collaborators</span>
          <span className="pill-badge pill-collab">Grant Funded (CADI-2024-PRJ)</span>
          <span className="pill-badge pill-teal">Open Science Compliant</span>
        </div>

        <h1 className="display-lg text-[#0F2042] max-w-4xl">
          {cleanTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-mono">
          <span>Dept. of {firstArea}, Center for Applied AI & Data Innovation (CADI)</span>
          <span>•</span>
          <span>Oct 2024 – Dec 2025</span>
          <span>•</span>
          <span>Lead PI: <strong className="text-slate-800">{leadResearcher}</strong></span>
          <span>•</span>
          <span>DOI: 10.5281/zenodo.10884291</span>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#apply-section"
            className="btn-academic-primary text-xs"
          >
            Apply for Collaboration
          </a>
          <button
            type="button"
            className="btn-academic-outline text-xs"
          >
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span>Star Project 64</span>
          </button>
          <button
            type="button"
            className="btn-academic-outline text-xs"
          >
            <Share2 size={14} />
            <span>Share Project</span>
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-academic-outline text-xs"
          >
            <Code2 size={14} />
            <span>View Code Repository [GitHub]</span>
          </a>
        </div>
      </div>

      {/* 2. Interactive Project Lifecycle (7 Stages Stepper - Stitch s7.png) */}
      <div className="academic-card p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
              Research Rigor Framework
            </span>
            <div className="font-serif font-bold text-lg text-[#0F2042]">
              Interactive Project Lifecycle • 7 Stages
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-semibold text-slate-500 block">
              Overall Execution
            </span>
            <span className="font-serif font-bold text-sm text-[#0F2042]">
              Stage 4 of 7 (58% Total Pipeline)
            </span>
          </div>
        </div>

        {/* 7 Stages Stepper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { stage: 1, title: "Problem & Ethics", desc: "Approved by IRB • Oct 2024", status: "completed" },
            { stage: 2, title: "Grant Matching", desc: "CADI Grant Locked • Nov 2024", status: "completed" },
            { stage: 3, title: "Corpus Collection", desc: "18.2K Sentences • Jan 2025", status: "completed" },
            { stage: 4, title: "Benchmarking", desc: "78% Work Completed", status: "active" },
            { stage: 5, title: "IJMR Peer Review", desc: "Scheduled • July 2025", status: "upcoming" },
            { stage: 6, title: "Camera-Ready & DOI", desc: "Target Issue • Oct 2025", status: "upcoming" },
            { stage: 7, title: "Model Dissemination", desc: "HuggingFace Weights • Dec 2025", status: "upcoming" },
          ].map((s) => (
            <div
              key={s.stage}
              className={`rounded border p-3 space-y-1.5 flex flex-col justify-between ${
                s.status === "active"
                  ? "border-[#0F2042] bg-[#0F2042] text-white shadow-sm"
                  : s.status === "completed"
                    ? "border-slate-200 bg-[#FAFBFD] text-slate-700"
                    : "border-slate-100 bg-slate-50/60 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between text-[0.65rem] font-mono">
                <span className={s.status === "active" ? "text-[#89F5E7]" : ""}>
                  STAGE 0{s.stage}
                </span>
                {s.status === "completed" && <CheckCircle2 size={12} className="text-[#0F766E]" />}
                {s.status === "active" && (
                  <span className="rounded bg-[#9E1B32] px-1 py-0.2 text-[0.55rem] font-bold text-white uppercase">
                    Active
                  </span>
                )}
              </div>
              <div className="font-serif font-bold text-xs leading-tight">
                {s.title}
              </div>
              <div
                className={`text-[0.62rem] leading-tight ${
                  s.status === "active" ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Active Sprint Focus Callout */}
        <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#0F2042] px-2 py-0.5 text-[0.62rem] font-mono font-bold text-white uppercase">
              Active Sprint Focus
            </span>
            <span className="text-slate-700">
              Currently evaluating <strong>DevaMix-BERT</strong> on 18,500 conversational sentences and fine-tuning byte-pair merges on the Islington A100 GPU cluster.
            </span>
          </div>
          <button
            type="button"
            className="text-xs font-mono font-semibold text-[#0F2042] hover:underline shrink-0"
          >
            [Sprint Logs]
          </button>
        </div>
      </div>

      {/* 3. Main 8:4 Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-8">
          {/* Project Overview & Research Questions */}
          <div className="academic-card p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="headline-sm text-[#0F2042] flex items-center gap-2">
                <FileText size={18} className="text-[#0D9488]" />
                <span>Project Overview & Research Questions</span>
              </h2>
              <p className="body-editorial text-sm text-slate-700 leading-relaxed">
                {cleanSummary}
              </p>
            </div>

            {/* Core Hypotheses & Empirical Objectives */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Core Hypotheses & Empirical Objectives
              </span>

              <div className="space-y-3">
                {[
                  {
                    num: "1",
                    title: "Hypothesis 1: Morpho-Syntactic Tokenization Efficiency",
                    desc: "A character-ngram-aware Devanagari Byte-Pair Tokenizer will lower out-of-vocabulary (OOV) rate by over 42% compared to standard Google SentencePiece on code-mixed social datasets.",
                  },
                  {
                    num: "2",
                    title: "Hypothesis 2: Cross-Dialectal Representation Stability",
                    desc: "Injecting dialectal syntactic anchors during masked language modeling stabilizes F1 score on low-resource Nepali sentiment classification across varied regional dialects (Doteli, Tharu-influenced Nepali).",
                  },
                  {
                    num: "3",
                    title: "Hypothesis 3: Open-Weight Democratization",
                    desc: "Distilling DevaMix-BERT into a 14M parameter quantized mobile package enables local, zero-latency inference on low-cost Android hardware prevalent throughout rural Nepal without cellular data.",
                  },
                ].map((hyp) => (
                  <div key={hyp.num} className="flex items-start gap-3 text-xs">
                    <CheckCircle2 size={16} className="text-[#0F766E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-serif text-[0.85rem]">
                        {hyp.title}
                      </strong>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {hyp.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Methodology & Technical Architecture */}
          <div className="academic-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="headline-sm text-[#0F2042] flex items-center gap-2">
                <Cpu size={18} className="text-[#0F2042]" />
                <span>Methodology & Technical Architecture</span>
              </h3>
              <span className="font-mono text-xs text-slate-500">
                Python 3.11 • HuggingFace
              </span>
            </div>

            {/* Pipeline Architecture Schematic */}
            <div className="rounded border border-slate-200 bg-[#FAFBFD] p-5 space-y-3">
              <div className="text-center font-mono text-[0.68rem] text-slate-400 uppercase tracking-wider">
                Fig 2.1: End-to-End Processing Graph
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded border border-slate-200 bg-white p-2.5">
                  <div className="font-bold text-slate-800">Raw Corpus</div>
                  <div className="text-[0.65rem] text-slate-500">18.5K Sentences</div>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2.5">
                  <div className="font-bold text-[#0F2042]">DevaTokenizer</div>
                  <div className="text-[0.65rem] text-slate-500">Halant aware</div>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2.5">
                  <div className="font-bold text-[#9E1B32]">DevaMix-BERT</div>
                  <div className="text-[0.65rem] text-slate-500">12-Layer Transformer</div>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2.5">
                  <div className="font-bold text-[#0F766E]">Benchmark Suite</div>
                  <div className="text-[0.65rem] text-slate-500">NER, Sentiment, QA</div>
                </div>
              </div>
            </div>

            {/* 3 Step Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="space-y-1">
                <strong className="text-slate-900 block font-serif">1. Ethical Web Harvesting</strong>
                <p className="leading-relaxed text-[0.75rem]">
                  14 months of automated scrapers respecting robots.txt across Kantipur, Gorakhapatra, HamroPatro forums, and anonymized Nepali Reddit threads.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block font-serif">2. Sandhi Decomposition</strong>
                <p className="leading-relaxed text-[0.75rem]">
                  Novel rule-based pre-tokenization that unbinds grammatical agglutinations in Devanagari before applying subword merges.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block font-serif">3. Benchmark Tasks</strong>
                <p className="leading-relaxed text-[0.75rem]">
                  Evaluation across 5 low-resource benchmarks: POS-tagging, Named Entity Recognition, Code-mixed Emotion Detection, and NLI.
                </p>
              </div>
            </div>
          </div>

          {/* High-Performance Compute Infrastructure */}
          <div className="academic-card p-6 space-y-4">
            <h3 className="headline-sm text-[#0F2042] flex items-center gap-2">
              <Terminal size={18} className="text-[#0F2042]" />
              <span>High-Performance Compute Infrastructure</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 space-y-1">
                <span className="font-mono text-[0.65rem] text-slate-500 block uppercase">Compute Node</span>
                <div className="font-bold text-slate-900">4x NVIDIA A100 SXM4</div>
                <div className="text-slate-500 text-[0.7rem]">80GB HBM2e per GPU (Islington AI Cluster)</div>
              </div>

              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 space-y-1">
                <span className="font-mono text-[0.65rem] text-slate-500 block uppercase">Scheduler & Environment</span>
                <div className="font-bold text-slate-900">Slurm 23.02 / PyTorch 2.3</div>
                <div className="text-slate-500 text-[0.7rem]">CUDA 12.1 with FlashAttention-2</div>
              </div>

              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 space-y-1">
                <span className="font-mono text-[0.65rem] text-slate-500 block uppercase">Allocated Compute Budget</span>
                <div className="font-bold text-slate-900">1,200 GPU-Hours</div>
                <div className="text-[#0F766E] font-semibold text-[0.7rem]">680 hours consumed (53.3%)</div>
              </div>
            </div>
          </div>

          {/* Connected Publications & Pre-prints */}
          <div className="academic-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="headline-sm text-[#0F2042] flex items-center gap-2">
                <FileText size={18} className="text-[#9E1B32]" />
                <span>Connected Publications & Pre-prints</span>
              </h3>
              <span className="font-mono text-xs text-slate-500">
                {publications.length || 1} Indexed Manuscript
              </span>
            </div>

            <div className="rounded border border-slate-200 bg-[#FAFBFD] p-5 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill-badge pill-published">Published in IJMR Vol 6, Issue 1 (2025)</span>
                <span className="font-mono text-[0.68rem] text-slate-500">Pages 42–59 • DOI: 10.5281/ijmr.2025.060104</span>
              </div>

              <h4 className="font-serif font-bold text-base text-[#0F2042]">
                <Link
                  href={publications[0]?.id ? `/publications/${publications[0].id}` : "/publications"}
                  className="hover:underline"
                >
                  {publications[0]?.title ||
                    "Transformer-based Sentiment Analysis and Code-Mixed Dialect Parsing for Low-Resource Devanagari Script"}
                </Link>
              </h4>

              <p className="text-xs text-slate-600 line-clamp-2">
                {publications[0]?.abstract ||
                  "A foundational baseline introducing initial morphological decomposition metrics. Tested on 4,000 sentences with comparative analysis against mBERT, IndicBERT, and traditional SVM pipelines."}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-3">
                  <span>98 Citations</span>
                  <span>•</span>
                  <span>2,410 Downloads</span>
                  <span>•</span>
                  <span>8,920 Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={publications[0]?.id ? `/publications/${publications[0].id}` : "/publications"}
                    className="btn-academic-primary text-xs py-1 px-3"
                  >
                    Read Paper
                  </Link>
                  <button className="btn-academic-outline text-xs py-1 px-2.5">
                    Cite (.bib)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Open Datasets & Code */}
          <div className="academic-card p-6 space-y-4">
            <h3 className="headline-sm text-[#0F2042] flex items-center gap-2">
              <Database size={18} className="text-[#0D9488]" />
              <span>Linked Open Datasets & Code</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between text-[0.68rem] font-mono text-slate-500">
                  <span>Zenodo Dataset</span>
                  <span className="font-bold text-[#0F766E]">CC BY-NC 4.0</span>
                </div>
                <div className="font-serif font-bold text-sm text-slate-900">
                  NepalNLP-Annotated-Conversational-v2
                </div>
                <p className="text-xs text-slate-600">
                  18,500 human-annotated sentences featuring sentiment valence, emotion tags, and dialect labels verified by linguists.
                </p>
                <div className="pt-2 flex justify-between text-xs font-mono text-slate-500">
                  <span>34.2 MB • JSON / Parquet</span>
                  <a href="#" className="text-[#0F2042] font-semibold hover:underline">Download ↗</a>
                </div>
              </div>

              <div className="rounded border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between text-[0.68rem] font-mono text-slate-500">
                  <span>GitHub Repository</span>
                  <span className="font-bold text-[#0F2042]">MIT License</span>
                </div>
                <div className="font-serif font-bold text-sm text-slate-900">
                  islington-research/nepal-nlp
                </div>
                <p className="text-xs text-slate-600">
                  Official PyTorch implementation of DevaTokenizer, preprocessing pipelines, training recipes, and evaluation harnesses.
                </p>
                <div className="pt-2 flex justify-between text-xs font-mono text-slate-500">
                  <span>★ 141 stars • 35 forks</span>
                  <a href="#" className="text-[#0F2042] font-semibold hover:underline">View Repo ↗</a>
                </div>
              </div>
            </div>
          </div>

          {/* Open Funded Student Opportunity CTA (Stitch s7.png) */}
          <div id="apply-section" className="rounded-xl bg-[#0F2042] text-white p-8 space-y-6 shadow-md">
            <div className="space-y-2">
              <span className="rounded bg-[#9E1B32] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                Open Funded Student Opportunity
              </span>
              <h3 className="headline-md text-white">
                Undergraduate NLP Research Fellow
              </h3>
              <div className="text-sm font-semibold text-[#89F5E7]">
                Stipend: NPR 25,000 / month
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              The Center for Applied AI & Data Innovation (CADI) invites applications from motivated Islington College undergraduate students to join the NepalNLP initiative. You will collaborate directly with Dr. Aasha Sharma and graduate scholars on data annotation, morphological parser validation, and sarcastic nuance tagging.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t border-white/10 pt-4">
              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[0.68rem] text-slate-400">
                  Qualifications
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li>✓ 2nd or 3rd Year Computing / IT Student at Islington</li>
                  <li>✓ Proficiency in Python & regex / tokenization</li>
                  <li>✓ Native Nepali speaker with dialect sensitivity</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[0.68rem] text-slate-400">
                  Fellowship Benefits
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li>✓ Co-authorship on IJMR Volume 6 publication</li>
                  <li>✓ Direct mentorship & reference letter from PI</li>
                  <li>✓ Dedicated desk at Islington AI Lab + cluster access</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-slate-400">
                Application Deadline: June 15, 2025 • 2 Positions Available
              </span>
              <Link
                href="/opportunities"
                className="btn-academic-accent text-xs px-5 py-2"
              >
                Submit Expression of Interest
              </Link>
            </div>
          </div>
        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 space-y-6">
          {/* Principal Investigator Card */}
          <div className="academic-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Principal Investigator
              </span>
              <span className="rounded bg-[#0F2042]/10 px-2 py-0.5 text-[0.62rem] font-bold text-[#0F2042] uppercase">
                Faculty Lead
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F2042] text-base font-bold text-white uppercase">
                {leadResearcher.charAt(0)}
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0F2042]">
                  {leadResearcher}
                </h4>
                <div className="text-xs text-slate-500">
                  Associate Professor in AI & NLP
                </div>
                <div className="text-[0.68rem] text-slate-400">
                  Head of CADI Research Lab
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ph.D. in Computational Linguistics. Specializes in low-resource machine translation, dialectal syntax mapping, and speech synthesis for Himalayan languages.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <a
                href="mailto:research@islington.edu.np"
                className="btn-academic-primary w-full text-xs py-2"
              >
                Contact Supervisor
              </a>
              <Link
                href="/researchers"
                className="btn-academic-outline w-full text-xs py-2"
              >
                View Full Academic Profile
              </Link>
            </div>
          </div>

          {/* Core Research Team */}
          <div className="academic-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Research Team
              </span>
              <span className="font-mono text-[0.7rem] text-slate-500">
                {researchers.length || 4} Active Members
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: "Er. Manish Prajapati", role: "Co-Investigator • Faculty Lead", badge: "Faculty" },
                { name: "Niraj Pokhrel", role: "Lead Author • Graduate Fellow", badge: "Grad" },
                { name: "Pooja Adhikari", role: "Student Researcher • Islington BSc", badge: "Student" },
                { name: "Rohan Shrestha", role: "Student Data Engineer • BSc (Hons)", badge: "Student" },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[0.65rem] font-bold text-slate-700">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-[0.78rem]">
                        {m.name}
                      </div>
                      <div className="text-[0.68rem] text-slate-500">{m.role}</div>
                    </div>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.6rem] font-semibold text-slate-600 uppercase">
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Governance & Project Info */}
          <div className="academic-card p-6 space-y-3 text-xs">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
              Governance & Project Info
            </span>

            <dl className="divide-y divide-slate-100 space-y-2">
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500">Ethics Approval ID</dt>
                <dd className="font-mono font-medium text-slate-800">IRC-2024-013</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500">Funding Endowment</dt>
                <dd className="font-mono font-medium text-[#0F2042]">NPR 450,000 [CADI]</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500">Primary Field</dt>
                <dd className="font-medium text-slate-800">Comp. Linguistics / AI</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500">Target Venues</dt>
                <dd className="font-medium text-[#9E1B32]">IJMR Vol 6 / EMNLP 2025</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500">License Standard</dt>
                <dd className="font-medium text-slate-800">Apache 2.0 / CC-BY</dd>
              </div>
            </dl>
          </div>

          {/* Project Activity Feed */}
          <div className="academic-card p-6 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Activity Feed
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 text-[0.75rem]">
              <div className="border-l-2 border-slate-200 pl-3 space-y-0.5">
                <div className="font-semibold text-slate-800">Niraj Pokhrel pushed commit <code className="text-[#0F2042]">v0.4.2</code> tokenizer checkpoint.</div>
                <div className="text-[0.68rem] text-slate-400">12 hours ago</div>
              </div>

              <div className="border-l-2 border-slate-200 pl-3 space-y-0.5">
                <div className="font-semibold text-slate-800">Dataset <code className="text-[#0F2042]">v2.0</code> uploaded to Zenodo with 4,000 new conversational pairs.</div>
                <div className="text-[0.68rem] text-slate-400">3 days ago</div>
              </div>

              <div className="border-l-2 border-slate-200 pl-3 space-y-0.5">
                <div className="font-semibold text-slate-800">Milestone 3 Corpus Collection reviewed and signed by Dr. Aasha Sharma.</div>
                <div className="text-[0.68rem] text-slate-400">1 week ago</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <a href="#" className="text-xs font-semibold text-[#0F2042] hover:underline">
                View Audit Trail & Git Logs ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
