import { requireRole } from "@/lib/auth/guards";
import { WorkspaceNav } from "@/components/navigation/workspace-nav";
export const dynamic = "force-dynamic";
export default async function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole(["researcher"]);
  return (
    <>
      <WorkspaceNav
        title="Researcher workspace"
        identity={profile.display_name || "Researcher account"}
        links={[
          { href: "/researcher", label: "Overview" },
          { href: "/researcher/publications", label: "My publications" },
          { href: "/researcher/publications/new", label: "Submit publication" },
        ]}
      />
      {children}
    </>
  );
}
