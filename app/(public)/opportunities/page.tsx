import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
export const metadata = { title: "Research opportunities" };
export default function Page() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Participate"
        title="Research opportunities"
        description="The opportunities directory is being prepared. No grants, funded roles or application deadlines are listed here yet."
      />
      <EmptyState
        title="Explore connected research while this directory grows"
        description="Browse current project records and the researchers connected to them."
        href="/projects"
        action="Explore projects"
      />
    </div>
  );
}
