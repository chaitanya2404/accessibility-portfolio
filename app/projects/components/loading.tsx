export default function ComponentsLoading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-6xl px-4 py-12">
      <span className="sr-only">Loading the components showcase…</span>
      <div className="mb-8 h-8 w-1/2 animate-pulse rounded bg-surface-raised" aria-hidden="true" />
      <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]" aria-hidden="true">
        <div className="h-64 animate-pulse rounded bg-surface-raised" />
        <div className="space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-surface-raised" />
          ))}
        </div>
      </div>
    </div>
  );
}
