"use client";

import { useState, useTransition } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { runAudit, type AuditResults } from "../actions";
import { ResultsTable } from "./ResultsTable";

type State =
  | { kind: "idle" }
  | { kind: "running"; url: string }
  | { kind: "success"; url: string; results: AuditResults }
  | { kind: "error"; url: string; error: string };

export function AuditForm() {
  const [url, setUrl] = useState("https://example.com");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();
    setState({ kind: "running", url: trimmed });
    startTransition(async () => {
      const response = await runAudit(trimmed);
      if (response.ok) {
        setState({ kind: "success", url: response.url, results: response.results });
      } else {
        setState({ kind: "error", url: trimmed, error: response.error });
      }
    });
  };

  const liveMessage =
    state.kind === "running"
      ? `Running audit on ${state.url}…`
      : state.kind === "success"
        ? `Audit complete for ${state.url}. ${describeResults(state.results)}`
        : "";

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-3" aria-describedby="audit-disclaimer">
        <label htmlFor="audit-url" className="block text-sm font-medium text-slate-800">
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
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:border-indigo-700 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={pending || !url.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-400"
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
        className={liveMessage ? "text-sm text-slate-700" : "sr-only"}
      >
        {liveMessage}
      </p>

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
        >
          <p className="font-semibold">Audit failed</p>
          <p className="mt-1">{state.error}</p>
        </div>
      )}

      {state.kind === "success" && (
        <ResultsTable results={state.results} url={state.url} />
      )}
    </div>
  );
}

function describeResults(r: AuditResults): string {
  const parts: string[] = [];
  parts.push(r.lang.ok ? "Lang attribute present." : "Lang attribute missing.");
  parts.push(r.title.ok ? "Title present." : "Title missing.");
  parts.push(`${r.imagesMissingAlt.count} images missing alt.`);
  parts.push(`${r.inputsMissingLabels.count} inputs missing labels.`);
  return parts.join(" ");
}
