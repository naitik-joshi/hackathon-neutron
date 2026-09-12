import Link from "next/link";
import { notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { InitialsAvatar } from "@/components/shared/initials-avatar";
import { PageIntro, SectionHeader } from "@/components/shared/page-intro";
import { RelationshipRail } from "@/components/shared/relationship-rail";
import { DemoBadge } from "@/components/shared/status-badge";
import { EmptyState, SetupState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { PublicationList } from "@/components/research/publication-list";
import { getResearcherWithRelations } from "@/features/research/queries";

export default async function ResearcherDetail({
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
  const data = await getResearcherWithRelations((await params).slug);
  if (!data) notFound();
  const { researcher, areas, projects, publications } = data;

  return (
    <div className="page-shell break-words">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Researchers", href: "/researchers" },
          { label: researcher.name },
        ]}
      />
      <div className="profile-masthead">
        <InitialsAvatar
          name={researcher.name}
          className="h-24 w-24 text-2xl sm:h-28 sm:w-28"
        />
        <PageIntro
          eyebrow="Public researcher profile"
          title={researcher.name}
          description={researcher.position || "Researcher"}
          meta={<DemoBadge demo={researcher.is_demo} />}
        />
      </div>

      <div className="mt-10">
        <RelationshipRail
          steps={[
            { label: "Researcher", detail: researcher.name, current: true },
            {
              label: "Research areas",
              detail: areas.length
                ? `${areas.length} linked`
                : "None linked yet",
              href: "#areas",
              available: areas.length > 0,
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
          ]}
        />
      </div>

      <div className="detail-layout mt-12">
        <main className="min-w-0">
          <section aria-labelledby="researcher-bio-title">
            <p className="section-kicker">Profile</p>
            <h2 id="researcher-bio-title" className="type-h2 mt-1">
              About this researcher
            </h2>
            <p className="body-editorial mt-5 whitespace-pre-wrap">
              {researcher.bio || "No public biography has been provided."}
            </p>
          </section>

          <section id="projects" className="detail-section scroll-mt-28">
            <SectionHeader
              eyebrow="Connected work"
              title="Projects"
              action={
                <Link href="/projects" className="text-link">
                  Project index →
                </Link>
              }
            />
            <div className="mt-7">
              {projects.length ? (
                <div className="grid gap-5">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No public projects are linked yet"
                  description="Browse the project index to continue exploring current work."
                  href="/projects"
                  action="Browse projects"
                />
              )}
            </div>
          </section>

          <section id="publications" className="detail-section scroll-mt-28">
            <SectionHeader
              eyebrow="Published record"
              title="Published research"
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

        <aside
          id="areas"
          className="profile-context scroll-mt-28"
          aria-labelledby="researcher-areas-title"
        >
          <p className="section-kicker">Research context</p>
          <h2 id="researcher-areas-title" className="type-h3 mt-1">
            Research areas
          </h2>
          {areas.length ? (
            <ul className="mt-5 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
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
            <p className="mt-4 text-sm text-muted">
              No research areas are linked to this public profile yet.
            </p>
          )}
          <Link href="/researchers" className="text-link mt-7 inline-block">
            Back to all researchers →
          </Link>
        </aside>
      </div>
    </div>
  );
}
