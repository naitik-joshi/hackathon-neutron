import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreaWithRelations } from "@/features/research/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageIntro, SectionHeader } from "@/components/shared/page-intro";
import { RelationshipRail } from "@/components/shared/relationship-rail";
import { DemoBadge } from "@/components/shared/status-badge";
import { EmptyState, SetupState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { ResearcherCard } from "@/components/research/researcher-card";
import { PublicationList } from "@/components/research/publication-list";
import { buttonVariants } from "@/components/ui";

export default async function AreaDetail({
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
  const data = await getAreaWithRelations((await params).slug);
  if (!data) notFound();
  const { area, researchers, projects, publications } = data;

  return (
    <div className="page-shell break-words">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Research", href: "/research" },
          { label: area.name },
        ]}
      />
      <PageIntro
        eyebrow="Research area"
        title={area.name}
        description={area.description}
        meta={<DemoBadge demo={area.is_demo} />}
        actions={
          <Link
            href="#connections"
            className={buttonVariants({ variant: "secondary" })}
          >
            Follow this area
          </Link>
        }
      />

      <div className="mt-10" id="connections">
        <RelationshipRail
          steps={[
            { label: "Research area", detail: area.name, current: true },
            {
              label: "Researchers",
              detail: researchers.length
                ? `${researchers.length} linked`
                : "None linked yet",
              href: "#researchers",
              available: researchers.length > 0,
            },
            {
              label: "Projects",
              detail: projects.length
                ? `${projects.length} connected`
                : "None linked yet",
              href: "#projects",
              available: projects.length > 0,
            },
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
              detail: projects.length
                ? "Continue through a project"
                : "No project path yet",
              href: projects.length
                ? `/projects/${projects[0].slug}#get-involved`
                : undefined,
              available: projects.length > 0,
            },
          ]}
        />
      </div>

      <section id="researchers" className="detail-section scroll-mt-28">
        <SectionHeader
          eyebrow="Connect"
          title="Researchers in this area"
          description="Public profiles linked directly to this research theme."
          action={
            <Link href="/researchers" className="text-link">
              All researchers →
            </Link>
          }
        />
        <div className="mt-7">
          {researchers.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {researchers.map((researcher) => (
                <ResearcherCard key={researcher.id} researcher={researcher} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No researchers are linked yet"
              description="Continue through the public researcher directory."
              href="/researchers"
              action="Explore researchers"
            />
          )}
        </div>
      </section>

      <section id="projects" className="detail-section scroll-mt-28">
        <SectionHeader
          eyebrow="Understand"
          title="Projects in this area"
          description="Recorded work connected to this research theme."
          action={
            <Link href="/projects" className="text-link">
              All projects →
            </Link>
          }
        />
        <div className="mt-7">
          {projects.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects are linked yet"
              description="Explore the full project index for other active research."
              href="/projects"
              action="Browse projects"
            />
          )}
        </div>
      </section>

      <section id="publications" className="detail-section scroll-mt-28">
        <SectionHeader
          eyebrow="Discover"
          title="Published outputs"
          description="Published records connected through this area's projects."
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
    </div>
  );
}
