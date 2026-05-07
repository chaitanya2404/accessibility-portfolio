"use client";

import { useEffect } from "react";

export default function AuditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error.tsx] a11y-audit", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fg">
        Audit tool failed to load
      </h1>
      <p className="mt-4 text-fg-muted">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong"
      >
        Try again
      </button>
    </main>
  );
}
