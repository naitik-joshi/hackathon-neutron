import Link from "next/link";
import { notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBadge } from "@/components/shared/status-badge";
import { SetupState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { PublicationList } from "@/components/research/publication-list";
import { getResearcherWithRelations } from "@/features/research/queries";
import { Layers } from "lucide-react";

export default async function ResearcherDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) return <SetupState />;
  const { slug } = await params;
  
  const data = await getResearcherWithRelations(slug);
  
  if (!data) notFound();
  
  const { researcher, areas, projects, publications } = data;

  return (
    <>
      <div className="mb-4">
        <DemoBadge demo={researcher.is_demo} />
      </div>
      
      <PageHeader
        eyebrow={`Discover / ${researcher.position}`}
        title={researcher.name}
        description={researcher.bio}
      />

      {areas.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Research Areas</h2>
          <div className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/research/${area.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <Layers size={14} aria-hidden="true" />
                {area.name.replace(/^DEMO DATA — /, "")}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-semibold">Projects</h2>
        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <p className="text-slate-600 mb-4">
              No public projects are currently linked to this profile.
            </p>
            <Link href="/projects" className="text-link text-sm">
              View all projects →
            </Link>
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-semibold">Published research</h2>
        {publications.length > 0 ? (
          <PublicationList items={publications} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <p className="text-slate-600 mb-4">
              No published research found for this profile yet.
            </p>
            <Link href="/publications" className="text-link text-sm">
              Explore all published research →
            </Link>
          </div>
        )}
      </section>

      <div className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap gap-6">
        <Link href="/publications" className="text-link">
          Explore published research →
        </Link>
        <Link href="/projects" className="text-link">
          Explore projects →
        </Link>
      </div>
    </>
  );
}
