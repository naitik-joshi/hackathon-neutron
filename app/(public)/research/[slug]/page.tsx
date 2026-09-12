import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreaWithRelations } from "@/features/research/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBadge } from "@/components/shared/status-badge";
import { SetupState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { ResearcherCard } from "@/components/research/researcher-card";
import { PublicationList } from "@/components/research/publication-list";
export default async function AreaDetail({
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
  const data = await getAreaWithRelations((await params).slug);
  if (!data) notFound();
  const { area, researchers, projects, publications } = data;
  return (
    <div className="page-shell space-y-8 break-words">
      <Link href="/research" className="underline">
        ← All research areas
      </Link>
      <DemoBadge demo={area.is_demo} />
      <PageHeader
        eyebrow="Discover / Research area"
        title={area.name}
        description={area.description}
      />
      <section className="space-y-4">
        <h2 className="headline-md">Researchers in this area</h2>
        {researchers.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {researchers.map((r) => (
              <ResearcherCard key={r.id} researcher={r} />
            ))}
          </div>
        ) : (
          <Link href="/researchers" className="underline">
            No linked researchers yet. Browse researchers →
          </Link>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="headline-md">Projects in this area</h2>
        {projects.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Link href="/projects" className="underline">
            No linked projects yet. Explore projects →
          </Link>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="headline-md">Published outputs from linked projects</h2>
        <PublicationList items={publications} />
      </section>
    </div>
  );
}
