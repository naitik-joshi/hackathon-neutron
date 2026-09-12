import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicPublicationWithRelations } from "@/features/research/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { InitialsAvatar } from "@/components/shared/initials-avatar";
import { PageIntro, SectionHeader } from "@/components/shared/page-intro";
import { RelationshipRail } from "@/components/shared/relationship-rail";
import { DemoBadge, StatusBadge } from "@/components/shared/status-badge";
import { EmptyState, SetupState } from "@/components/shared/empty-state";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) return { title: "Publication" };
  const item = await getPublicPublicationWithRelations((await params).slug);
  return item
    ? { title: item.title, description: item.abstract.slice(0, 160) }
    : { title: "Publication not found" };
}

export default async function PublicationDetail({
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
  const item = await getPublicPublicationWithRelations((await params).slug);
  if (!item) notFound();

  return (
    <article className="page-shell break-words">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Publications", href: "/publications" },
          { label: item.title },
        ]}
      />
      <PageIntro
        eyebrow="Published research"
        title={item.title}
        description={
          item.authors.length
            ? `By ${item.authors.map((author) => author.name).join(", ")}`
            : "No public authors are linked to this publication record."
        }
        readingWidth
        meta={
          <>
            <DemoBadge demo={item.is_demo} />
            <StatusBadge status={item.status} />
            {item.year && (
              <span className="text-sm text-muted">Published {item.year}</span>
            )}
          </>
        }
        actions={
          item.doi ? (
            <a
              href={`https://doi.org/${encodeURIComponent(item.doi)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link inline-flex items-center gap-1.5"
            >
              DOI record <ExternalLink size={15} aria-hidden="true" />
            </a>
          ) : undefined
        }
      />

      <div className="mt-10">
        <RelationshipRail
          steps={[
            {
              label: "Research areas",
              detail: item.areas.length
                ? `${item.areas.length} connected`
                : "None linked yet",
              href: "#areas",
              available: item.areas.length > 0,
            },
            {
              label: "Researchers",
              detail: item.authors.length
                ? `${item.authors.length} authors`
                : "None linked yet",
              href: "#authors",
              available: item.authors.length > 0,
            },
            {
              label: "Projects",
              detail: item.projects.length
                ? `${item.projects.length} connected`
                : "None linked yet",
              href: "#projects",
              available: item.projects.length > 0,
            },
            { label: "Publication", detail: "Current record", current: true },
          ]}
        />
      </div>

      <div className="publication-layout mt-12">
        <main className="min-w-0">
          <section
            aria-labelledby="abstract-title"
            className="manuscript-column"
          >
            <p className="section-kicker">Manuscript abstract</p>
            <h2 id="abstract-title" className="type-h2 mt-1">
              Abstract
            </h2>
            <p className="body-editorial mt-6 whitespace-pre-wrap">
              {item.abstract}
            </p>
          </section>
          {item.doi ? (
            <dl className="mt-10 border-y border-[var(--color-border)] py-5 text-sm">
              <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
                <dt className="font-semibold">DOI</dt>
                <dd className="break-all font-mono text-muted">{item.doi}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-10 border-y border-[var(--color-border)] py-5 text-sm text-muted">
              No DOI or full-text link has been provided for this record.
            </p>
          )}
        </main>

        <aside className="publication-context">
          <section
            id="authors"
            className="scroll-mt-28"
            aria-labelledby="authors-title"
          >
            <h2 id="authors-title" className="type-h3">
              Authors
            </h2>
            {item.authors.length ? (
              <ul className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                {item.authors.map((author) => (
                  <li key={author.id}>
                    <Link
                      href={`/researchers/${author.slug}`}
                      className="context-link"
                    >
                      <InitialsAvatar
                        name={author.name}
                        className="h-9 w-9 text-xs"
                      />
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate">
                          {author.name}
                        </strong>
                        {author.position && (
                          <span className="block truncate text-xs text-muted">
                            {author.position}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">
                No public authors are linked yet.
              </p>
            )}
          </section>

          <section
            id="areas"
            className="mt-9 scroll-mt-28"
            aria-labelledby="publication-areas-title"
          >
            <h2 id="publication-areas-title" className="type-h3">
              Research areas
            </h2>
            {item.areas.length ? (
              <ul className="mt-3 space-y-2">
                {item.areas.map((area) => (
                  <li key={area.id}>
                    <Link href={`/research/${area.slug}`} className="text-link">
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">
                No areas are linked through this publication&apos;s projects.
              </p>
            )}
          </section>
        </aside>
      </div>

      <section id="projects" className="detail-section scroll-mt-28">
        <SectionHeader
          eyebrow="Continue exploring"
          title="Connected projects"
          description="Projects provide the recorded research context for this publication."
          action={
            <Link href="/projects" className="text-link">
              Project index →
            </Link>
          }
        />
        <div className="mt-7">
          {item.projects.length ? (
            <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {item.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="context-link py-5"
                >
                  <span>
                    <strong className="block">{project.title}</strong>
                    <span className="mt-1 block text-sm text-muted">
                      {project.status.replace("_", " ")}
                    </span>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects are connected yet"
              description="Explore the full project index for related public work."
              href="/projects"
              action="Browse projects"
            />
          )}
        </div>
      </section>
    </article>
  );
}
