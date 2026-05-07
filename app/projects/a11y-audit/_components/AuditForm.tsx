"use client";

import { useState, useTransition } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import { track } from "@/lib/analytics";
import { runAudit, type AuditResults } from "../actions";
import { ResultsTable } from "./ResultsTable";
import { ExportButton } from "./ExportButton";

type State =
  | { kind: "idle" }
  | { kind: "running"; url: string }
  | { kind: "success"; url: string; results: AuditResults; cached: boolean }
  | { kind: "error"; url: string; error: string };

export function AuditForm() {
  const [url, setUrl] = useState("https://example.com");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const announce = useAnnounce();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();
    setState({ kind: "running", url: trimmed });
    announce(`Running audit on ${trimmed}.`, "polite");
    track("audit.run.started", { url: trimmed, mode: "single" });
    const start = Date.now();
    startTransition(async () => {
      const response = await runAudit(trimmed);
      const durationMs = Date.now() - start;
      if (response.ok) {
        setState({
          kind: "success",
          url: response.results.url,
          results: response.results,
          cached: response.cached,
        });
        announce(
          `Audit complete for ${response.results.url}. ${describeResults(response.results)}`,
          "polite"
        );
        track("audit.run.completed", {
          url: response.results.url,
          durationMs,
          passes: response.results.counts.pass,
          warnings: response.results.counts.warning,
          failures: response.results.counts.fail,
        });
      } else {
        setState({ kind: "error", url: trimmed, error: response.error });
        announce(`Audit failed: ${response.error}`, "assertive");
        track("audit.run.failed", { url: trimmed, reason: response.error });
      }
    });
  };

  const liveMessage =
    state.kind === "running"
      ? `Running audit on ${state.url}…`
      : state.kind === "success"
        ? `Audit complete for ${state.url}. ${describeResults(state.results)}${state.cached ? " (cached)" : ""}`
        : "";

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-3" aria-describedby="audit-disclaimer">
        <label htmlFor="audit-url" className="block text-sm font-medium text-fg">
          URL to audit
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="audit-url"
            name="url"
            type="url"
            inputMode="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={pending}
            className="flex-1 rounded-md border border-divider bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus-visible:border-accent disabled:bg-surface-raised"
          />
          <button
            type="submit"
            disabled={pending || !url.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-fg-subtle"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
            )}
            {pending ? "Running…" : "Run audit"}
          </button>
        </div>
      </form>

      <p
        role="status"
        aria-live="polite"
        className={liveMessage ? "text-sm text-fg-muted" : "sr-only"}
      >
        {liveMessage}
      </p>

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-md border border-fail/40 bg-fail-soft p-4 text-sm text-fail"
        >
          <p className="font-semibold">Audit failed</p>
          <p className="mt-1">{state.error}</p>
        </div>
      )}

      {state.kind === "success" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-fg-muted">
              {state.cached ? (
                <>
                  Served from cache (5-minute TTL).{" "}
                  <span className="font-mono text-xs">v{state.results.checksVersion}</span>
                </>
              ) : (
                <>Fetched and audited in {state.results.durationMs}ms.</>
              )}
            </p>
            <ExportButton results={state.results} />
          </div>
          <ResultsTable results={state.results} />
        </div>
      )}
    </div>
  );
}

function describeResults(r: AuditResults): string {
  const { pass, warning, fail } = r.counts;
  return `Score ${r.score}/100. ${pass} pass, ${warning} warning, ${fail} fail.`;
}
