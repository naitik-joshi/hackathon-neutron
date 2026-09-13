import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, UserRound } from "lucide-react";
import { WorkspaceShell } from "@/components/navigation/workspace-shell";
import { DemoBadge } from "@/components/shared/status-badge";
import { Badge, FormMessage, buttonVariants } from "@/components/ui";
import { getMyInterestSummaries } from "@/features/participation/queries";
import { requireRole } from "@/lib/auth/guards";

export const metadata = { title: "Your account" };
export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { profile } = await requireRole(["student", "researcher", "admin"]);
  const interests = await getMyInterestSummaries();
  const workspace =
    profile.role === "admin"
      ? "/admin"
      : profile.role === "researcher"
        ? "/researcher"
        : "/projects";
  const workspaceLabel =
    profile.role === "student" ? "Explore projects" : "Open role workspace";
  const links =
    profile.role === "admin"
      ? [
          { href: "/account", label: "Account" },
          { href: "/admin", label: "Admin workspace" },
        ]
      : profile.role === "researcher"
        ? [
            { href: "/account", label: "Account" },
            { href: "/researcher", label: "Researcher workspace" },
          ]
        : [
            { href: "/account", label: "Account" },
            { href: "/projects", label: "Explore projects" },
          ];
  const params = await searchParams;

  return (
    <WorkspaceShell
      title={profile.role === "student" ? "Student account" : "Account"}
      identity={profile.display_name || "R&D Hub member"}
      links={links}
    >
      <div className="workspace-page">
        {params.created === "1" && (
          <FormMessage tone="success" className="flex gap-3">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" />
            <p>Your student account is ready.</p>
          </FormMessage>
        )}

        <header className="workspace-page-header">
          <div>
            <p className="workspace-overline">Account overview</p>
            <h1 className="workspace-page-title">
              {profile.display_name || "Your R&D Hub account"}
            </h1>
            <p className="workspace-page-description">
              Discover public research and use the participation tools available
              to your account.
            </p>
          </div>
          <Badge className="capitalize">{profile.role} access</Badge>
        </header>

        <section
          className="workspace-section"
          aria-labelledby="account-next-title"
        >
          <div className="workspace-section-heading">
            <h2 id="account-next-title" className="workspace-section-title">
              Your next step
            </h2>
          </div>
          <div className="workspace-panel grid gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-6">
            <span className="icon-disc" aria-hidden="true">
              <Compass size={20} />
            </span>
            <div>
              <h3 className="font-sans text-base font-bold text-[var(--color-ink)]">
                {profile.role === "student"
                  ? "Find research you can participate in"
                  : "Continue to your role workspace"}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {profile.role === "student"
                  ? "Open a project to understand its work and record an expression of interest."
                  : "Your workspace contains the management actions assigned to your role."}
              </p>
            </div>
            <Link href={workspace} className={buttonVariants()}>
              {workspaceLabel} <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>

        <section
          className="workspace-section"
          aria-labelledby="participation-title"
        >
          <div className="workspace-section-heading">
            <div>
              <h2 id="participation-title" className="workspace-section-title">
                My participation
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Expressions of interest recorded from this account.
              </p>
            </div>
            <span className="text-sm font-semibold text-[var(--color-text-muted)]">
              {interests.length} recorded
            </span>
          </div>
          {interests.length === 0 ? (
            <div className="workspace-panel p-6 text-center sm:p-8">
              <UserRound
                className="mx-auto text-[var(--color-text-subtle)]"
                aria-hidden="true"
              />
              <h3 className="mt-3 font-sans text-base font-bold">
                No interests recorded yet
              </h3>
              <p className="mx-auto mt-1 max-w-lg text-sm text-[var(--color-text-muted)]">
                Browse active projects and use Get Involved when a project is a
                good fit.
              </p>
              <Link
                href="/projects"
                className={buttonVariants({
                  variant: "secondary",
                  className: "mt-5",
                })}
              >
                Browse projects
              </Link>
            </div>
          ) : (
            <ol className="workspace-panel">
              {interests.map((interest) => (
                <li
                  key={interest.id}
                  className="workspace-record sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <DemoBadge demo={interest.isDemo} />
                      <time
                        className="text-xs text-[var(--color-text-muted)]"
                        dateTime={interest.createdAt}
                      >
                        Recorded {formatDate(interest.createdAt)}
                      </time>
                    </div>
                    <h3 className="mt-2 font-sans text-base font-bold text-[var(--color-ink)]">
                      {interest.project?.title || "Project record unavailable"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
                      {interest.message}
                    </p>
                  </div>
                  {interest.project && (
                    <Link
                      href={`/projects/${interest.project.slug}`}
                      className={buttonVariants({ variant: "secondary" })}
                    >
                      View project
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}
