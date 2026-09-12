import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { Badge, Card, buttonVariants } from "@/components/ui";

export const metadata = { title: "Your account" };
export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { profile } = await requireRole(["student", "researcher", "admin"]);
  const workspace =
    profile.role === "admin"
      ? "/admin"
      : profile.role === "researcher"
        ? "/researcher"
        : "/projects";
  const workspaceLabel =
    profile.role === "student" ? "Explore projects" : "Open your workspace";

  return (
    <div className="page-shell-tight">
      {(await searchParams).created === "1" && (
        <div role="status" className="alert alert-success mb-7 flex gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" />
          <p>Your student account is ready.</p>
        </div>
      )}
      <PageHeader
        eyebrow="Account"
        title={profile.display_name || "Your R&D Hub account"}
        description="Your account gives you access to role-appropriate participation and research tools."
      />
      <Card className="max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Current access</p>
            <h2 className="mt-2 text-2xl capitalize">{profile.role}</h2>
          </div>
          <Badge>{profile.role}</Badge>
        </div>
        <p className="my-6 text-slate-600">
          {profile.role === "student"
            ? "Discover public research and find projects where future participation opportunities can appear."
            : "Continue to the workspace provided for your institutional role."}
        </p>
        <Link href={workspace} className={buttonVariants()}>
          {workspaceLabel}
        </Link>
      </Card>
    </div>
  );
}
