export default function AdminLoading() {
  return (
    <div
      className="workspace-page"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading admin workspace</span>
      <div className="h-24 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
      <div className="h-36 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
      <div className="h-52 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
    </div>
  );
}
