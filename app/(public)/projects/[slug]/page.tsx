import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Layers,
  Users,
  FileText,
  School,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getProjectBySlug } from "@/features/projects/queries";
import { DemoBadge } from "@/components/shared/status-badge";
import { SetupState } from "@/components/shared/empty-state";
import { Card, buttonVariants } from "@/components/ui";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { ProjectTeam } from "@/components/projects/project-team";
import { ProjectPublications } from "@/components/projects/project-publications";

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
    title: `${data.project.title} | Projects`,
    description: data.project.summary.slice(0, 160),
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
  return (
    <>
      {/* Breadcrumbs Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500"
      >
        <Link href="/" className="hover:text-blue-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/projects"
          className="hover:text-blue-700 transition-colors"
        >
          Projects
        </Link>
        {areas.length > 0 && (
          <>
            <span>/</span>
            <Link
              href={`/research/${areas[0].slug}`}
              className="hover:text-blue-700 transition-colors"
            >
              {areas[0].name.replace(/^DEMO DATA — /, "")}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="font-mono text-slate-700 font-medium truncate max-w-xs">
          {project.title.replace(/^DEMO DATA — /, "")}
        </span>
      </nav>

      {/* Hero Header Section */}
      <header className="mb-8 rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <ProjectStatusBadge status={project.status} />
          <DemoBadge demo={project.is_demo} />
          <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            PRJ-{project.id.slice(0, 8)}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#142c43] md:text-5xl leading-tight">
          {project.title.replace(/^DEMO DATA — /, "")}
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600 leading-relaxed">
          {project.summary.replace(/^DEMO DATA — /, "")}
        </p>

        {/* Metadata Strip */}
        <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-slate-100 pt-5 text-sm text-slate-600">
          {areas.length > 0 && (
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-blue-700" aria-hidden="true" />
              <span className="font-medium text-slate-900">Area:</span>
              <div className="flex flex-wrap gap-1.5">
                {areas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/research/${area.slug}`}
                    className="text-link text-xs"
                  >
                    {area.name.replace(/^DEMO DATA — /, "")}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {researchers.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-blue-700" aria-hidden="true" />
              <span className="font-medium text-slate-900">Research team:</span>
              <span>
                {researchers.length} linked{" "}
                {researchers.length === 1 ? "researcher" : "researchers"}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
            <Calendar size={14} aria-hidden="true" />
            <span>
              Updated{" "}
              {new Date(project.updated_at).toLocaleDateString("en-GB", {
                timeZone: "UTC",
              })}
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <a href="#get-involved" className={buttonVariants()}>
              <School size={16} aria-hidden="true" />
              Express Interest / Get Involved
            </a>
            <Link
              href="/publications"
              className={buttonVariants({ variant: "secondary" })}
            >
              <FileText size={16} aria-hidden="true" />
              Browse Published Papers
            </Link>
          </div>

          <Link
            href="/projects"
            className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            All Research Projects
          </Link>
        </div>
      </header>

      {/* Main 2-Column Split: 8 cols main + 4 cols sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start my-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <Card>
            <h2 className="text-2xl font-semibold text-slate-900">
              About this project
            </h2>
            <p className="mt-4 text-base text-slate-700 leading-relaxed">
              {project.summary}
            </p>
          </Card>

          {/* Linked published outputs */}
          <section aria-label="Project Publications">
            <ProjectPublications publications={publications} />
          </section>

          {/* Participation direction */}
          <section
            id="get-involved"
            aria-label="Student participation"
            className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-900 to-[#142c43] p-6 sm:p-8 text-white shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-700/60 p-2 text-white">
                  <School size={24} aria-hidden="true" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-blue-200 font-semibold block">
                    Student Participation
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    Get Involved in this Project
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-sm text-blue-100 leading-relaxed mb-6">
              Interested students can sign in to follow the participation path.
              Opportunity details are added only when the project team confirms
              them.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-blue-800/80 pt-4">
              <span className="text-xs text-blue-200">
                Public project information remains available without an account.
              </span>
              <Link
                href="/account"
                className={buttonVariants({ variant: "secondary" })}
              >
                Open your account <ArrowRight aria-hidden="true" size={14} />
              </Link>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Connected research team */}
          <ProjectTeam researchers={researchers} />

          {/* Quick Project Facts */}
          <Card>
            <span className="eyebrow block mb-3">Project record</span>
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between py-2">
                <dt className="text-slate-500">Repository ID</dt>
                <dd className="font-mono font-medium text-slate-800">
                  PRJ-{project.id.slice(0, 8)}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-slate-500">Lifecycle Status</dt>
                <dd className="font-medium text-slate-800 capitalize">
                  {project.status}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-slate-500">Updated</dt>
                <dd className="font-medium text-slate-800">
                  {new Date(project.updated_at).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  })}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Connected Research Areas Links */}
          {areas.length > 0 && (
            <Card>
              <span className="eyebrow block mb-3">Related Research Areas</span>
              <div className="space-y-2">
                {areas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/research/${area.slug}`}
                    className="block rounded-lg p-2.5 hover:bg-blue-50 transition-colors border border-slate-100"
                  >
                    <span className="font-semibold text-sm text-slate-900 block hover:text-blue-700">
                      {area.name.replace(/^DEMO DATA — /, "")}
                    </span>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {area.description.replace(/^DEMO DATA — /, "")}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}
