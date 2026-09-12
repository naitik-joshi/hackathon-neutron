import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
export const metadata = { title: "Research events" };
export default function Page() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Participate"
        title="Research events"
        description="The events directory is being prepared. No event dates or registration links are available here yet."
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
