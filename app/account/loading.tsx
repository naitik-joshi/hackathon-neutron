export default function AccountLoading() {
  return (
    <div
      className="page-shell-tight space-y-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading account</span>
      <div className="h-20 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
      <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
    </div>
  );
}
