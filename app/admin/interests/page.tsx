import Link from "next/link";
import { ExternalLink, Inbox, Mail, Search } from "lucide-react";
import { DemoBadge } from "@/components/shared/status-badge";
import { Input, buttonVariants } from "@/components/ui";
import { getEnrichedInterestInbox } from "@/features/participation/queries";
import { requireRole } from "@/lib/auth/guards";

export const metadata = {
  title: "Project interest inbox | Islington R&D Digital Hub",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function AdminInterestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole(["admin"]);
  const { q = "" } = await searchParams;
  const interests = await getEnrichedInterestInbox();
  const normalized = q.trim().toLowerCase();
  const filtered = normalized
    ? interests.filter(
        (interest) =>
          interest.contact_email.toLowerCase().includes(normalized) ||
          interest.message.toLowerCase().includes(normalized) ||
          interest.project?.title.toLowerCase().includes(normalized) ||
          interest.student?.display_name.toLowerCase().includes(normalized),
      )
    : interests;

  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div>
          <p className="workspace-overline">Admin / Participation</p>
          <h1 className="workspace-page-title">Project interest inbox</h1>
          <p className="workspace-page-description">
            Read expressions of interest submitted by signed-in users and use
            their supplied contact details for follow-up.
          </p>
        </div>
        <Link
          href="/admin"
          className={buttonVariants({ variant: "secondary" })}
        >
          Admin overview
        </Link>
      </header>

      <section
        className="workspace-section"
        aria-labelledby="interest-search-title"
      >
        <h2 id="interest-search-title" className="sr-only">
          Search project interests
        </h2>
        <form
          method="GET"
          action="/admin/interests"
          className="workspace-panel grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
        >
          <div className="relative">
            <label htmlFor="interest-search" className="sr-only">
              Search by student, email, project, or message
            </label>
            <Search
              aria-hidden="true"
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
            />
            <Input
              id="interest-search"
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search student, email, project, or message"
              className="pl-10"
            />
          </div>
          <button className={buttonVariants()}>Search</button>
        </form>
        {q && (
          <Link href="/admin/interests" className="text-link w-fit text-sm">
            Clear search
          </Link>
        )}
      </section>

      <section
        className="workspace-section"
        aria-labelledby="interest-records-title"
      >
        <div className="workspace-section-heading">
          <h2 id="interest-records-title" className="workspace-section-title">
            Recorded interests
          </h2>
          <span className="text-sm font-semibold text-[var(--color-text-muted)]">
            {filtered.length} shown
          </span>
        </div>
        {filtered.length === 0 ? (
          <div className="workspace-panel p-7 text-center">
            <Inbox
              aria-hidden="true"
              className="mx-auto text-[var(--color-text-subtle)]"
            />
            <h3 className="mt-3 font-sans text-base font-bold">
              {q
                ? "No interests match this search"
                : "No project interests recorded"}
            </h3>
            <p className="mx-auto mt-1 max-w-lg text-sm text-[var(--color-text-muted)]">
              {q
                ? "Try a student name, email address, project title, or phrase from the message."
                : "New expressions of interest will appear here after a signed-in user submits one."}
            </p>
          </div>
        ) : (
          <ol className="workspace-panel">
            {filtered.map((interest) => (
              <li key={interest.id} className="workspace-record">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <DemoBadge demo={interest.is_demo} />
                      <span className="text-xs text-[var(--color-text-subtle)]">
                        Record {interest.id.slice(0, 8)}
                      </span>
                    </div>
                    <h3 className="mt-2 break-words font-sans text-base font-bold text-[var(--color-ink)]">
                      {interest.project?.title || "Project record unavailable"}
                    </h3>
                  </div>
                  <time
                    className="text-xs text-[var(--color-text-subtle)]"
                    dateTime={interest.created_at}
                  >
                    Received {formatDate(interest.created_at)}
                  </time>
                </div>
                <dl className="grid gap-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] p-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-bold text-[var(--color-text-muted)]">
                      Student
                    </dt>
                    <dd className="mt-1 font-semibold text-[var(--color-ink)]">
                      {interest.student?.display_name || "Student account"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-[var(--color-text-muted)]">
                      Contact
                    </dt>
                    <dd className="mt-1 break-all">
                      <a
                        href={`mailto:${interest.contact_email}`}
                        className="text-link inline-flex items-center gap-1"
                      >
                        <Mail aria-hidden="true" size={14} />
                        {interest.contact_email}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-muted)]">
                    Message
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text)]">
                    {interest.message}
                  </p>
                </div>
                {interest.project?.slug && (
                  <Link
                    href={`/projects/${interest.project.slug}`}
                    className="text-link inline-flex w-fit items-center gap-1 text-sm"
                  >
                    View project <ExternalLink aria-hidden="true" size={14} />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
