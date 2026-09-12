import { EmptyState } from "@/components/shared/empty-state";
export default function NotFound() {
  return (
    <div className="page-shell-tight">
      <EmptyState
        title="Research not found"
        description="This record may not exist or may not be published. Explore the public collection for available research."
      />
    </div>
  );
}
