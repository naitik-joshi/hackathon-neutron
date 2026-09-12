export default function ResearcherLoading() {
  return (
    <div
      className="page-shell space-y-8 pb-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading researcher workspace</span>
      <div className="h-52 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
    </div>
  );
}
