export default function DivisionHubLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-6xl px-4 py-12"
    >
      <span className="sr-only">Loading Division Hub…</span>
      <div className="mb-8 h-8 w-2/3 animate-pulse rounded bg-surface-raised" aria-hidden="true" />
      <div className="mb-12 h-4 w-full max-w-3xl animate-pulse rounded bg-surface-raised" aria-hidden="true" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-surface-raised" />
        ))}
      </div>
    </div>
  );
}
