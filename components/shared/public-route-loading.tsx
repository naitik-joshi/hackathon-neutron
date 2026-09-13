export function PublicRouteLoading({ label }: { label: string }) {
  return (
    <div className="page-shell" role="status" aria-label={`Loading ${label}`}>
      <span className="sr-only">Loading {label}…</span>
      <div className="skeleton-block h-4 w-36" />
      <div className="skeleton-block mt-5 h-14 max-w-2xl" />
      <div className="skeleton-block mt-4 h-6 max-w-xl" />
      <div className="skeleton-block mt-10 h-24 w-full" />
      <div className="mt-10 grid gap-5 lg:grid-cols-2" aria-hidden="true">
        <div className="skeleton-block h-56" />
        <div className="skeleton-block h-56" />
      </div>
    </div>
  );
}
