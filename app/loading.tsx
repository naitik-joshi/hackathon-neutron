export default function Loading() {
  return (
    <div className="page-shell" role="status" aria-label="Loading research">
      <span className="section-kicker">Loading research</span>
      <div className="mt-4 h-12 w-2/3 max-w-2xl animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-strong)]" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="h-44 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
        <div className="h-44 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)] md:col-span-2" />
      </div>
    </div>
  );
}
