import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  FileText,
  ArrowLeft,
  History,
  User,
  FolderGit2,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guards";
import { getPublicationReviews } from "@/features/submissions/queries";
import { ReviewForm } from "@/features/submissions/review-form";
import type { PublicationStatus } from "@/lib/supabase/database.types";

export const metadata = {
  title: "Editorial Dossier & Review Action | IJMR Admin",
  description: "Institutional review action, peer feedback history, and status governance.",
};

function formatStatusBadge(status: PublicationStatus) {
  switch (status) {
    case "submitted":
      return (
        <span className="pill-badge pill-review text-xs font-medium">
          Awaiting Triage
        </span>
      );
    case "under_review":
      return (
        <span className="pill-badge bg-blue-100 text-blue-900 border-blue-200 text-xs font-medium">
          Under Formal Review
        </span>
      );
    case "changes_requested":
      return (
        <span className="pill-badge pill-collab text-xs font-medium">
          Revisions Requested
        </span>
      );
    case "published":
      return (
        <span className="pill-badge pill-published text-xs font-medium">
          Published & Live
        </span>
      );
    case "rejected":
      return (
        <span className="pill-badge bg-rose-100 text-rose-800 border-rose-200 text-xs font-medium">
          Declined / Rejected
        </span>
      );
    case "draft":
    default:
      return (
        <span className="pill-badge bg-slate-100 text-slate-700 border-slate-200 text-xs font-medium">
          Draft
        </span>
      );
  }
}

function formatDecisionLabel(decision: PublicationStatus) {
  switch (decision) {
    case "under_review":
      return {
        label: "Initiated Review",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      };
    case "changes_requested":
      return {
        label: "Changes Requested",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      };
    case "published":
      return {
        label: "Approved & Published",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      };
    case "rejected":
      return {
        label: "Rejected Submission",
        className: "bg-rose-100 text-rose-800 border-rose-200",
      };
    default:
      return {
        label: decision,
        className: "bg-slate-100 text-slate-800 border-slate-200",
      };
  }
}

