export default function Loading() {
  return (
    <div role="status" aria-label="Loading research" className="space-y-4">
      <p>Loading…</p>
      <div className="h-12 w-2/3 rounded bg-slate-200" />
      <div className="h-40 rounded bg-slate-200" />
    </div>
  );
}
