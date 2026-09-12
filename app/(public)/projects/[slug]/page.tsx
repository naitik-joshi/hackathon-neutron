import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/features/projects/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DemoBadge } from "@/components/shared/status-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { ProjectTeam } from "@/components/projects/project-team";
import { ProjectParticipationCallout } from "@/components/projects/project-participation-callout";
import { PublicationList } from "@/components/research/publication-list";
import { SetupState } from "@/components/shared/empty-state";
import { getViewer } from "@/lib/auth/viewer";
import { InterestForm } from "@/features/participation/interest-form";
import { expressInterest } from "@/features/participation/actions";
import { buttonVariants } from "@/components/ui";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) return { title: "Project" };
  const data = await getProjectBySlug((await params).slug);
  return data
    ? {
        title: data.project.title,
        description: data.project.summary.slice(0, 160),
      }
    : { title: "Project not found" };
}
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured())
    return (
      <div className="page-shell">
        <SetupState />
      </div>
    );
  const [data, viewer] = await Promise.all([
    getProjectBySlug((await params).slug),
    getViewer(),
  ]);
  if (!data) notFound();
  const { project, areas, researchers, publications } = data;
  const canParticipate =
    project.status === "ongoing" || project.status === "proposed";
  const cleanTitle = project.title.replace(/^DEMO DATA\s*[—–-]\s*/, "");
  const submitInterest = expressInterest.bind(null, {});

  return (
    <div className="page-shell space-y-8 break-words">
      <Link href="/projects" className="underline">
        ← All projects
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <DemoBadge demo={project.is_demo} />
          <ProjectStatusBadge status={project.status} />
        </div>
        {canParticipate && (
          <a
            href="#get-involved"
            className={buttonVariants({ variant: "editorial" })}
          >
            <span>Get involved in this project</span>
            <span aria-hidden="true">↓</span>
          </a>
        )}
      </div>
      <h1 className="display-lg">{project.title}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <section className="academic-card p-6 lg:col-span-2 min-w-0">
          <h2 className="headline-md mb-4">About this project</h2>
          <p className="body-editorial whitespace-pre-wrap">
            {project.summary}
          </p>
        </section>
        <aside className="min-w-0 space-y-6">
          <ProjectTeam researchers={researchers} />
          <ProjectParticipationCallout project={project} />
        </aside>
      </div>
      <section className="space-y-4">
        <h2 className="headline-md">Research areas</h2>
        {areas.length ? (
          <div className="flex flex-wrap gap-3">
            {areas.map((a) => (
              <Link
                key={a.id}
                href={`/research/${a.slug}`}
                className="underline"
              >
                {a.name} <DemoBadge demo={a.is_demo} />
              </Link>
            ))}
          </div>
        ) : (
          <Link href="/research" className="underline">
            No areas linked yet. Explore areas →
          </Link>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="headline-md">Published outputs</h2>
        <PublicationList items={publications} />
      </section>
      <section
        id="get-involved"
        className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200"
      >
        <div className="space-y-1">
          <span className="section-kicker block">Student participation</span>
          <h2 className="headline-md">Get involved</h2>
        </div>

        {canParticipate ? (
          <InterestForm
            projectId={project.id}
            projectTitle={cleanTitle}
            projectSlug={project.slug}
            isDemo={project.is_demo}
            viewerRole={viewer?.role}
            onSubmitAction={submitInterest}
          />
        ) : (
          <div className="academic-card p-6 md:p-8 space-y-3 bg-[#FAFBFD]">
            <h3 className="font-serif font-bold text-slate-900 text-lg">
              Expressions of Interest Closed
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
              This project is currently {project.status}, so it is not accepting
              expressions of interest. You can inspect its published outputs or
              browse other projects.
            </p>
            <div className="pt-2">
              <Link
                href="/projects"
                className={buttonVariants({ variant: "secondary" })}
              >
                Browse active projects →
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
