"use client";

import { useEffect } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error.tsx] root", { message: error.message, digest: error.digest });
    track("audit.run.failed", { url: "n/a", reason: error.message });
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fg">Something went wrong</h1>
      <p className="mt-4 text-fg-muted">
        An unexpected error broke this page. The team has been notified via the
        observability sink. You can try again or return home.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-fg-subtle">Error ref: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-divider px-4 py-2 text-sm font-medium text-fg hover:bg-surface-raised"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
