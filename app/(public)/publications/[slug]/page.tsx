import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBadge } from "@/components/shared/status-badge";
import { SetupState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui";
export default async function PublicationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) return <SetupState />;
  const client = await createClient();
  const { slug } = await params;
  const { data: item, error } = await client
    .from("publications")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error("Could not load publication");
  if (!item) notFound();
  const [authorsResult, projectsResult] = await Promise.all([
    client
      .from("publication_researchers")
      .select("researcher_id")
      .eq("publication_id", item.id),
    client
      .from("publication_projects")
      .select("project_id")
      .eq("publication_id", item.id),
  ]);
  if (authorsResult.error || projectsResult.error)
    throw new Error("Could not load research connections");
  const [authors, projects] = await Promise.all([
    authorsResult.data.length
      ? client
          .from("researchers")
          .select("*")
          .in(
            "id",
            authorsResult.data.map((r) => r.researcher_id),
          )
      : { data: [], error: null },
    projectsResult.data.length
      ? client
          .from("projects")
          .select("*")
          .in(
            "id",
            projectsResult.data.map((r) => r.project_id),
          )
      : { data: [], error: null },
  ]);
  if (authors.error || projects.error)
    throw new Error("Could not load research connections");
  return (
    <>
      <Link className="text-link mb-6 inline-block" href="/publications">
        ← Publications
      </Link>
      <DemoBadge demo={item.is_demo} />
      <PageHeader
        eyebrow={`Publication / ${item.year ?? "Year not provided"}`}
        title={item.title}
        description="An approved research output in the Islington R&D collection."
      />
      <Card>
        <h2 className="text-2xl">Abstract</h2>
        <p className="my-5 max-w-3xl whitespace-pre-wrap">{item.abstract}</p>
        {item.doi && (
          <a
            className="text-link"
            href={`https://doi.org/${encodeURIComponent(item.doi)}`}
            rel="noopener noreferrer"
          >
            Read at DOI: {item.doi} ↗
          </a>
        )}
        <p className="mt-4 text-sm text-slate-500">
          Published{" "}
          {new Date(item.published_at!).toLocaleDateString("en-GB", {
            timeZone: "UTC",
          })}
        </p>
      </Card>
      <section className="my-8">
        <h2 className="mb-4 text-2xl">People and projects behind this work</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {authors.data?.map((a) => (
            <Card key={a.id}>
              <DemoBadge demo={a.is_demo} />
              <h3 className="mt-3 text-xl">{a.name}</h3>
              <p className="mt-2 text-sm">{a.position}</p>
              <p className="mt-2 text-slate-600">{a.bio}</p>
            </Card>
          ))}
          {projects.data?.map((p) => (
            <Card key={p.id}>
              <DemoBadge demo={p.is_demo} />
              <h3 className="mt-3 text-xl">{p.title}</h3>
              <p className="mt-2 text-slate-600">{p.summary}</p>
            </Card>
          ))}
        </div>
        {!authors.data?.length && !projects.data?.length && (
          <p>Research connections have not been added yet.</p>
        )}
      </section>
      <div className="flex flex-wrap gap-6">
        <Link href="/research" className="text-link">
          Explore related research areas →
        </Link>
        <Link href="/researcher/publications/new" className="text-link">
          Contribute your research →
        </Link>
      </div>
    </>
  );
}