export default async function AdminSubmissionDetailPage({
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

  const isDemoRecord =
    data.is_demo || data.title.startsWith("DEMO DATA");
  const cleanTitle = data.title.replace(/^DEMO DATA\s*[—–-]\s*/, "");
  const cleanAbstract = data.abstract.replace(/^DEMO DATA\s*[—–-]\s*/, "");

  // Parallel fetch submitter, associated researchers, linked projects, and private review history
  const [submitterResult, pubResearchersResult, pubProjectsResult, reviews] =
    await Promise.all([
      data.submitted_by
        ? client
            .from("profiles")
            .select("display_name, role")
            .eq("id", data.submitted_by)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      client
        .from("publication_researchers")
        .select("researcher_id")
        .eq("publication_id", data.id),
      client
        .from("publication_projects")
        .select("project_id")
        .eq("publication_id", data.id),
      getPublicationReviews(data.id),
    ]);

  const submitter = submitterResult.data;

  // Resolve author names
  let authors: { id: string; name: string; position: string }[] = [];
  if (pubResearchersResult.data && pubResearchersResult.data.length > 0) {
    const { data: rData } = await client
      .from("researchers")
      .select("id, name, position")
      .in(
        "id",
        pubResearchersResult.data.map((r) => r.researcher_id),
      );
    if (rData) authors = rData;
  }

  // Resolve linked projects
  let projects: { id: string; title: string; slug: string }[] = [];
  if (pubProjectsResult.data && pubProjectsResult.data.length > 0) {
    const { data: pData } = await client
      .from("projects")
      .select("id, title, slug")
      .in(
        "id",
        pubProjectsResult.data.map((p) => p.project_id),
      );
    if (pData) projects = pData;
  }

  const isUpdated = (await searchParams).updated === "1";
  const trackingId = `IJMR-MS-${data.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="page-shell space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500">
          <Link href="/admin" className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link
            href="/admin/submissions"
            className="hover:text-slate-900 transition-colors"
          >
            Submissions Queue
          </Link>
          <span>/</span>
          <span className="font-mono text-slate-800 font-semibold">{trackingId}</span>
        </nav>

        <div className="flex items-center gap-2">
          {data.status === "published" && (
            <Link
              href={`/publications/${data.slug}`}
              className="btn-academic-outline text-xs inline-flex items-center gap-1.5 py-1 px-3"
            >
              <span>View Public Article</span>
              <ExternalLink size={13} />
            </Link>
          )}
          <Link
            href="/admin/submissions"
            className="btn-academic-outline text-xs inline-flex items-center gap-1.5 py-1 px-3"
          >
            <ArrowLeft size={13} />
            <span>All Submissions</span>
          </Link>
        </div>
      </div>

      {/* Dossier Header */}
      <section className="academic-card p-6 md:p-8 space-y-6 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#0F2042] text-white px-2.5 py-1 font-mono text-xs font-bold tracking-wider">
              {trackingId}
            </span>
            {formatStatusBadge(data.status)}
            {isDemoRecord && (
              <span className="pill-badge pill-collab text-xs">
                DEMO DATA
              </span>
            )}
            {data.year && (
              <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-mono font-medium">
                Year {data.year}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
            <span>
              Submitted:{" "}
              <strong className="text-slate-800">
                {new Date(data.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </strong>
            </span>
          </div>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="headline-lg text-[#0F2042] leading-tight">
            {cleanTitle}
          </h1>

          <div className="rounded-lg bg-[#FAFBFD] p-3.5 border border-slate-200 text-xs flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-[0.68rem] text-slate-500 uppercase font-bold tracking-wider">
              Submitting Author & Attribution:
            </span>
            <span className="text-slate-900 font-semibold">
              {submitter?.display_name || "Unassigned Researcher"}
            </span>
            {submitter?.role && (
              <span className="rounded bg-slate-200 text-slate-700 px-1.5 py-0.5 text-[0.65rem] font-mono uppercase">
                {submitter.role}
              </span>
            )}
            {authors.length > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">
                  Co-Authors:{" "}
                  <strong className="text-slate-800">
                    {authors.map((a) => a.name.replace(/^DEMO DATA\s*[—–-]\s*/, "")).join(", ")}
                  </strong>
                </span>
              </>
            )}
          </div>
        </div>

        {isUpdated && (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-center gap-2.5 font-medium"
          >
            <CheckCircle2 size={16} className="text-[#0F766E] shrink-0" />
            <span>
              Review decision recorded successfully in institutional audit ledger. The submission status has been synchronized.
            </span>
          </div>
        )}
      </section>

      {/* Main 8:4 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Abstract, Review Form, Review History */}
        <div className="lg:col-span-8 space-y-8">
          {/* Abstract Dossier */}
          <section className="academic-card p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0F2042]" />
                <h2 className="headline-sm text-[#0F2042]">
                  Manuscript Abstract
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400">
                Word Count: ~{cleanAbstract.split(/\s+/).length} words
              </span>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-line font-serif">
              {cleanAbstract}
            </div>

            {data.doi && (
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-600">
                <span className="text-slate-400 uppercase">DOI Identifier:</span>
                <a
                  href={`https://doi.org/${data.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F2042] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>{data.doi}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </section>

          {/* Editorial Review & Verdict Formulation */}
          <section className="academic-card p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F2042]" />
                <h2 className="headline-sm text-[#0F2042]">
                  Editorial Decision & Review Action
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-500">
                Current Status: <strong className="capitalize text-slate-800">{data.status.replace("_", " ")}</strong>
              </span>
            </div>

            {/* Live Review Action Form */}
            <ReviewForm id={id} status={data.status} />
          </section>

          {/* Private Review Feedback History Timeline */}
          <section className="academic-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#0F2042]" />
                <h2 className="headline-sm text-[#0F2042]">
                  Confidential Review History & Ledger
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-500">
                {reviews.length} {reviews.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              This audit ledger records all peer review transitions, editorial justifications, and author communications. Confidential to administrators and the submitting researcher.
            </p>

            {reviews.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center space-y-2">
                <Clock className="w-7 h-7 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  No prior editorial review actions recorded.
                </p>
                <p className="text-[0.72rem] text-slate-400">
                  This manuscript is awaiting initial triage by the editorial desk.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, idx) => {
                  const decisionInfo = formatDecisionLabel(r.decision);
                  return (
                    <div
                      key={r.id || idx}
                      className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 transition-shadow hover:shadow-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-semibold border ${decisionInfo.className}`}
                          >
                            {decisionInfo.label}
                          </span>
                          <span className="text-xs text-slate-600 font-medium">
                            Administrative Reviewer
                          </span>
                        </div>
                        <time
                          dateTime={r.created_at}
                          className="text-[0.72rem] font-mono text-slate-400"
                        >
                          {new Date(r.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>

                      {r.note ? (
                        <div className="text-xs md:text-sm text-slate-800 bg-slate-50/80 border border-slate-200 rounded p-3.5 whitespace-pre-wrap font-sans leading-relaxed">
                          {r.note}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          No written feedback note was attached to this transition.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column (4 cols): Metadata Specifications, Ecosystem & Policies */}
        <aside className="lg:col-span-4 space-y-6 text-xs">
          {/* Dossier Specifications Card */}
          <div className="academic-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                Dossier Specifications
              </span>
              <span className="font-mono text-[0.68rem] text-slate-400">
                Metadata
              </span>
            </div>

            <div className="space-y-3 font-mono text-[0.72rem]">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Ledger Identifier:</span>
                <strong className="text-slate-900 font-mono">{trackingId}</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Current Status:</span>
                <span className="capitalize font-semibold text-slate-800">
                  {data.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Publication Year:</span>
                <strong className="text-slate-800">{data.year || "Pending"}</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">DOI Minting:</span>
                <strong className="text-slate-800">{data.doi || "Pending publication"}</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Date Received:</span>
                <span className="text-slate-700">
                  {new Date(data.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Last Audit Update:</span>
                <span className="text-slate-700">
                  {new Date(data.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Connected Research Infrastructure */}
          <div className="academic-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                Institutional Network
              </span>
              <User className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-3 text-[0.72rem]">
              <div>
                <span className="text-slate-400 font-mono text-[0.65rem] uppercase block">
                  Submitter Profile
                </span>
                <strong className="text-slate-900 block text-xs mt-0.5">
                  {submitter?.display_name || "Unassigned Submitter"}
                </strong>
                <span className="text-slate-500 font-mono text-[0.65rem]">
                  Role: {submitter?.role || "Researcher"}
                </span>
              </div>

              {authors.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-mono text-[0.65rem] uppercase block">
                    Author Affiliations
                  </span>
                  <div className="mt-1 space-y-1">
                    {authors.map((author) => (
                      <div key={author.id} className="text-slate-800">
                        <span className="font-medium">
                          {author.name.replace(/^DEMO DATA\s*[—–-]\s*/, "")}
                        </span>
                        {author.position && (
                          <span className="text-slate-500 text-[0.68rem] block">
                            {author.position}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projects.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-mono text-[0.65rem] uppercase block">
                    Affiliated R&D Project
                  </span>
                  <div className="mt-1 space-y-1">
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="text-[#0F2042] font-semibold hover:underline inline-flex items-center gap-1 block"
                      >
                        <FolderGit2 size={12} className="shrink-0" />
                        <span>{project.title.replace(/^DEMO DATA\s*[—–-]\s*/, "")}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editorial Governance & COPE Compliance */}
          <div className="academic-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                Editorial Protocol
              </span>
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2 text-[0.72rem] text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-900 block">Confidentiality:</strong>
                All review comments and audit logs remain private between editorial staff and the author. Reviewer profiles are protected under double-blind ethics.
              </p>
              <p>
                <strong className="text-slate-900 block">Mandatory Justification:</strong>
                Rejection or change requests require constructive feedback between 3 and 4000 characters to guide revision.
              </p>
              <p>
                <strong className="text-slate-900 block">Publishing Release:</strong>
                Publishing issues an immutable timestamp and automatically exposes the manuscript to open-access discovery.
              </p>
            </div>
          </div>

          {/* Quick Return Action */}
          <div className="pt-2">
            <Link
              href="/admin/submissions"
              className="btn-academic-outline text-xs w-full text-center block py-2"
            >
              ← Back to Submissions Queue
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
