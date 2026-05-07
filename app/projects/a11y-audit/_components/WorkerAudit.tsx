"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Cpu, Loader2, PlayCircle } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import { fetchAuditableHtml } from "../actions";

type Violation = {
  id: string;
  help: string;
  helpUrl: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  description: string;
  nodes: { html: string; failureSummary?: string; target: string[] }[];
};

type WorkerResult = {
  id: string;
  ok: true;
  violations: Violation[];
  passes: number;
  incomplete: number;
  url: string;
};

type WorkerError = { id: string; ok: false; error: string };

type State =
  | { kind: "idle" }
  | { kind: "fetching"; url: string }
  | { kind: "running"; url: string }
  | { kind: "ready"; url: string; result: WorkerResult }
  | { kind: "error"; message: string };

const IMPACT_BADGE: Record<NonNullable<Violation["impact"]>, string> = {
  critical: "bg-fail-soft text-fail border-fail/30",
  serious: "bg-fail-soft text-fail border-fail/30",
  moderate: "bg-warn-soft text-warn border-warn/30",
  minor: "bg-surface-raised text-fg-muted border-divider",
};

export function WorkerAudit() {
  const [url, setUrl] = useState("https://example.com");
  const [state, setState] = useState<State>({ kind: "idle" });
  const workerRef = useRef<Worker | null>(null);
  const announce = useAnnounce();

  useEffect(() => {
    const w = new Worker(new URL("../_workers/axe.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = w;
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, []);

  const start = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setState({ kind: "fetching", url: trimmed });
    announce(`Fetching ${trimmed}.`, "polite");

    const fetched = await fetchAuditableHtml(trimmed);
    if (!fetched.ok) {
      setState({ kind: "error", message: fetched.error });
      announce(`Fetch failed: ${fetched.error}`, "assertive");
      return;
    }

    setState({ kind: "running", url: fetched.url });
    announce(`Running axe-core in a worker against ${fetched.url}.`, "polite");

    const id = `axe_${Date.now()}`;
    const onMessage = (e: MessageEvent<WorkerResult | WorkerError>) => {
      if (e.data.id !== id) return;
      workerRef.current?.removeEventListener("message", onMessage);
      if (!e.data.ok) {
        setState({ kind: "error", message: e.data.error });
        announce(`Worker failed: ${e.data.error}`, "assertive");
        return;
      }
      setState({ kind: "ready", url: e.data.url, result: e.data });
      announce(
        `Worker complete. ${e.data.violations.length} violations, ${e.data.passes} passes, ${e.data.incomplete} inconclusive.`,
        "polite"
      );
    };

    workerRef.current?.addEventListener("message", onMessage);
    workerRef.current?.postMessage({ id, html: fetched.html, url: fetched.url });
  };

  const busy = state.kind === "fetching" || state.kind === "running";

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-warn/30 bg-warn-soft p-4 text-sm text-warn">
        <p className="font-semibold">Heads up: limits of static-HTML axe runs</p>
        <p className="mt-1">
          axe-core runs inside a Web Worker against a DOMParser-parsed
          document. Rules requiring computed styles (color contrast) or
          interaction (focus order, keyboard traps) report as <em>inconclusive</em>{" "}
          rather than pass/fail. For full coverage, run axe DevTools against
          a live browser.
        </p>
      </div>

      <form onSubmit={start} className="space-y-3">
        <label htmlFor="worker-url" className="block text-sm font-medium text-fg">
          URL for full audit
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="worker-url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={busy}
            className="flex-1 rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent disabled:bg-surface-raised"
          />
          <button
            type="submit"
            disabled={busy || !url.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-fg-subtle"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Cpu className="h-4 w-4" aria-hidden="true" />
            )}
            {state.kind === "fetching"
              ? "Fetching…"
              : state.kind === "running"
                ? "Running axe…"
                : "Run full audit"}
          </button>
        </div>
      </form>

      <p role="status" aria-live="polite" className={busy ? "text-sm text-fg-muted" : "sr-only"}>
        {state.kind === "fetching" && `Fetching ${state.url}…`}
        {state.kind === "running" && `Running axe-core in a worker against ${state.url}…`}
      </p>

      {state.kind === "error" && (
        <div role="alert" className="rounded-md border border-fail/40 bg-fail-soft p-4 text-sm text-fail">
          <p className="font-semibold">Audit failed</p>
          <p className="mt-1">{state.message}</p>
        </div>
      )}

      {state.kind === "ready" && (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-md border border-divider bg-surface-raised p-4 text-sm sm:grid-cols-3">
            <Stat label="Violations" value={state.result.violations.length} tone="fail" />
            <Stat label="Passes" value={state.result.passes} tone="pass" />
            <Stat label="Inconclusive" value={state.result.incomplete} tone="warn" />
          </div>

          {state.result.violations.length === 0 ? (
            <p className="rounded-md border border-pass/30 bg-pass-soft p-4 text-sm text-pass">
              No axe-core violations detected in the static HTML.
            </p>
          ) : (
            <ul className="space-y-3">
              {state.result.violations.map((v) => (
                <li key={v.id} className="rounded-md border border-divider bg-surface p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-fg">{v.help}</h3>
                    {v.impact && (
                      <span className={clsx("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", IMPACT_BADGE[v.impact])}>
                        {v.impact}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">{v.description}</p>
                  <a
                    href={v.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-xs font-medium text-accent hover:text-accent-strong"
                  >
                    Rule reference (opens in new tab) — {v.id}
                  </a>
                  <details className="mt-3 text-xs">
                    <summary className="cursor-pointer font-medium text-fg-subtle">
                      {v.nodes.length} affected node{v.nodes.length === 1 ? "" : "s"}
                    </summary>
                    <ul className="mt-2 space-y-2">
                      {v.nodes.map((n, i) => (
                        <li key={i} className="rounded border border-divider bg-surface-raised p-2">
                          <pre className="overflow-x-auto font-mono text-[11px]">
                            <code>{n.html}</code>
                          </pre>
                          {n.failureSummary && (
                            <p className="mt-1 text-fg-muted">{n.failureSummary}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {state.kind === "idle" && (
        <p className="text-sm text-fg-subtle">
          <PlayCircle className="mr-1 inline h-4 w-4 align-text-bottom" aria-hidden="true" />
          Click Run full audit to fetch the URL server-side and run axe-core
          inside a Web Worker.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "pass" | "fail" | "warn" }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{label}</p>
      <p
        className={clsx(
          "mt-1 text-2xl font-bold",
          tone === "pass" && "text-pass",
          tone === "fail" && "text-fail",
          tone === "warn" && "text-warn"
        )}
      >
        {value}
      </p>
    </div>
  );
}
