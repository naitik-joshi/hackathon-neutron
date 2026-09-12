import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBadge } from "@/components/shared/status-badge";
import { SetupState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui";
export default async function AreaDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) return <SetupState />;
  const client = await createClient();
  const { slug } = await params;
  const { data: area, error } = await client
    .from("research_areas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Could not load area");
  if (!area) notFound();
  const { data: links, error: linksError } = await client
    .from("project_research_areas")
    .select("project_id")
    .eq("research_area_id", area.id);
  if (linksError) throw new Error("Could not load area projects");
  const { data: projects, error: projectsError } = links.length
    ? await client
        .from("projects")
        .select("*")
        .in(
          "id",
          links.map((l) => l.project_id),
        )
    : { data: [], error: null };
  if (projectsError) throw new Error("Could not load projects");
  return (
    <>
      <DemoBadge demo={area.is_demo} />
      <PageHeader
        eyebrow="Discover / Research area"
        title={area.name}
        description={area.description}
      />
      <h2 className="mb-5 text-2xl">Projects in this area</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {projects?.map((p) => (
          <Card key={p.id}>
            <DemoBadge demo={p.is_demo} />
            <h3 className="mt-3 text-2xl">{p.title}</h3>
            <p className="my-4">{p.summary}</p>
            <p className="eyebrow">{p.status}</p>
          </Card>
        ))}
      </div>
      {!projects?.length && (
        <p>
          Project connections are being prepared. Explore published research in
          the meantime.
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-6">
        <Link href="/publications" className="text-link">
          Explore published research →
        </Link>
        <Link href="/researcher/publications/new" className="text-link">
          Contribute research →
        </Link>
        <Link href="/research" className="text-link">
          All areas →
        </Link>
      </div>
    </>
  );
}
