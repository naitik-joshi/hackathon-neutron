export default function ResearcherLoading() {
  return (
    <div
      className="workspace-page"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading researcher workspace</span>
      <div className="h-24 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
      <div className="h-28 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
      <div className="h-44 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
    </div>
  );
}
