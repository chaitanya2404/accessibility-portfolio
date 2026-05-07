export default function AuditLoading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-4xl px-4 py-12">
      <span className="sr-only">Loading the A11y audit tool…</span>
      <div className="mb-8 h-8 w-1/2 animate-pulse rounded bg-surface-raised" aria-hidden="true" />
      <div className="mb-8 h-20 animate-pulse rounded bg-surface-raised" aria-hidden="true" />
      <div className="h-12 w-full animate-pulse rounded bg-surface-raised" aria-hidden="true" />
    </div>
  );
}
