import Link from "next/link";
import {
  Search,
  Bookmark,
  Clock,
  CheckCircle2,
  PlusCircle,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Research Opportunities & Student Grants",
  description:
    "Explore fully funded research assistantships, faculty-led lab fellowships, undergraduate capstone sponsorships, and international conference travel stipends at Islington College.",
};

export default function OpportunitiesPage() {
  return (
    <div className="page-shell space-y-12">
      {/* 1. Header with Actions (Stitch s2.png) */}
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-[#0F766E] font-semibold">
          <span>•</span>
          <span>Institutional Grants & Fellowships • Academic Year 2025–2026 • Applications Open for Cycle II</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="display-lg text-[#0F2042]">
              Research Opportunities & Student Grants
            </h1>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Explore fully funded research assistantships, faculty-led lab fellowships, undergraduate capstone sponsorships, and international conference travel stipends administered by Islington College and the Centre for Applied AI & Data Innovation (CADI).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/researcher/publications/new"
              className="btn-academic-accent text-xs"
            >
              <PlusCircle size={14} />
              <span>Post an Opportunity</span>
            </Link>
            <button type="button" className="btn-academic-outline text-xs">
              <Bookmark size={14} />
              <span>Saved Grants (3)</span>
            </button>
            <button type="button" className="btn-academic-outline text-xs">
              <Download size={14} />
              <span>Grant Manual [PDF]</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Cycle Grant Pool
          </span>
          <div className="text-xl md:text-2xl font-bold font-serif text-[#0F2042]">
            NPR 4,250,000
          </div>
          <span className="text-[0.68rem] text-[#0F766E] block font-semibold">
            ✓ 100% Islington funded
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Funded Openings
          </span>
          <div className="text-2xl font-bold font-serif text-[#0F2042]">
            18 Active Seats
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Across 6 specialized labs
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Average Stipend
          </span>
          <div className="text-xl md:text-2xl font-bold font-serif text-[#0F2042]">
            NPR 25,000 / mo
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            + Slurm GPU compute access
          </span>
        </div>

        <div className="rounded border border-[#FFDAD6] bg-[#FFDAD6]/30 p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-[#9E1B32] block">
            Upcoming Closings
          </span>
          <div className="text-xl md:text-2xl font-bold font-serif text-[#9E1B32]">
            5 in &lt; 14 Days
          </div>
          <span className="text-[0.68rem] text-[#9E1B32] block font-semibold">
            Early submission advised
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Scholarly Output
          </span>
          <div className="text-2xl font-bold font-serif text-[#0F766E]">
            88% Co-authorship
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Fellows indexed in IJMR
          </span>
        </div>
      </div>

      {/* 3. Search & Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search opportunities by title, lab, principal investigator, research domain, or required skillset (e.g., PyTorch, NLP, Devanagari)..."
            className="w-full rounded border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-[#0F2042] focus:outline-none"
          />
        </div>

        {/* Opportunity Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { label: "All Opportunities", count: 18, active: true },
            { label: "Research Fellowships", count: 7, active: false },
            { label: "Student Grants & Stipends", count: 5, active: false },
            { label: "Thesis Sponsorships", count: 3, active: false },
            { label: "Conference Travel Grants", count: 2, active: false },
            { label: "Call for Papers", count: 1, active: false },
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
              <option>Department: All Departments (Computing, AI, Net)</option>
              <option>Computing & AI</option>
              <option>Business & Finance</option>
            </select>
            <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
              <option>Student Eligibility: All Academic Levels</option>
              <option>Year 2 Undergraduate</option>
              <option>Year 3 Final Year</option>
              <option>Postgraduate / Master</option>
            </select>
            <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
              <option>Funding Modality: All Funding Types</option>
              <option>Monthly Stipend</option>
              <option>Lump-Sum Grant</option>
            </select>
          </div>
          <select className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
            <option>Order by: Closing Soonest (Urgent)</option>
            <option>Highest Stipend</option>
            <option>Newest Posted</option>
          </select>
        </div>
      </div>

      {/* 4. Flagship Fellowship Spotlight Card (Stitch s2.png) */}
      <div className="rounded-xl border border-slate-300 bg-[#000922] text-white p-6 md:p-8 space-y-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <span className="rounded bg-[#9E1B32] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
            ★ Flagship Fellowship • Urgent (Closing in 8 Days)
          </span>
          <span className="font-mono text-xs text-slate-400">
            GRANT: PRJ-2024-002
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="headline-md text-white">
              Undergraduate NLP Research Fellow — DevaTokenizer & Morphological Parsing
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-mono">
              <span className="text-[#89F5E7]">Centre for Applied AI & Data Innovation (CADI)</span>
              <span>•</span>
              <span>Lead PI: <strong>Dr. Aasha Sharma, Ph.D.</strong></span>
              <span>•</span>
              <span className="text-amber-400">Deadline: June 20, 2025</span>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Selected candidate will develop subword vocabulary architectures optimized for Devanagari script morphology, addressing compound verb inflections in low-resource Nepali language processing. Includes co-authorship submission to IJMR Volume 6 and presentation at national AI consortiums.
            </p>

            {/* 3 Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded bg-white/5 border border-white/10 p-3 space-y-0.5">
                <span className="font-mono text-[0.62rem] text-slate-400 uppercase block">Remuneration</span>
                <div className="font-bold text-sm text-white">NPR 25,000 / month</div>
                <div className="text-[0.68rem] text-slate-400">8-Month Term Appointment</div>
              </div>
              <div className="rounded bg-white/5 border border-white/10 p-3 space-y-0.5">
                <span className="font-mono text-[0.62rem] text-slate-400 uppercase block">Lab Allocation</span>
                <div className="font-bold text-sm text-white">4x NVIDIA A100</div>
                <div className="text-[0.68rem] text-slate-400">Dedicated Slurm Queue</div>
              </div>
              <div className="rounded bg-white/5 border border-white/10 p-3 space-y-0.5">
                <span className="font-mono text-[0.62rem] text-slate-400 uppercase block">Eligibility</span>
                <div className="font-bold text-sm text-[#89F5E7]">BSc Computing Y2/Y3</div>
                <div className="text-[0.68rem] text-slate-400">or MSc Data Science</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects/nepal-nlp#apply"
                className="btn-academic-accent text-xs py-2 px-4"
              >
                Apply for Fellowship
              </Link>
              <Link
                href="/researchers/aasha-sharma"
                className="rounded bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors"
              >
                View Lab & PI Profile
              </Link>
            </div>
          </div>

          {/* Right Stack & Ethics Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded bg-white/5 border border-white/10 p-4 space-y-3 text-xs">
              <span className="font-mono text-[0.68rem] font-bold uppercase text-slate-400 block">
                Required Stack & Background
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[0.7rem]">
                {["Python 3.11+", "Hugging Face", "PyTorch", "Morphological Regex", "Devanagari NLP", "Native Nepali Speaker"].map((s) => (
                  <span key={s} className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-200">
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-start gap-2 text-[0.7rem] text-slate-300">
                <CheckCircle2 size={15} className="text-[#89F5E7] shrink-0 mt-0.5" />
                <span>Ethics Clearance #ETH-2024-CADI approved by Islington Institutional Review Board.</span>
              </div>
            </div>

            <div className="rounded bg-white/5 border border-white/10 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9E1B32] text-sm font-bold text-white uppercase">
                AS
              </div>
              <div className="text-xs">
                <strong className="text-white block font-serif">Dr. Aasha Sharma</strong>
                <span className="text-slate-400 text-[0.68rem]">CADI Research Lead • IEEE Senior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. All Active Funding Opportunities (Grid of 6 Cards - Stitch s2.png) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="headline-sm text-[#0F2042]">
              All Active Funding Opportunities
            </h3>
            <span className="text-xs text-slate-500">
              Showing 6 vetted and peer-reviewed scholarly openings across computing and allied disciplines.
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Page 1 of 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              type: "Research Assistantship",
              badgeStyle: "pill-review",
              deadline: "18 days left",
              title: "Biomedical Computer Vision Intern — Retinal Screening in Remote Himalayan Health Posts",
              lab: "Bio-Computing & Health Informatics Group",
              pi: "Dr. Bikash Thapa, Ph.D.",
              monthly: "NPR 22,000 / mo",
              duration: "4 Months • 15 hrs/wk",
              eligibility: "BSc Y3 or MSc Data Science",
              tags: ["#ComputerVision", "#MobileNetV3", "#EdgeAI", "#Healthcare"],
            },
            {
              type: "Undergraduate Seed Grant",
              badgeStyle: "pill-published",
              deadline: "July 15, 2025",
              title: "FinTech Research Grant: Zero-Knowledge Proof Rollups for Interoperable QR Payments",
              lab: "Cryptography & Distributed Systems Cluster",
              pi: "Dr. Rajan Karki",
              monthly: "NPR 150,000 Lump-sum",
              duration: "Academic Year 2025 Capstone",
              eligibility: "Final Year Undergrad Dialect",
              tags: ["#ZKProofs", "#Blockchain", "#FinTechNepal", "#SmartContracts"],
            },
            {
              type: "Industry Fellowship",
              badgeStyle: "pill-collab",
              deadline: "June 30, 2025",
              title: "IoT & Environmental Sensing Fellow — Acoustic Turbine Cavitation Wear Detection",
              lab: "Robotics & Cleantech Initiative",
              pi: "Prof. Pradeep Regmi (w/ HydroTech NP)",
              monthly: "NPR 20,000 / mo",
              duration: "6 Months • Lab & Telemetry",
              eligibility: "Custom DSP Kit Provided",
              tags: ["#AcousticSensors", "#SignalDSP", "#EdgeAI", "#HydroPower"],
            },
            {
              type: "Research Assistantship",
              badgeStyle: "pill-review",
              deadline: "July 10, 2025",
              title: "Legal Informatics Student Fellow: Automated Precedent Extraction in Nepali Civil Code",
              lab: "LegalTech & Policy Analysis Circle",
              pi: "Adv. Sandesh Manandhar, LL.M.",
              monthly: "NPR 20,000 / mo",
              duration: "3 Months • Flexible",
              eligibility: "Computing or Law Students",
              tags: ["#LegalNLP", "#NepalLaw", "#InformationRetrieval", "#Bilingual"],
            },
            {
              type: "Travel & Publication Grant",
              badgeStyle: "pill-published",
              deadline: "Rolling Review",
              title: "IJMR International Conference Travel & Registration Grant — EMNLP & ICET 2025",
              lab: "Islington Research Fund & London Met Partnership",
              pi: "Chair: Academic Research Council",
              monthly: "Up to NPR 180,000",
              duration: "Flight, Hotel & Registration",
              eligibility: "Accepted 1st-Author Paper",
              tags: ["#ConferenceGrant", "#PeerReviewed", "#GlobalDissemination"],
            },
            {
              type: "Journal Call for Papers",
              badgeStyle: "pill-teal",
              deadline: "Oct 31, 2025",
              title: "Special Issue: Multidisciplinary AI for Himalayan Socioeconomic Challenges",
              lab: "IJMR Volume 6, Issue 2 • Peer-Reviewed",
              pi: "Editors: Dr. Aasha Sharma, Dr. Bikash Thapa",
              monthly: "100% APC Waiver",
              duration: "Fast-track 21 Day Turnaround",
              eligibility: "DOAJ & Google Scholar",
              tags: ["#CallForPapers", "#IJMRVol6", "#FastTrack", "#OpenAccess"],
            },
          ].map((opp) => (
            <div
              key={opp.title}
              className="academic-card p-6 flex flex-col justify-between space-y-4 hover:border-[#0F2042]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[0.68rem]">
                  <span className={`pill-badge ${opp.badgeStyle} text-[0.62rem]`}>
                    {opp.type}
                  </span>
                  <span className="font-mono text-slate-500">{opp.deadline}</span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#0F2042] line-clamp-2 leading-snug">
                  {opp.title}
                </h4>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <div className="font-medium text-slate-800 text-[0.75rem]">{opp.lab}</div>
                  <div className="text-slate-500 text-[0.7rem]">{opp.pi}</div>
                </div>

                <div className="rounded bg-slate-50 p-3 text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grant / Stipend:</span>
                    <strong className="text-[#0F2042]">{opp.monthly}</strong>
                  </div>
                  <div className="flex justify-between text-[0.68rem] text-slate-500">
                    <span>Duration:</span>
                    <span>{opp.duration}</span>
                  </div>
                  <div className="flex justify-between text-[0.68rem] text-slate-500">
                    <span>Eligibility:</span>
                    <span>{opp.eligibility}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 font-mono text-[0.62rem] text-slate-500">
                  {opp.tags.map((t) => (
                    <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href="/projects"
                  className="btn-academic-primary text-xs py-1 px-3 flex-1 text-center"
                >
                  View & Apply →
                </Link>
                <button
                  type="button"
                  className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title="Bookmark"
                >
                  <Bookmark size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Grant Application & Award Roadmap (4 Steps - Stitch s2.png) */}
      <div className="academic-card p-6 md:p-8 space-y-6 bg-[#FAFBFD]">
        <div className="space-y-1">
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
            Applicant Lifecycle
          </span>
          <h3 className="headline-sm text-[#0F2042]">
            Grant Application & Award Roadmap
          </h3>
          <p className="text-xs md:text-sm text-slate-600">
            A clear 4-step path designed to guide undergraduate and postgraduate researchers from proposal conception to laboratory onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            {
              num: "01",
              title: "Browse & Match",
              desc: "Explore lab priorities, review published manuscripts by prospective faculty PIs in the IJMR archive, and verify prerequisite technical proficiencies.",
              footnote: "✓ Lab Affiliation Matching",
            },
            {
              num: "02",
              title: "Draft 500-Word Proposal",
              desc: "Articulate research innovation, alignment with Islington College strategic research themes, proposed experimental methodology, and timeline.",
              footnote: "✓ Proposal Template (.DOCX)",
            },
            {
              num: "03",
              title: "PI Interview & IRB",
              desc: "Attend a 20-minute technical discussion with the lab supervisor, clarify responsibilities, and complete the Islington Institutional Review Board ethics questionnaire.",
              footnote: "✓ Fast 7-Day Review",
            },
            {
              num: "04",
              title: "Onboarding & Compute",
              desc: "Disbursal of initial stipend tranche, issuance of Islington AI Cluster (Slurm) credentials, Turing Lab dedicated workspace allocation, and mentor kickoff.",
              footnote: "✓ Access in 48 Hours",
            },
          ].map((st) => (
            <div key={st.num} className="rounded border border-slate-200 bg-white p-5 space-y-2 flex flex-col justify-between shadow-xs">
              <div className="space-y-1.5">
                <span className="font-mono text-base font-bold text-[#0F2042]">
                  {st.num}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#0F2042]">
                  {st.title}
                </h4>
                <p className="text-slate-600 leading-relaxed text-[0.75rem]">
                  {st.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[0.68rem] text-[#0D9488] font-semibold">
                {st.footnote}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Student Grant Mentorship Clinic CTA (Stitch s2.png) */}
      <div className="rounded-xl bg-[#0F2042] text-white p-8 md:p-10 space-y-6 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <span className="font-mono text-xs text-[#89F5E7] uppercase font-bold tracking-wider">
            Student Grant Mentorship Program
          </span>
          <h2 className="headline-md text-white">
            Need assistance drafting your first academic research grant proposal?
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Book an individual 30-minute consultation with an IJMR editorial reviewer or join our walk-in Grant Writing Clinic held every Wednesday from 3:00 PM to 5:00 PM in Turing Room 402. We assist with literature review framing, methodology design, and budget justification.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button type="button" className="btn-academic-accent text-xs">
              Book Grant Clinic Session
            </button>
            <Link
              href="/researchers"
              className="rounded bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              Explore Faculty Supervisors
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white/10 border border-white/20 p-5 space-y-3 text-xs shrink-0 w-full lg:w-80">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-[0.68rem] uppercase font-bold">
            <Clock size={14} />
            <span>Next Open Clinic: Wednesday, 3:00 PM NPT</span>
          </div>
          <div className="text-slate-200 text-xs space-y-1">
            <p>📍 Turing Room 402, Islington Computing Block</p>
            <p>👥 Hosted by CADI & IJMR Student Advisory</p>
            <p>📝 Peer reviews on proposal drafts provided</p>
          </div>
          <div className="pt-2 border-t border-white/10 text-[0.7rem] text-slate-300 font-mono">
            Free for all registered students
          </div>
        </div>
      </div>
    </div>
  );
}
