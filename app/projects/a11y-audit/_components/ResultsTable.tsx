import clsx from "clsx";
import { Check, AlertTriangle, X } from "lucide-react";
import type { AuditResults } from "../actions";
import type { CheckResult, CheckStatus, Severity } from "../_lib/checks";

const STATUS_BADGE: Record<CheckStatus, { className: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  pass: { className: "bg-pass-soft text-pass border-pass/30", label: "Pass", Icon: Check },
  warning: { className: "bg-warn-soft text-warn border-warn/30", label: "Warning", Icon: AlertTriangle },
  fail: { className: "bg-fail-soft text-fail border-fail/40", label: "Fail", Icon: X },
};

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  serious: "Serious",
  moderate: "Moderate",
  minor: "Minor",
};

function StatusBadge({ status }: { status: CheckStatus }) {
  const { className, label, Icon } = STATUS_BADGE[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

function ViolationList({ check }: { check: CheckResult }) {
  if (check.violations.length === 0) return null;
  return (
    <details className="mt-2 text-xs">
      <summary className="cursor-pointer font-medium text-fg-subtle">
        Show first {check.violations.length} violation{check.violations.length === 1 ? "" : "s"}
      </summary>
      <ul className="mt-2 space-y-2">
        {check.violations.map((v, i) => (
          <li key={i} className="rounded border border-divider bg-surface-raised p-2">
            <p className="mb-1 text-fg-muted">{v.description}</p>
            {v.snippet ? (
              <pre
                aria-label="HTML snippet for violation"
                className="overflow-x-auto rounded bg-surface-sunken p-2 font-mono text-[11px] text-fg"
              >
                <code>{v.snippet}</code>
              </pre>
            ) : null}
            {v.line ? (
              <p className="mt-1 text-fg-subtle">Line {v.line}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </details>
  );
}

export function ResultsTable({ results }: { results: AuditResults }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-divider">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="border-b border-divider bg-surface-raised px-4 py-3 text-left text-sm font-semibold text-fg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Audit for <span className="break-all font-mono text-accent">{results.url}</span>
            </span>
            <span className="font-mono text-xs text-fg-subtle">
              Score {results.score}/100 · {results.counts.pass} pass · {results.counts.warning} warn · {results.counts.fail} fail · {results.durationMs}ms
            </span>
          </div>
        </caption>
        <thead className="bg-surface-raised text-fg-muted">
          <tr>
            <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Check</th>
            <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">WCAG</th>
            <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Severity</th>
            <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Status</th>
            <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          {results.checks.map((check) => (
            <tr key={check.id} className="border-b border-divider/60 align-top last:border-0">
              <th scope="row" className="px-4 py-3 text-left font-medium text-fg">
                {check.name}
              </th>
              <td className="px-4 py-3 text-xs text-fg-subtle">{check.wcagCriterion}</td>
              <td className="px-4 py-3 text-xs text-fg-muted">{SEVERITY_LABEL[check.severity]}</td>
              <td className="px-4 py-3">
                <StatusBadge status={check.status} />
              </td>
              <td className="px-4 py-3 text-fg-muted">
                <p>{check.summary}</p>
                <ViolationList check={check} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
