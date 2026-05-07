"use client";

export function PrintButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-md border border-divider bg-surface px-5 py-2.5 text-sm font-semibold text-fg hover:bg-surface-raised"
    >
      {children}
    </button>
  );
}
