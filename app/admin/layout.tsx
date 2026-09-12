import { requireRole } from "@/lib/auth/guards";
import { WorkspaceShell } from "@/components/navigation/workspace-shell";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole(["admin"]);
  return (
    <WorkspaceShell
      title="Admin workspace"
      identity={profile.display_name || "Administrator account"}
      links={[
        { href: "/admin", label: "Overview" },
        { href: "/admin/submissions", label: "Publication review queue" },
        { href: "/admin/interests", label: "Project interest inbox" },
      ]}
    >
      {children}
    </WorkspaceShell>
  );
}
