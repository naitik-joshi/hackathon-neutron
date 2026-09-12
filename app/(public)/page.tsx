import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Share2,
  FileText,
  Search,
  CheckCircle2,
  Cpu,
  Database,
  ShieldAlert,
  TrendingUp,
  Code2,
  Users,
  Compass,
  GitBranch,
  Upload,
  Globe,
  Calendar,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listPublications } from "@/features/research/queries";

export default async function Home() {
  const configured = isSupabaseConfigured();
  const publications = configured
    ? await listPublications("", 4)
    : [];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Narrative Column */}
            <div className="lg:col-span-8 space-y-6">
              <h1 className="display-lg text-[#0F2042]">
                From Publishing Research to Powering Research.
              </h1>
              <p className="text-base md:text-lg text-[#45464E] max-w-2xl leading-relaxed">
                Explore peer-reviewed publications, connect with faculty and student
                researchers, collaborate on groundbreaking interdisciplinary projects,
                and turn academic curiosity into community impact.
              </p>
            </div>

            {/* Right Action CTAs */}
            <div className="lg:col-span-4 flex flex-col gap-3 pt-2">
              <Link
                href="/research"
                className="btn-academic-primary justify-between shadow-sm"
              >
                <span>Explore Research Directory</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/researchers"
                className="btn-academic-outline justify-between"
              >
                <span>Join Research Community</span>
                <Users size={16} />
              </Link>
              <Link
                href="/researcher/publications/new"
                className="btn-academic-accent justify-between shadow-sm"
              >
                <span>Submit Manuscript (Vol 6.2)</span>
                <FileText size={16} />
              </Link>
            </div>
          </div>

          {/* Unified Scholarly Search Box */}
          <div className="mt-10 rounded-lg border border-[#CBD5E1] bg-[#FAFBFD] p-3 md:p-4 shadow-sm">
            {/* Scope Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {[
                { label: "All", href: "/publications", active: true },
                { label: "Research Papers", href: "/publications", active: false },
                { label: "Researchers", href: "/researchers", active: false },
                { label: "Projects", href: "/projects", active: false },
                { label: "Datasets", href: "/publications", active: false },
              ].map((scope) => (
                <Link
                  key={scope.label}
                  href={scope.href}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    scope.active
                      ? "bg-[#0F2042] text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {scope.label}
                </Link>
              ))}
            </div>

            {/* Search Input Bar */}
            <form action="/publications" method="GET" className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="q"
                  placeholder="Search by title, author, keyword (e.g., 'Natural Language Processing for Nepali Dialects')..."
                  className="w-full rounded border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F2042] focus:outline-none focus:ring-2 focus:ring-[#0F2042]/10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  name="discipline"
                  className="rounded border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#0F2042] focus:outline-none"
                >
                  <option value="">Filter by Subject Area</option>
                  <option value="ai">Computing & AI</option>
                  <option value="data">Data Science & Analytics</option>
                  <option value="fintech">Business & FinTech</option>
                  <option value="iot">IoT & Embedded Systems</option>
                </select>

                <button
                  type="submit"
                  className="btn-academic-primary px-5 text-xs font-bold uppercase tracking-wider"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Suggested Keywords */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-bold tracking-wider uppercase text-[0.68rem] text-slate-400">
                Suggested Keywords:
              </span>
              {["#Nepali NLP", "#Edge AI", "#Tourism Analytics", "#Distributed Systems", "#Sustainable Tech"].map((tag) => (
                <Link
                  key={tag}
                  href={`/publications?q=${encodeURIComponent(tag.replace("#", ""))}`}
                  className="rounded bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-[#0F2042] hover:border-slate-300 font-mono text-[0.7rem]"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCHOLARLY IMPACT METRIC RIBBON */}
      <section className="bg-[#000922] text-white py-8 border-y border-slate-800">
        <div className="page-shell py-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-3 md:pt-0 md:pr-4">
              <div className="text-3xl lg:text-4xl font-bold font-serif text-[#89F5E7]">
                480+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Peer-Reviewed Papers
              </div>
              <div className="text-[0.68rem] text-slate-400">
                Scopus & DOAJ Indexed
              </div>
            </div>

            <div className="pt-3 md:pt-0 md:px-4">
              <div className="text-3xl lg:text-4xl font-bold font-serif text-white">
                120+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Faculty & Student Fellows
              </div>
              <div className="text-[0.68rem] text-slate-400">
                Active Academic Contributors
              </div>
            </div>

            <div className="pt-3 md:pt-0 md:px-4">
              <div className="text-3xl lg:text-4xl font-bold font-serif text-[#FFB3B5]">
                42
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Collaborative Projects
              </div>
              <div className="text-[0.68rem] text-slate-400">
                Cross-disciplinary squads
              </div>
            </div>

            <div className="pt-3 md:pt-0 md:px-4">
              <div className="text-3xl lg:text-4xl font-bold font-serif text-white">
                8
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Multidisciplinary Labs
              </div>
              <div className="text-[0.68rem] text-slate-400">
                AI, IoT, FinTech & Security
              </div>
            </div>

            <div className="pt-3 md:pt-0 md:pl-4">
              <div className="text-3xl lg:text-4xl font-bold font-serif text-[#6BD8CB]">
                94K+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                Worldwide Downloads
              </div>
              <div className="text-[0.68rem] text-slate-400">
                In 80+ academic bodies
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCHOLARLY HIGHLIGHTS / FEATURED PUBLICATIONS */}
      <section className="page-shell space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E1B32]">
              01 / SCHOLARLY HIGHLIGHTS • Volume 6, Issue 1
            </span>
            <h2 className="headline-lg text-[#0F2042] mt-1">
              Featured Peer-Reviewed Publications
            </h2>
          </div>
          <Link
            href="/publications"
            className="text-xs font-bold text-[#0F2042] hover:text-[#9E1B32] inline-flex items-center gap-1"
          >
            <span>View complete archive</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Large Hero Featured Manuscript Card */}
        <div className="academic-card p-6 md:p-8 bg-white border border-slate-200 hover:border-slate-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill-badge pill-review">Editor&apos;s Choice</span>
                <span className="pill-badge pill-published">Peer Reviewed</span>
                <span className="pill-badge pill-teal">Open Access</span>
                <span className="font-mono text-[0.7rem] text-slate-500">
                  Vol. 6, Iss. 1 (2025)
                </span>
              </div>

              <h3 className="headline-md text-[#0F2042] leading-snug">
                <Link
                  href={publications[0]?.id ? `/publications/${publications[0].id}` : "/publications"}
                  className="hover:text-[#9E1B32] transition-colors"
                >
                  {publications[0]?.title ||
                    "Transformer-based Sentiment Analysis and Code-Mixed Dialect Parsing for Low-Resource Devanagari Script"}
                </Link>
              </h3>

              <div className="text-xs text-slate-600">
                <strong className="text-slate-900">
                  Dr. Aasha Sharma, Roshan K. Shrestha, Er. Manish Prajapati
                </strong>{" "}
                • Dept. of Computing & Artificial Intelligence
              </div>

              <p className="body-editorial text-sm text-slate-700 line-clamp-3">
                {publications[0]?.abstract ||
                  "Societal discourse across Nepali digital spheres exhibits profound Romanized-Devanagari code-mixing with colloquial syntactic variations. This research presents a fine-tuned mBERT and RoBERTa hybrid architecture benchmarked against the novel DevaTokenizer model, yielding an 18.2% acceleration in inference throughput."}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span>DOI: 10.5281/ijmr.2024.104</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-800">98 Citations</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                    title="Bookmark"
                  >
                    <Bookmark size={15} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                    title="Share"
                  >
                    <Share2 size={15} />
                  </button>
                  <Link
                    href={publications[0]?.id ? `/publications/${publications[0].id}` : "/publications"}
                    className="btn-academic-primary text-xs py-1.5 px-3"
                  >
                    <FileText size={14} />
                    <span>PDF (2.4 MB)</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: Ledger & Verification Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-4 text-xs space-y-3">
                <div className="aspect-video w-full rounded bg-slate-900 text-slate-300 p-4 flex flex-col justify-between overflow-hidden relative">
                  <div className="flex justify-between items-center text-[0.68rem] font-mono text-slate-400">
                    <span>DevaTokenizer-Pipeline v2.1</span>
                    <span className="text-[#89F5E7]">LIVE VERIFIED</span>
                  </div>
                  <div className="text-center my-auto">
                    <div className="font-mono text-2xl font-bold text-white tracking-widest">
                      1.2M
                    </div>
                    <div className="text-[0.65rem] tracking-wider uppercase text-slate-400">
                      Corpus Size / Slurm Tested
                    </div>
                  </div>
                  <div className="text-[0.65rem] font-mono text-slate-400 truncate">
                    Node: a100-sxm4-node-01 • Loss: 0.0182
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-2">
                  <div className="flex justify-between font-mono text-[0.7rem]">
                    <span className="text-slate-500">PEER REVIEW LEDGER:</span>
                    <span className="font-bold text-[#0F766E]">Unanimous Accept</span>
                  </div>
                  <div className="flex justify-between text-[0.7rem] text-slate-600">
                    <span>Double-Blind Rounds:</span>
                    <span className="font-semibold">2 Cycles</span>
                  </div>
                  <div className="flex justify-between text-[0.7rem] text-slate-600">
                    <span>Reviewers:</span>
                    <span>3 Independent Faculty</span>
                  </div>
                  <div className="flex justify-between text-[0.7rem] text-slate-600">
                    <span>Replication Artifacts:</span>
                    <span className="text-[#0F2042] font-semibold">Available on GitHub</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Sub-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="academic-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[0.68rem] font-semibold text-slate-500">
                <span className="text-[#1746A2]">Engineering & Tech</span>
                <span>Mar 2025</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0F2042] line-clamp-2">
                Decentralized Microgrid Energy Trading using Smart Contracts in Peri-Urban Kathmandu
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                Simulating dynamic peer-to-peer renewable solar transaction nodes on Ethereum Layer-2 rollups with low latency.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[0.7rem]">9 Citations</span>
              <Link href="/publications" className="font-semibold text-[#0F2042] hover:underline">
                Read →
              </Link>
            </div>
          </div>

          <div className="academic-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[0.68rem] font-semibold text-slate-500">
                <span className="text-[#9E1B32]">Business & FinTech</span>
                <span>Feb 2025</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0F2042] line-clamp-2">
                Impact of Digital Wallet Adoption on Small-Scale Retail Merchants in Bagmati Province
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                Empirical assessment examining financial inclusion, QR settlement liquidity cycles, and micro-loan eligibility barriers.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[0.7rem]">14 Citations</span>
              <Link href="/publications" className="font-semibold text-[#0F2042] hover:underline">
                Read →
              </Link>
            </div>
          </div>

          <div className="academic-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[0.68rem] font-semibold text-slate-500">
                <span className="text-[#0D9488]">Applied AI</span>
                <span>Jan 2025</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0F2042] line-clamp-2">
                Edge-Optimized Vision Models for Crop Disease Detection in High-Altitude Himalayan Agriculture
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                Quantized MobileNetV3 architectures deployed on low-power edge gateways providing offline real-time foliar blight recognition.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[0.7rem]">23 Citations</span>
              <Link href="/publications" className="font-semibold text-[#0F2042] hover:underline">
                Read →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPECIALIZED RESEARCH DOMAINS */}
      <section className="page-shell space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              02 / DISCIPLINES
            </span>
            <h2 className="headline-lg text-[#0F2042] mt-1">
              Specialized Research Domains
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Cross-pollinating technical rigor with contextual socioeconomic inquiry.
            </p>
          </div>
          <Link
            href="/research"
            className="text-xs font-bold text-[#0F2042] hover:text-[#0D9488] inline-flex items-center gap-1"
          >
            <span>All faculties</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Computing & Artificial Intelligence",
              desc: "Low-resource language processing, edge neural networks, multimodal vision models, and ethical algorithmic auditing.",
              papers: 142,
              projects: 18,
              icon: Cpu,
              slug: "computing-ai",
            },
            {
              title: "Data Science & Predictive Analytics",
              desc: "Urban spatial analytics, macroeconomic trend forecasting, public health models, and real-time census informatics.",
              papers: 84,
              projects: 12,
              icon: Database,
              slug: "data-science",
            },
            {
              title: "Cybersecurity & Digital Forensics",
              desc: "Critical infrastructure protection, malware reverse-engineering, zero-trust protocols, and cryptographic resilience.",
              papers: 54,
              projects: 7,
              icon: ShieldAlert,
              slug: "cybersecurity",
            },
            {
              title: "Business Analytics & FinTech",
              desc: "Interoperable payment rails, digital remittance models, SME micro-finance sustainability, and consumer behavioural economics.",
              papers: 72,
              projects: 9,
              icon: TrendingUp,
              slug: "fintech",
            },
            {
              title: "Software Engineering & Systems",
              desc: "Fault-tolerant distributed microservices, formal verification of consensus engines, and developer tooling automation.",
              papers: 65,
              projects: 11,
              icon: Code2,
              slug: "software-engineering",
            },
            {
              title: "Human-Computer Interaction & EdTech",
              desc: "Accessible digital interfaces for multilingual communities, gamified immersive learning, and cognitive workload testing.",
              papers: 49,
              projects: 6,
              icon: Users,
              slug: "hci-edtech",
            },
          ].map((domain) => {
            const Icon = domain.icon;
            return (
              <Link
                key={domain.title}
                href={`/research/${domain.slug}`}
                className="academic-card p-6 space-y-4 hover:border-[#0F2042] flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded bg-[#EFF4FF] text-[#0F2042] flex items-center justify-center group-hover:bg-[#0F2042] group-hover:text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#0F2042] group-hover:text-[#1746A2]">
                    {domain.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{domain.papers} Papers</span>
                  <span className="text-[#0D9488] font-semibold">{domain.projects} Live Projects</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. HOW THE IJMR RESEARCH ECOSYSTEM WORKS */}
      <section className="page-shell space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F2042]">
            03 / THE METHODOLOGY
          </span>
          <h2 className="headline-lg text-[#0F2042]">
            How the IJMR Research Ecosystem Works
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            A transparent 5-stage pipeline bridging classroom discovery with international peer-reviewed publication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              stage: "STAGE 01",
              title: "Discover",
              desc: "Survey literature, access past IJMR datasets, and pinpoint active research gaps across local and global paradigms.",
              cta: "Repository Open",
              icon: Compass,
            },
            {
              stage: "STAGE 02",
              title: "Connect",
              desc: "Find mentors, match with senior faculty supervisors, and recruit co-authors among Islington undergraduate fellows.",
              cta: "Faculty Office Hours",
              icon: Users,
            },
            {
              stage: "STAGE 03",
              title: "Collaborate",
              desc: "Conduct lab trials, assemble codebases in shared repositories, and draft formal pre-prints with institutional compute grants.",
              cta: "Compute Clusters",
              icon: GitBranch,
            },
            {
              stage: "STAGE 04",
              title: "Publish",
              desc: "Submit to double-blind peer review, revise under advisory feedback, and earn formal citable DOI indexing.",
              cta: "Open Access CC-BY",
              icon: Upload,
            },
            {
              stage: "STAGE 05",
              title: "Impact",
              desc: "Translate findings into commercial spinoffs, public policy whitepapers, or keynote talks at international symposiums.",
              cta: "Global Outreach",
              icon: Globe,
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stage}
                className="rounded border border-slate-200 bg-white p-5 space-y-3 relative flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[0.65rem] font-mono font-bold text-[#9E1B32]">
                    <span>{step.stage}</span>
                    <Icon size={14} className="text-slate-400" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#0F2042]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[0.7rem] font-semibold text-[#0D9488]">
                  ✓ {step.cta}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. UNDERGRADUATE GRANTS & MATCHMAKING CALLOUT BANNER */}
      <section className="page-shell">
        <div className="rounded-lg bg-gradient-to-r from-[#0F2042] via-[#000922] to-[#0F2042] p-8 md:p-10 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="rounded bg-[#9E1B32] px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider uppercase text-white">
              Applications Now Open
            </span>
            <h3 className="headline-md text-white">
              Undergraduate Research Grants & Faculty Supervisor Matching — Fall 2025
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              NPR 150,000 project stipends available for high-impact proposals in Nepali AI, Urban Mobility, and Green FinTech. Co-authored by Islington faculty mentors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/opportunities"
              className="btn-academic-accent text-xs px-5 py-2.5"
            >
              Apply for Grants
            </Link>
            <Link
              href="/researchers"
              className="rounded bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 text-xs font-semibold text-white transition-colors"
            >
              Browse Supervisors
            </Link>
          </div>
        </div>
      </section>

      {/* 7. DUAL ACTIVITY STREAM & ACADEMIC EVENTS */}
      <section className="page-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Live Institutional Activity Stream */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0D9488] animate-pulse" />
                <h3 className="font-serif font-bold text-lg text-[#0F2042]">
                  Live Institutional Activity Stream
                </h3>
              </div>
              <span className="text-[0.68rem] font-mono text-slate-400">
                Real-time submissions & reviews
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Manuscript Accepted for Publication",
                  body: '"Evaluating Thermal Micro-Climates in Historical Patan Using UAV-Mounted Multispectral Sensors"',
                  author: "S. Manandhar • assigned to Vol 6, Iss 2",
                  time: "14 mins ago",
                  icon: CheckCircle2,
                  color: "text-[#0F766E]",
                },
                {
                  title: "Peer Review Stage Completed",
                  body: '"Zero-Trust Access Architecture for Hybrid Banking Clouds in Developing Financial Ecosystems"',
                  author: "Reviewers: 2/2 submitted • Status: Minor Revisions Requested",
                  time: "2 hours ago",
                  icon: FileText,
                  color: "text-[#9E1B32]",
                },
                {
                  title: "Open Academic Dataset Published",
                  body: '"Kathmandu Metropolitan Air Quality Time-Series Benchmark (Oct 2023 - Jan 2025)"',
                  author: "Contributor: Environmental IoT Research Group • Download CSV (48MB)",
                  time: "5 hours ago",
                  icon: Database,
                  color: "text-[#0D9488]",
                },
                {
                  title: "New Lab Squad Formed",
                  body: "Project Himalayan-GenAI: Evaluating Llama-3 Fine-Tuning for Maithili and Newari Low-Resource Scripts",
                  author: "Lead: Prof. Dr. M. R. Bajracharya + 4 Student Co-Investigators",
                  time: "Yesterday",
                  icon: Users,
                  color: "text-[#0F2042]",
                },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div
                    key={i}
                    className="rounded border border-slate-200 bg-white p-4 space-y-1 hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${act.color} flex items-center gap-1.5`}>
                        <Icon size={14} />
                        <span>{act.title}</span>
                      </span>
                      <span className="font-mono text-[0.68rem] text-slate-400">{act.time}</span>
                    </div>
                    <p className="font-serif text-sm font-semibold text-slate-900 pt-1">
                      {act.body}
                    </p>
                    <p className="text-xs text-slate-500">{act.author}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Academic Events */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0F2042]">
                Academic Events
              </h3>
              <Link href="/events" className="text-xs font-semibold text-[#0F2042] hover:underline">
                All Seminars →
              </Link>
            </div>

            {/* Featured Summit Card */}
            <div className="rounded-lg bg-[#0F2042] text-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded bg-[#9E1B32] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                  Keynote Colloquium
                </span>
                <span className="text-[0.68rem] font-mono text-slate-400">Nov 14–15, 2025</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-lg text-white">
                  IJMR Annual Multidisciplinary Research Summit 2025
                </h4>
                <p className="text-xs text-slate-300">
                  &quot;AI Frontiers in South Asia: Ethics, Infrastructure, and Local Impact.&quot; Featuring guest addresses from Oxford & Kathmandu University professors.
                </p>
              </div>

              <div className="text-[0.7rem] text-slate-300 flex items-center gap-2">
                <Calendar size={13} className="text-[#89F5E7]" />
                <span>Islington Conference Hall & Virtual Broadcast</span>
              </div>

              <Link
                href="/events"
                className="btn-academic-accent w-full text-xs py-2"
              >
                Register for Attendance
              </Link>
            </div>

            {/* Upcoming Micro Events */}
            <div className="space-y-2">
              <div className="rounded border border-slate-200 bg-white p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-slate-100 px-2 py-1 text-center font-mono text-[0.68rem]">
                    <div className="text-slate-400">MAY</div>
                    <div className="font-bold text-slate-800">18</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      Methodology Workshop: Rigorous Double-Blind Rebuttals
                    </div>
                    <div className="text-[0.68rem] text-slate-500">3:00 PM • Islington Lab 3</div>
                  </div>
                </div>
                <Link href="/events" className="text-[#0F2042] font-semibold hover:underline">
                  RSVP
                </Link>
              </div>

              <div className="rounded border border-slate-200 bg-white p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-slate-100 px-2 py-1 text-center font-mono text-[0.68rem]">
                    <div className="text-slate-400">MAY</div>
                    <div className="font-bold text-slate-800">25</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      Student Pre-defense Pitch: FinTech & Blockchain
                    </div>
                    <div className="text-[0.68rem] text-slate-500">1:30 PM • Auditorium B</div>
                  </div>
                </div>
                <Link href="/events" className="text-[#0F2042] font-semibold hover:underline">
                  RSVP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
