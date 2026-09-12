import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPublicationBySlug } from "@/features/research/queries";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { SetupState } from "@/components/shared/empty-state";
import { ResearcherCard } from "@/components/research/researcher-card";
import { ProjectCard } from "@/components/projects/project-card";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) return { title: "Publication" };
  const item = await getPublicPublicationBySlug((await params).slug);
  return item
    ? { title: item.title, description: item.abstract.slice(0, 160) }
    : { title: "Publication not found" };
}
export default async function PublicationDetail({
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
  const item = await getPublicPublicationBySlug((await params).slug);
  if (!item) notFound();
  const client = await createClient();
  const [authorLinks, projectLinks] = await Promise.all([
    client
      .from("publication_researchers")
      .select("researcher_id")
      .eq("publication_id", item.id),
    client
      .from("publication_projects")
      .select("project_id")
      .eq("publication_id", item.id),
  ]);
  if (authorLinks.error || projectLinks.error)
    throw new Error("Could not load publication connections");
  const [authors, projects] = await Promise.all([
    authorLinks.data.length
      ? client
          .from("researchers")
          .select("*")
          .in(
            "id",
            authorLinks.data.map((r) => r.researcher_id),
          )
      : { data: [], error: null },
    projectLinks.data.length
      ? client
          .from("projects")
          .select("*")
          .in(
            "id",
            projectLinks.data.map((p) => p.project_id),
          )
      : { data: [], error: null },
  ]);
  if (authors.error || projects.error)
    throw new Error("Could not load connected records");
  return (
    <div className="page-shell space-y-8 break-words">
      <Link href="/publications" className="underline">
        ← All publications
      </Link>
      <div className="flex flex-wrap gap-2">
        <DemoBadge demo={item.is_demo} />
        <StatusBadge status={item.status} />
      </div>
      <h1 className="display-lg max-w-4xl">{item.title}</h1>
      {item.year && <p>Publication year: {item.year}</p>}
      <section className="academic-card p-6 md:p-8 space-y-4">
        <h2 className="headline-md">Abstract</h2>
        <p className="body-editorial whitespace-pre-wrap break-words">
          {item.abstract}
        </p>
      </section>
      {item.doi ? (
        <a
          className="underline break-all"
          href={`https://doi.org/${encodeURIComponent(item.doi)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View DOI record: {item.doi} (opens a new tab)
        </a>
      ) : (
        <p className="text-slate-600">
          No DOI or full-text link has been provided.
        </p>
      )}
      <section className="space-y-4">
        <h2 className="headline-md">Connected researchers</h2>
        {authors.data.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {authors.data.map((r) => (
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
        <h2 className="headline-md">Related projects</h2>
        {projects.data.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.data.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Link href="/projects" className="underline">
            No linked projects yet. Explore projects →
          </Link>
        )}
      </section>
    </div>
  );
}
