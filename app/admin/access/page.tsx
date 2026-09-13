import Link from "next/link";
import { Badge, FormMessage, buttonVariants } from "@/components/ui";
import {
  ProfileRoleControl,
  ResearcherRequestReview,
} from "@/features/access/admin-access-controls";
import { getAdminAccessData } from "@/features/access/queries";
import { AdminInviteForm } from "@/features/access/admin-invite-form";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const metadata = {
  title: "Account access | Islington R&D Digital Hub",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function AdminAccessPage() {
  const { requests, profiles, currentAdminId } = await getAdminAccessData();
  const pending = requests.filter((request) => request.status === "pending");

  return (
    <div className="workspace-page">
      <header className="workspace-page-header">
        <div>
          <p className="workspace-overline">Admin / Access</p>
          <h1 className="workspace-page-title">Account access</h1>
          <p className="workspace-page-description">
            Review researcher requests and manage roles for existing accounts.
            Passwords are never available to administrators.
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
        aria-labelledby="admin-invite-title"
      >
        <div className="workspace-section-heading">
          <div>
            <h2 id="admin-invite-title" className="workspace-section-title">
              Add an administrator
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Send a Supabase Auth invitation or explicitly promote an existing
              account. Administrators never create or view passwords.
            </p>
          </div>
        </div>
        <AdminInviteForm configured={isSupabaseAdminConfigured()} />
      </section>

      <section
        className="workspace-section"
        aria-labelledby="access-queue-title"
      >
        <div className="workspace-section-heading">
          <div>
            <h2 id="access-queue-title" className="workspace-section-title">
              Researcher request queue
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Approval changes the requesting student account to researcher.
            </p>
          </div>
          <Badge>{pending.length} pending</Badge>
        </div>
        {pending.length === 0 ? (
          <div className="workspace-panel p-6">
            <FormMessage tone="info">
              No researcher requests are waiting.
            </FormMessage>
          </div>
        ) : (
          <ol className="workspace-panel">
            {pending.map((request) => (
              <li key={request.id} className="workspace-record">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-sans text-base font-bold text-[var(--color-ink)]">
                      {request.full_name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {request.position} · {request.affiliation}
                    </p>
                    <a
                      className="text-link mt-1 inline-block text-sm"
                      href={`mailto:${request.contact_email}`}
                    >
                      {request.contact_email}
                    </a>
                  </div>
                  <time
                    className="text-xs text-[var(--color-text-subtle)]"
                    dateTime={request.created_at}
                  >
                    Requested {formatDate(request.created_at)}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {request.reason}
                </p>
                <ResearcherRequestReview id={request.id} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="workspace-section" aria-labelledby="accounts-title">
        <div className="workspace-section-heading">
          <div>
            <h2 id="accounts-title" className="workspace-section-title">
              Existing accounts
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              New people register themselves as students. An administrator can
              then assign student, researcher, or admin access here.
            </p>
          </div>
          <Badge>{profiles.length} accounts</Badge>
        </div>
        <ol className="workspace-panel">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="workspace-record sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <h3 className="font-sans text-base font-bold text-[var(--color-ink)]">
                  {profile.display_name || "Account without display name"}
                </h3>
                <p className="mt-1 break-all text-xs text-[var(--color-text-subtle)]">
                  {profile.id}
                </p>
                {profile.id === currentAdminId && (
                  <p className="mt-1 text-xs font-semibold">Current account</p>
                )}
              </div>
              <ProfileRoleControl
                userId={profile.id}
                role={profile.role}
                disabled={profile.id === currentAdminId}
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
