import Link from "next/link";
import {
  Inbox,
  Search,
  ExternalLink,
  Mail,
  User,
  Calendar,
  Info,
  ShieldCheck,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guards";
import { getEnrichedInterestInbox } from "@/features/participation/queries";

export const metadata = {
  title: "Project Interest Inbox | IJMR Admin",
  description: "Institutional repository of student research project applications and participation requests.",
};

export default async function AdminInterestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole(["admin"]);
  const { q = "" } = await searchParams;

  const allInterests = await getEnrichedInterestInbox();

  // In-memory filter for search query
  const queryLower = q.trim().toLowerCase();
  const filteredInterests = queryLower
    ? allInterests.filter(
        (i) =>
          i.contact_email.toLowerCase().includes(queryLower) ||
          i.message.toLowerCase().includes(queryLower) ||
          i.project?.title.toLowerCase().includes(queryLower) ||
          i.student?.display_name.toLowerCase().includes(queryLower),
      )
    : allInterests;

  const totalInquiries = allInterests.length;
  const uniqueProjects = new Set(allInterests.map((i) => i.project_id)).size;
  const uniqueStudents = new Set(allInterests.map((i) => i.student_id)).size;
  const demoInquiries = allInterests.filter((i) => i.is_demo).length;

  return (
    <div className="page-shell space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/admin" className="hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-slate-800">Project Interest Inbox</li>
        </ol>
      </nav>

      {/* Header & Operational Summary */}
      <section className="academic-card p-6 md:p-8 space-y-6 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-slate-900 text-white">
              <Inbox size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.68rem] uppercase font-bold tracking-wider text-slate-500">
                  Student Participation Ledger
                </span>
                <span className="pill-badge pill-review text-xs font-semibold">
                  Admin Only
                </span>
              </div>
              <h1 className="headline-lg text-[#0F2042] mt-0.5">
                Project Interest & Participation Inbox
              </h1>
            </div>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Confidential institutional records of student applications, research queries, and collaboration inquiries across Islington College R&D initiatives. Review candidate proposals and coordinate directly with applicants.
        </p>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3.5">
            <span className="text-slate-500 text-[0.65rem] font-mono uppercase block">
              Total Inquiries
            </span>
            <div className="font-serif text-2xl font-bold text-[#0F2042] mt-1">
              {totalInquiries}
            </div>
            <span className="text-[0.65rem] text-slate-400 font-mono">
              Recorded in ledger
            </span>
          </div>

          <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3.5">
            <span className="text-slate-500 text-[0.65rem] font-mono uppercase block">
              Active Projects
            </span>
            <div className="font-serif text-2xl font-bold text-[#0F766E] mt-1">
              {uniqueProjects}
            </div>
            <span className="text-[0.65rem] text-slate-400 font-mono">
              Targeted research hubs
            </span>
          </div>

          <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3.5">
            <span className="text-slate-500 text-[0.65rem] font-mono uppercase block">
              Student Applicants
            </span>
            <div className="font-serif text-2xl font-bold text-[#0F2042] mt-1">
              {uniqueStudents}
            </div>
            <span className="text-[0.65rem] text-slate-400 font-mono">
              Unique student accounts
            </span>
          </div>

          <div className="rounded border border-slate-200 bg-[#FAFBFD] p-3.5">
            <span className="text-slate-500 text-[0.65rem] font-mono uppercase block">
              Demo Test Records
            </span>
            <div className="font-serif text-2xl font-bold text-amber-800 mt-1">
              {demoInquiries}
            </div>
            <span className="text-[0.65rem] text-amber-700/80 font-mono">
              {demoInquiries === 1 ? "Sample submission" : "Sample submissions"}
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form
          method="GET"
          action="/admin/interests"
          className="relative flex-1 max-w-md"
        >
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search candidate, email, project, or keyword..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800"
          />
        </form>

        {q && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Filtering by: <strong className="text-slate-800 font-mono">&ldquo;{q}&rdquo;</strong>
            </span>
            <Link
              href="/admin/interests"
              className="text-xs text-[#0F2042] font-semibold hover:underline"
            >
              Clear filter
            </Link>
          </div>
        )}
      </div>

      {/* Main Inquiries Feed */}
      {filteredInterests.length === 0 ? (
        <div className="academic-card p-10 text-center space-y-3">
          <Inbox className="w-9 h-9 text-slate-300 mx-auto" />
          <h2 className="headline-sm text-slate-800">
            {q ? "No Matching Interest Records" : "Inbox Is Currently Empty"}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {q
              ? "No student applications matched your search terms. Try searching by applicant name, contact email, or project title."
              : "No student project interests have been submitted yet. When students express interest in research projects, their applications will be logged here."}
          </p>
          {q && (
            <div className="pt-2">
              <Link href="/admin/interests" className="btn-academic-outline text-xs">
                View All Inquiries
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterests.map((interest) => {
            const isDemo =
              interest.is_demo ||
              interest.message.includes("DEMO DATA") ||
              interest.contact_email.includes("demo");

            const cleanProjectTitle = interest.project?.title
              ? interest.project.title.replace(/^DEMO DATA\s*[—–-]\s*/, "")
              : "Unassigned Research Project";

            return (
              <article
                key={interest.id}
                className="academic-card p-5 md:p-6 space-y-4 bg-white hover:border-slate-300 transition-colors"
              >
                {/* Inquiry Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.68rem] text-slate-400 uppercase font-semibold">
                        Affiliated Project:
                      </span>
                      {interest.project?.slug ? (
                        <Link
                          href={`/projects/${interest.project.slug}`}
                          className="font-serif font-semibold text-slate-900 hover:text-[#0F2042] hover:underline inline-flex items-center gap-1 text-sm md:text-base"
                        >
                          <span>{cleanProjectTitle}</span>
                          <ExternalLink size={13} className="text-slate-400 shrink-0" />
                        </Link>
                      ) : (
                        <span className="font-serif font-semibold text-slate-900 text-sm md:text-base">
                          {cleanProjectTitle}
                        </span>
                      )}
                      {isDemo && (
                        <span className="pill-badge pill-collab text-[0.62rem]">
                          DEMO DATA
                        </span>
                      )}
                    </div>
                  </div>

                  <time
                    dateTime={interest.created_at}
                    className="flex items-center gap-1.5 text-xs font-mono text-slate-500"
                  >
                    <Calendar size={13} className="text-slate-400" />
                    <span>
                      {new Date(interest.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </time>
                </div>

                {/* Candidate & Contact Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAFBFD] p-3 rounded border border-slate-200">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400 shrink-0" />
                    <span className="text-slate-500">Applicant:</span>
                    <strong className="text-slate-900">
                      {interest.student?.display_name || "Enrolled Student"}
                    </strong>
                    {interest.student?.role && (
                      <span className="text-[0.65rem] font-mono text-slate-500 uppercase rounded bg-slate-200 px-1 py-0.2">
                        {interest.student.role}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="text-slate-500">Direct Contact:</span>
                    <a
                      href={`mailto:${interest.contact_email}?subject=Regarding your inquiry on: ${cleanProjectTitle}`}
                      className="font-mono text-[#0F2042] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>{interest.contact_email}</span>
                      <ExternalLink size={11} className="text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <span className="block text-[0.68rem] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Student Statement of Interest & Qualifications:
                  </span>
                  <div className="text-xs md:text-sm text-slate-800 bg-white border border-slate-200 rounded p-4 whitespace-pre-wrap font-sans leading-relaxed">
                    {interest.message}
                  </div>
                </div>

                {/* Footer Disclaimers */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[0.7rem] text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#0F766E]" />
                    <span>Private ledger record • ID: {interest.id.slice(0, 8)}</span>
                  </div>
                  <span>
                    Contact directly via email to coordinate lab interview or onboarding.
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Institutional Boundary Footer Note */}
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
        <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 block font-semibold">
            Institutional Policy & Workflow Governance:
          </strong>
          <p className="leading-relaxed">
            Participation requests are submitted by authenticated students expressing interest in joining active research lab initiatives. Under the hub&apos;s privacy model, records are strictly confidential to institutional administrators and are retained for academic coordination. Follow up directly with candidates using their registered contact email.
          </p>
        </div>
      </section>
    </div>
  );
}
