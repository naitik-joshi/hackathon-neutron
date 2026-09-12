import { requireRole } from "@/lib/auth/guards";
import { WorkspaceNav } from "@/components/navigation/workspace-nav";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole(["admin"]);
  return (
    <>
      <WorkspaceNav
        title="Admin workspace"
        identity={profile.display_name || "Administrator account"}
        links={[
          { href: "/admin", label: "Overview" },
          { href: "/admin/submissions", label: "Publication review queue" },
        ]}
      />
      {children}
    </>
  );
}
