import {
  Calendar,
  MapPin,
  Search,
  PlusCircle,
} from "lucide-react";

export const metadata = {
  title: "Academic Events, Symposia & Research Colloquia",
  description:
    "Participate in peer-reviewed student showcases, international keynote symposia, doctoral colloquia, and hands-on methodology workshops hosted by IJMR and Islington academic labs.",
};

export default function EventsPage() {
  return (
    <div className="page-shell space-y-12">
      {/* 1. Header (Stitch reference image) */}
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-[#9E1B32] font-semibold">
          <span>•</span>
          <span>Scholarly Interchange & Public Colloquia • Academic Year 2025–2026</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="display-lg text-[#0F2042]">
              Academic Events, Symposia & Research Colloquia
            </h1>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Participate in peer-reviewed student showcases, international keynote symposia, doctoral colloquia, and hands-on methodology workshops hosted by IJMR and Islington academic labs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button type="button" className="btn-academic-primary text-xs">
              <PlusCircle size={14} />
              <span>Host Session / Proposal</span>
            </button>
            <button type="button" className="btn-academic-outline text-xs">
              <Calendar size={14} />
              <span>Sync Calendar (.ICS)</span>
            </button>
            <span className="pill-badge pill-review text-xs py-2 px-3 h-auto">
              Registered (2)
            </span>
          </div>
        </div>
      </div>

      {/* 2. 5 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Scheduled
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            24
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Events across AY 2025–26
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-[#9E1B32] block">
            Major Symposia
          </span>
          <div className="text-3xl font-bold font-serif text-[#9E1B32]">
            4
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Annual flagship gatherings
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Clinics & Labs
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F2042]">
            8
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Hands-on peer-review labs
          </span>
        </div>

        <div className="academic-card p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-slate-500 block">
            Scholars
          </span>
          <div className="text-3xl font-bold font-serif text-[#0F766E]">
            1,450+
          </div>
          <span className="text-[0.68rem] text-slate-500 block">
            Faculty & student attendees
          </span>
        </div>

        <div className="rounded border border-[#0F2042] bg-[#000922] text-white p-4 space-y-1">
          <span className="font-mono text-[0.65rem] font-bold uppercase text-[#89F5E7] block">
            Delivery Mode
          </span>
          <div className="text-lg font-bold font-serif text-white">
            100% HYBRID
          </div>
          <span className="text-[0.65rem] text-slate-400 block font-mono">
            Turing Complex + Stream
          </span>
        </div>
      </div>

      {/* 3. Flagship Annual Colloquium Spotlight Card (Stitch reference image) */}
      <div className="rounded-xl border border-slate-300 bg-white p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#9E1B32] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
              Flagship Annual Colloquium
            </span>
            <span className="rounded bg-emerald-100 text-[#065F46] px-2 py-0.5 text-[0.65rem] font-bold">
              Early Registration Open
            </span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            CONF-IJMR-2025-01
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="headline-lg text-[#0F2042] leading-snug">
              IJMR Annual Multidisciplinary Research Summit 2025: AI Infrastructure & Himalayan Socioeconomic Innovation
            </h2>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              The flagship gathering of Islington College&apos;s doctoral candidates, faculty research leads, and undergraduate innovators. Over two days, the summit examines high-performance distributed machine learning, indigenous language preservation technologies, and resilient high-altitude economic infrastructure in Nepal.
            </p>

            <div className="text-xs font-mono text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Calendar size={14} className="text-[#9E1B32]" />
                <span>Nov 14–15, 2025 (09:30 AM – 05:30 PM NPT)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={14} />
                <span>Turing Grand Auditorium & Virtual Hall A (Co-hosted with London Met Research Directorate)</span>
              </div>
            </div>

            {/* 3 Tracks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 text-xs space-y-0.5">
                <span className="font-mono text-[0.62rem] text-slate-400 uppercase block">Track 01</span>
                <div className="font-bold text-[#0F2042]">Applied AI & Nepali NLP</div>
                <div className="text-[0.68rem] text-slate-500">6 Peer-reviewed papers</div>
              </div>

              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 text-xs space-y-0.5">
                <span className="font-mono text-[0.62rem] text-slate-400 uppercase block">Track 02</span>
                <div className="font-bold text-[#0F2042]">Himalayan Climate Tech</div>
                <div className="text-[0.68rem] text-slate-500">7 Experimental studies</div>
              </div>

              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 text-xs space-y-0.5">
                <span className="font-mono text-[0.62rem] text-slate-400 uppercase block">Track 03</span>
                <div className="font-bold text-[#0F2042]">Digital Economics & ZK</div>
                <div className="text-[0.68rem] text-slate-500">5 Policy briefs + 1 demo</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" className="btn-academic-accent text-xs">
                Register for Full Summit (Complimentary)
              </button>
              <button type="button" className="btn-academic-outline text-xs">
                Call for Submissions (.PDF)
              </button>
              <button type="button" className="btn-academic-ghost text-xs">
                Save Event
              </button>
            </div>
          </div>

          {/* Right Keynotes Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded border border-slate-200 bg-[#FAFBFD] p-5 space-y-3 text-xs">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-200 pb-2">
                Featured Keynotes • Confirmed Lineup
              </span>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F2042] text-[0.65rem] font-bold text-white uppercase">
                    AS
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Dr. Aasha Sharma</div>
                    <div className="text-[0.68rem] text-slate-500">Associate Professor & CADI Lead</div>
                    <div className="text-[0.68rem] text-[#0F766E] font-serif italic">Keynote: Distributed AI in Nepal</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[0.65rem] font-bold text-white uppercase">
                    DM
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Prof. David Miller</div>
                    <div className="text-[0.68rem] text-slate-500">Visiting Chair, London Met Univ.</div>
                    <div className="text-[0.68rem] text-[#0F766E] font-serif italic">Keynote: Translational Research Ethics</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 rounded bg-[#000922] text-white p-3 text-center space-y-1">
                <div className="font-mono text-[0.65rem] text-[#89F5E7] uppercase font-bold">
                  Special Awards • NPR 100,000
                </div>
                <div className="font-serif font-bold text-xs">
                  Student Poster Pitch Challenge
                </div>
                <p className="text-[0.65rem] text-slate-400">
                  Featuring the official ceremonial print release of IJMR Volume 6, Issue 2.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter Bar & Event Cards List */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search events by topic, keynote speaker, symposium track, or lab..."
              className="w-full rounded border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-[#0F2042] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { label: "All Events", count: 24, active: true },
              { label: "Annual Symposia", count: 4, active: false },
              { label: "Methodology Workshops", count: 8, active: false },
              { label: "Paper Presentations & Defenses", count: 6, active: false },
              { label: "Keynote Lectures", count: 4, active: false },
              { label: "Grant & Fellowship Clinics", count: 2, active: false },
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
        </div>

        {/* 5 Event Cards (Stitch reference image) */}
        <div className="space-y-4">
          {[
            {
              month: "OCT",
              day: "31",
              year: "2025",
              time: "02:00 PM",
              type: "Methodology Workshop",
              badge: "Peer-Review Clinic Series",
              seats: "45/60 Seats Reserved",
              title: "Navigating Double-Blind Rebuttals & Reviewer 2 Comments",
              desc: "Practical breakdown of responding to rigorous critiques, structuring rebuttal response letters, and providing statistical appendix revisions without breaking author anonymity for IJMR and Scopus-indexed outlets.",
              lead: "Lead: Dr. Aasha Sharma & Dr. Bikash Thapa (IJMR Editorial Board) • Turing Hall Room 402 + Live Zoom Broadcast",
              tags: ["#ManuscriptWriting", "#PeerReview", "#IJMRVolume6"],
              action: "Reserve Seat",
            },
            {
              month: "NOV",
              day: "05",
              year: "2025",
              time: "02:00 PM",
              type: "Student Showcase",
              badge: "Oral Thesis Defense",
              seats: "Open for Public Academic Observation",
              title: "Undergraduate Capstone Defense: FinTech & ZK-Rollups in Bagmati Province",
              desc: "Final viva-voce examination of high-throughput zero-knowledge verifiable rollups applied to cooperative banking settlements across regional agricultural networks in Kathmandu and Bhaktapur.",
              lead: "Presenter: Niraj Pokhrel & Capstone Cohort | Chair: Dr. Rajan Karki • Turing Computing Lab 3 (Physical Seating)",
              tags: ["#FinTech", "#ZeroKnowledge", "#StudentResearch"],
              action: "Register to Attend",
            },
            {
              month: "NOV",
              day: "22",
              year: "2025",
              time: "11:00 AM",
              type: "Technical Masterclass",
              badge: "CADI Lab Series",
              seats: "Only 8 Lab Seats Remaining",
              title: "Distributed Slurm & PyTorch Acceleration on Islington A100 Clusters",
              desc: "Hands-on configuration session for junior researchers. Participants will configure Slurm batch jobs, deploy multi-GPU FSDP (Fully Sharded Data Parallel) training scripts, and run baseline inference workloads on the on-campus NVIDIA A100 testbed.",
              lead: "Host: Centre for Applied AI & Data Innovation (CADI Compute Team) • CADI High-Performance Lab (Room 406) + Virtual Shell Access",
              tags: ["#HighPerformanceComputing", "#Slurm", "#AIHardware"],
              action: "Apply for Lab Seat",
            },
            {
              month: "DEC",
              day: "04",
              year: "2025",
              time: "04:00 PM",
              type: "International Guest Lecture",
              badge: "Global Scholarly Series",
              seats: "Virtual Live Stream + Turing Amphitheatre Screening",
              title: "Cross-Lingual Natural Language Processing for Low-Resource Indo-Aryan Scripts",
              desc: "Exploring state-of-the-art token-free architectures and byte-level representations for Nepali, Maithili, and Bhojpuri. Dr. Shrestha discusses benchmark evaluation pitfalls and zero-shot transfer capabilities across Devanagari morphological variations.",
              lead: "Keynote Speaker: Dr. Hemanta Shrestha (Visiting Research Fellow, IIT Roorkee / South Asian NLP Consortium)",
              tags: ["#ComputationalLinguistics", "#Devanagari", "#NLP"],
              action: "Get Virtual Pass",
            },
            {
              month: "DEC",
              day: "18",
              year: "2025",
              time: "01:30 PM",
              type: "Funding Clinic & Matchmaking",
              badge: "IJMR Cycle 8 Grant Cohort",
              seats: "NPR 25,000/mo Fellowship Tracks",
              title: "IJMR Cycle 8 Research Grant Writing Clinic & Faculty Supervisor Matching",
              desc: "Direct 1-on-1 mentorship desk sessions. Bring your 500-word preliminary research brief to receive critique on feasibility, literature reviews, ethics committee compliance, and faculty co-advisorship pairing.",
              lead: "Organizers: Islington Academic Research Council & Student Grant Committee • Turing Innovation Hub (Physical Tables 1–12)",
              tags: ["#StudentGrants", "#Mentorship", "#Fellowships"],
              action: "Book 1-on-1 Slot",
            },
          ].map((ev) => (
            <div
              key={ev.title}
              className="academic-card p-6 flex flex-col md:flex-row items-start gap-6 hover:border-[#0F2042]"
            >
              {/* Date Box */}
              <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3 text-center min-w-24 shrink-0 font-mono">
                <div className="text-[0.68rem] text-[#9E1B32] font-bold">{ev.month}</div>
                <div className="text-3xl font-bold font-serif text-[#0F2042]">{ev.day}</div>
                <div className="text-[0.62rem] text-slate-400">{ev.time}</div>
              </div>

              {/* Content Body */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="pill-badge pill-collab text-[0.62rem]">{ev.type}</span>
                  <span className="text-[0.68rem] font-semibold text-slate-500">{ev.badge}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[0.68rem] text-[#9E1B32] font-mono font-semibold">{ev.seats}</span>
                </div>

                <h3 className="headline-sm text-[#0F2042]">
                  {ev.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ev.desc}
                </p>

                <div className="text-xs text-slate-500 pt-1">
                  {ev.lead}
                </div>

                <div className="flex flex-wrap gap-1 pt-1 font-mono text-[0.65rem] text-slate-500">
                  {ev.tags.map((t) => (
                    <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex md:flex-col items-center gap-2 w-full md:w-auto pt-2 md:pt-0">
                <button
                  type="button"
                  className="btn-academic-primary text-xs py-1.5 px-4 w-full"
                >
                  {ev.action}
                </button>
                <button
                  type="button"
                  className="btn-academic-outline text-xs py-1.5 px-3 w-full"
                >
                  View Agenda
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Host Colloquium CTA Banner (Stitch reference image) */}
      <div className="rounded-xl bg-[#0F2042] text-white p-8 md:p-10 space-y-6 shadow-md relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="rounded bg-[#9E1B32] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
            Community-Led Scholarly Convenings
          </span>
          <h2 className="headline-lg text-white">
            Host an Academic Colloquium, Masterclass, or Research Defense
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Are you an Islington faculty member, student researcher, or visiting international academic interested in hosting a methodology workshop or presenting preliminary empirical findings?
          </p>
        </div>

        {/* 3 Step Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              01
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Submit Proposal
            </div>
            <p className="text-xs text-slate-300">
              Provide a 200-word topic description, abstract, and presenter credentials.
            </p>
          </div>

          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              02
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Editorial Vetting
            </div>
            <p className="text-xs text-slate-300">
              IJMR board assigns room schedule and creates hybrid stream credentials.
            </p>
          </div>

          <div className="rounded bg-white/5 border border-white/10 p-4 space-y-1">
            <span className="font-mono text-[0.68rem] font-bold text-[#89F5E7]">
              03
            </span>
            <div className="font-serif font-bold text-sm text-white">
              Community Broadcast
            </div>
            <p className="text-xs text-slate-300">
              Event gets promoted to 1,450+ scholars with automated calendar attendance tracking.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
          <button type="button" className="btn-academic-accent text-xs">
            Submit Colloquium Proposal
          </button>
          <button
            type="button"
            className="btn-academic-outline text-xs bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white"
          >
            Review Host Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
