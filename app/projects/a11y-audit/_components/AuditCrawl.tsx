"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, PlayCircle, StopCircle } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import { track } from "@/lib/analytics";
import type { AuditResults } from "../actions";
import { ResultsTable } from "./ResultsTable";
import { ExportButton } from "./ExportButton";

type CrawlPage =
  | { kind: "ok"; results: AuditResults }
  | { kind: "error"; url: string; error: string };

type CrawlState =
  | { kind: "idle" }
  | { kind: "running"; entryUrl: string; pages: CrawlPage[]; total: number }
  | { kind: "complete"; entryUrl: string; pages: CrawlPage[]; total: number; durationMs: number }
  | { kind: "error"; entryUrl: string; error: string };

export function AuditCrawl() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<CrawlState>({ kind: "idle" });
  const sourceRef = useRef<EventSource | null>(null);
  const announce = useAnnounce();

  useEffect(() => {
    return () => {
      sourceRef.current?.close();
    };
  }, []);

  const stop = () => {
    sourceRef.current?.close();
    sourceRef.current = null;
    setState((cur) =>
      cur.kind === "running"
        ? { kind: "complete", entryUrl: cur.entryUrl, pages: cur.pages, total: cur.total, durationMs: 0 }
        : cur
    );
  };

  const start = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    const startedAt = Date.now();
    setState({ kind: "running", entryUrl: trimmed, pages: [], total: 0 });
    announce(`Starting crawl of ${trimmed}.`, "polite");
    track("audit.run.started", { url: trimmed, mode: "crawl" });

    const source = new EventSource(`/api/audit-crawl?url=${encodeURIComponent(trimmed)}`);
    sourceRef.current = source;

    source.addEventListener("plan", (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as { total: number };
        setState((cur) =>
          cur.kind === "running" ? { ...cur, total: data.total } : cur
        );
        announce(`Crawl plan: ${data.total} page${data.total === 1 ? "" : "s"}.`, "polite");
      } catch {
        // ignore
      }
    });

    source.addEventListener("page-complete", (e) => {
      try {
        const raw = JSON.parse((e as MessageEvent).data);
        const page: CrawlPage = raw.page
          ? { kind: "ok", results: raw.page }
          : { kind: "error", url: raw.url ?? trimmed, error: raw.error ?? "Unknown" };
        setState((cur) => {
          if (cur.kind !== "running") return cur;
          const total = raw.total ?? cur.total;
          return { ...cur, pages: [...cur.pages, page], total };
        });
        announce(
          page.kind === "ok"
            ? `Audited ${raw.index} of ${raw.total}: ${page.results.url}.`
            : `Audit failed for page ${raw.index}: ${page.error}.`,
          "polite"
        );
      } catch {
        // ignore
      }
    });

    source.addEventListener("done", () => {
      source.close();
      sourceRef.current = null;
      setState((cur) =>
        cur.kind === "running"
          ? {
              kind: "complete",
              entryUrl: cur.entryUrl,
              pages: cur.pages,
              total: cur.total,
              durationMs: Date.now() - startedAt,
            }
          : cur
      );
      announce("Crawl complete.", "polite");
    });

    source.addEventListener("error", (e) => {
      let message = "Crawl failed.";
      try {
        message = JSON.parse((e as MessageEvent).data ?? "{}").message ?? message;
      } catch {
        // ignore
      }
      source.close();
      sourceRef.current = null;
      setState({ kind: "error", entryUrl: trimmed, error: message });
      announce(`Crawl failed: ${message}`, "assertive");
      track("audit.run.failed", { url: trimmed, reason: message });
    });
  };

  const running = state.kind === "running";
  const total = state.kind === "running" || state.kind === "complete" ? state.total : 0;
  const completed =
    state.kind === "running" || state.kind === "complete" ? state.pages.length : 0;

  return (
    <div className="space-y-6">
      <form onSubmit={start} className="space-y-3">
        <label htmlFor="crawl-url" className="block text-sm font-medium text-fg">
          Entry URL (audits up to 5 same-origin pages)
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="crawl-url"
            type="url"
            inputMode="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={running}
            className="flex-1 rounded-md border border-divider bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus-visible:border-accent disabled:bg-surface-raised"
          />
          {running ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-divider bg-surface px-4 py-2 text-sm font-semibold text-fg hover:bg-surface-raised"
            >
              <StopCircle className="h-4 w-4" aria-hidden="true" />
              Stop crawl
            </button>
          ) : (
            <button
              type="submit"
              disabled={!url.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-fg-subtle"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Start crawl
            </button>
          )}
        </div>
      </form>

      {(state.kind === "running" || state.kind === "complete") && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="crawl-progress" className="font-medium text-fg-muted">
              {running ? "Crawling…" : "Crawl complete"}
            </label>
            <span className="font-mono text-xs text-fg-subtle">
              {completed} / {total || "?"} pages
            </span>
          </div>
          <progress
            id="crawl-progress"
            value={completed}
            max={total || completed || 1}
            className="h-2 w-full overflow-hidden rounded-full bg-surface-raised"
          />
          <p role="status" aria-live="polite" className="sr-only">
            {running
              ? `Audited ${completed} of ${total || "unknown"} pages.`
              : `Crawl complete. ${completed} pages audited.`}
          </p>
        </div>
      )}

      {state.kind === "error" && (
        <div role="alert" className="rounded-md border border-fail/40 bg-fail-soft p-4 text-sm text-fail">
          <p className="font-semibold">Crawl failed</p>
          <p className="mt-1">{state.error}</p>
        </div>
      )}

      {(state.kind === "running" || state.kind === "complete") && state.pages.length > 0 && (
        <div className="space-y-6">
          {state.kind === "complete" && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-fg-muted">
                Crawled {state.pages.length} page{state.pages.length === 1 ? "" : "s"} in {state.durationMs}ms.
              </p>
              <ExportButton
                mode="crawl"
                results={{
                  mode: "crawl",
                  entryUrl: state.entryUrl,
                  pages: state.pages
                    .filter((p): p is { kind: "ok"; results: AuditResults } => p.kind === "ok")
                    .map((p) => p.results),
                }}
              />
            </div>
          )}
          {state.pages.map((p, i) =>
            p.kind === "ok" ? (
              <div key={`${p.results.url}-${i}`} className="space-y-2">
                {running && completed === i + 1 && (
                  <p className="flex items-center gap-2 text-xs text-fg-subtle">
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    Just audited
                  </p>
                )}
                <ResultsTable results={p.results} />
              </div>
            ) : (
              <div
                key={`error-${i}`}
                className="rounded-md border border-fail/40 bg-fail-soft p-4 text-sm text-fail"
              >
                <p className="font-mono text-xs">{p.url}</p>
                <p className="mt-1">{p.error}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
