import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/features/projects/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageIntro, SectionHeader } from "@/components/shared/page-intro";
import { RelationshipRail } from "@/components/shared/relationship-rail";
import { DemoBadge } from "@/components/shared/status-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { ProjectTeam } from "@/components/projects/project-team";
import { PublicationList } from "@/components/research/publication-list";
import { EmptyState, SetupState } from "@/components/shared/empty-state";
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
  if (!isSupabaseConfigured()) {
    return (
      <div className="page-shell">
        <SetupState />
      </div>
    );
  }
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
    <div className="page-shell break-words">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />
      <PageIntro
        eyebrow="Research project"
        title={project.title}
        description="A recorded project in the public Islington research ecosystem."
        meta={
          <>
            <DemoBadge demo={project.is_demo} />
            <ProjectStatusBadge status={project.status} />
          </>
        }
        actions={
          canParticipate ? (
            <a
              href="#get-involved"
              className={buttonVariants({ variant: "editorial" })}
            >
              Get involved <span aria-hidden="true">↓</span>
            </a>
          ) : (
            <Link
              href="/projects"
              className={buttonVariants({ variant: "secondary" })}
            >
              Browse active projects
            </Link>
          )
        }
      />

      <div className="mt-10">
        <RelationshipRail
          steps={[
            {
              label: "Research areas",
              detail: areas.length
                ? `${areas.length} connected`
                : "None linked yet",
              href: "#areas",
              available: areas.length > 0,
            },
            {
              label: "Researchers",
              detail: researchers.length
                ? `${researchers.length} connected`
                : "None linked yet",
              href: "#researchers",
              available: researchers.length > 0,
            },
            { label: "Project", detail: project.title, current: true },
            {
              label: "Publications",
              detail: publications.length
                ? `${publications.length} published`
                : "None linked yet",
              href: "#publications",
              available: publications.length > 0,
            },
            {
              label: "Participation",
              detail: canParticipate
                ? "Expressions of interest open"
                : "Not currently open",
              href: canParticipate ? "#get-involved" : undefined,
              available: canParticipate,
            },
          ]}
        />
      </div>

      <div className="detail-layout mt-12">
        <main className="min-w-0">
          <section aria-labelledby="project-summary-title">
            <p className="section-kicker">Project summary</p>
            <h2 id="project-summary-title" className="type-h2 mt-1">
              What is this research?
            </h2>
            <p className="body-editorial mt-5 whitespace-pre-wrap">
              {project.summary}
            </p>
          </section>

          <section id="publications" className="detail-section scroll-mt-28">
            <SectionHeader
              eyebrow="Published record"
              title="Outputs from this project"
              description="Only published records linked to this project appear here."
              action={
                <Link href="/publications" className="text-link">
                  Publication index →
                </Link>
              }
            />
            <div className="mt-7">
              <PublicationList items={publications} />
            </div>
          </section>
        </main>

        <aside className="profile-context">
          <div id="areas" className="scroll-mt-28">
            <p className="section-kicker">Research context</p>
            <h2 className="type-h3 mt-1">Research areas</h2>
            {areas.length ? (
              <ul className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                {areas.map((area) => (
                  <li key={area.id}>
                    <Link
                      href={`/research/${area.slug}`}
                      className="context-link"
                    >
                      <span>{area.name}</span>
                      <DemoBadge demo={area.is_demo} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">
                No public research area is linked to this project yet.
              </p>
            )}
          </div>
          <div id="researchers" className="mt-10 scroll-mt-28">
            <ProjectTeam researchers={researchers} />
          </div>
        </aside>
      </div>

      <section id="get-involved" className="detail-section scroll-mt-28">
        <SectionHeader
          eyebrow="Participate"
          title="Get involved"
          description="Express your interest in participating in this project."
        />
        <div className="mt-7">
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
            <EmptyState
              title="Expressions of interest are closed"
              description={`This project is ${project.status}, so it is not currently accepting expressions of interest. Explore other recorded projects for an active participation path.`}
              href="/projects?status=ongoing"
              action="Browse active projects"
            />
          )}
        </div>
      </section>
    </div>
  );
}
