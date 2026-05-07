"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { ArrowDown, ArrowUp, Minus, PlayCircle } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import { runAudit, type AuditResults } from "../actions";
import { diffResults, type DiffSummary } from "../_lib/diff";

type State =
  | { kind: "idle" }
  | { kind: "running"; left: string; right: string }
  | { kind: "ready"; left: AuditResults; right: AuditResults; diff: DiffSummary }
  | { kind: "error"; message: string };

const DELTA_BADGE = {
  improved: { className: "bg-pass-soft text-pass", Icon: ArrowUp, label: "Improved" },
  regressed: { className: "bg-fail-soft text-fail", Icon: ArrowDown, label: "Regressed" },
  unchanged: { className: "bg-surface-raised text-fg-muted", Icon: Minus, label: "Unchanged" },
} as const;

export function AuditCompare() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const announce = useAnnounce();

  const start = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const a = left.trim();
    const b = right.trim();
    if (!a || !b) return;
    setState({ kind: "running", left: a, right: b });
    announce(`Comparing ${a} against ${b}.`, "polite");
    startTransition(async () => {
      const [aRes, bRes] = await Promise.all([runAudit(a), runAudit(b)]);
      if (!aRes.ok) return setState({ kind: "error", message: `Left: ${aRes.error}` });
      if (!bRes.ok) return setState({ kind: "error", message: `Right: ${bRes.error}` });
      const diff = diffResults(aRes.results, bRes.results);
      setState({ kind: "ready", left: aRes.results, right: bRes.results, diff });
      announce(
        `Comparison ready: ${diff.improved} improved, ${diff.regressed} regressed, ${diff.unchanged} unchanged.`,
        "polite"
      );
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={start} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="cmp-left" className="mb-1 block text-sm font-medium text-fg">
              Before URL
            </label>
            <input
              id="cmp-left"
              type="url"
              required
              placeholder="https://example.com/old"
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              disabled={pending}
              className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent disabled:bg-surface-raised"
            />
          </div>
          <div>
            <label htmlFor="cmp-right" className="mb-1 block text-sm font-medium text-fg">
              After URL
            </label>
            <input
              id="cmp-right"
              type="url"
              required
              placeholder="https://example.com/new"
              value={right}
              onChange={(e) => setRight(e.target.value)}
              disabled={pending}
              className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent disabled:bg-surface-raised"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending || !left.trim() || !right.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PlayCircle className="h-4 w-4" aria-hidden="true" />
          {pending ? "Comparing…" : "Compare"}
        </button>
      </form>

      {state.kind === "error" && (
        <div role="alert" className="rounded-md border border-fail/40 bg-fail-soft p-4 text-sm text-fail">
          <p className="font-semibold">Comparison failed</p>
          <p className="mt-1">{state.message}</p>
        </div>
      )}

      {state.kind === "ready" && (
        <div className="space-y-4">
          <div
            role="status"
            aria-live="polite"
            className="grid gap-3 rounded-md border border-divider bg-surface-raised p-4 text-sm sm:grid-cols-4"
          >
            <Stat label="Score Δ" value={(state.diff.scoreDelta >= 0 ? "+" : "") + state.diff.scoreDelta} tone={state.diff.scoreDelta > 0 ? "improved" : state.diff.scoreDelta < 0 ? "regressed" : "unchanged"} />
            <Stat label="Improved" value={state.diff.improved} tone="improved" />
            <Stat label="Regressed" value={state.diff.regressed} tone="regressed" />
            <Stat label="Unchanged" value={state.diff.unchanged} tone="unchanged" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-divider">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="border-b border-divider bg-surface-raised px-4 py-3 text-left font-semibold text-fg">
                <span className="break-all">{state.left.url}</span>{" "}
                <span className="text-fg-subtle">→</span>{" "}
                <span className="break-all">{state.right.url}</span>
              </caption>
              <thead className="bg-surface-raised text-fg-muted">
                <tr>
                  <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Check</th>
                  <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Before</th>
                  <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">After</th>
                  <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Delta</th>
                </tr>
              </thead>
              <tbody>
                {state.diff.rows.map((row) => {
                  const badge = DELTA_BADGE[row.delta];
                  return (
                    <tr key={row.id} className="border-b border-divider/60 align-top last:border-0">
                      <th scope="row" className="px-4 py-3 font-medium text-fg">
                        {row.name}
                      </th>
                      <td className="px-4 py-3 text-fg-muted">
                        {row.before.status}
                        {row.before.count != null ? ` (${row.before.count})` : ""}
                      </td>
                      <td className="px-4 py-3 text-fg-muted">
                        {row.after.status}
                        {row.after.count != null ? ` (${row.after.count})` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", badge.className)}>
                          <badge.Icon className="h-3 w-3" aria-hidden="true" />
                          {badge.label}
                          {row.countDelta != null && row.countDelta !== 0
                            ? ` (${row.countDelta > 0 ? "+" : ""}${row.countDelta})`
                            : ""}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "improved" | "regressed" | "unchanged";
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{label}</p>
      <p
        className={clsx(
          "mt-1 text-xl font-bold",
          tone === "improved" && "text-pass",
          tone === "regressed" && "text-fail",
          tone === "unchanged" && "text-fg"
        )}
      >
        {value}
      </p>
    </div>
  );
}
