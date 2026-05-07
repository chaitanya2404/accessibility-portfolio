import clsx from "clsx";
import { Check, AlertTriangle, X } from "lucide-react";
import type { AuditResults } from "../actions";

type Status = "pass" | "warning" | "fail";

type Row = {
  check: string;
  status: Status;
  details: React.ReactNode;
};

const BADGE_STYLES: Record<Status, string> = {
  pass: "bg-emerald-100 text-emerald-900 border-emerald-300",
  warning: "bg-amber-100 text-amber-900 border-amber-300",
  fail: "bg-rose-100 text-rose-900 border-rose-300",
};

const STATUS_ICONS: Record<Status, React.ComponentType<{ className?: string }>> = {
  pass: Check,
  warning: AlertTriangle,
  fail: X,
};

const STATUS_LABEL: Record<Status, string> = {
  pass: "Pass",
  warning: "Warning",
  fail: "Fail",
};

function StatusBadge({ status }: { status: Status }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        BADGE_STYLES[status]
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function rowsFrom(results: AuditResults): Row[] {
  return [
    {
      check: "<html lang> attribute",
      status: results.lang.ok ? "pass" : "fail",
      details: results.lang.ok ? (
        <>
          Found: <code className="rounded bg-slate-100 px-1 py-0.5">{results.lang.value}</code>
        </>
      ) : (
        "Missing or empty. Set lang=\"en\" (or the appropriate code) on <html>."
      ),
    },
    {
      check: "<title> element",
      status: results.title.ok ? "pass" : "fail",
      details: results.title.ok ? (
        <>
          “{results.title.value}”
        </>
      ) : (
        "Missing or empty. Add a descriptive <title> in <head>."
      ),
    },
    {
      check: "Images missing alt",
      status: results.imagesMissingAlt.count === 0 ? "pass" : "warning",
      details:
        results.imagesMissingAlt.count === 0 ? (
          "Every <img> declares an alt attribute."
        ) : (
          <>
            <p className="mb-1">
              {results.imagesMissingAlt.count}{" "}
              {results.imagesMissingAlt.count === 1 ? "image" : "images"} without an{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">alt</code> attribute.
              Decorative images need <code className="rounded bg-slate-100 px-1 py-0.5">alt=&quot;&quot;</code>;
              meaningful images need a description.
            </p>
            <p className="text-xs font-medium text-slate-600">First {results.imagesMissingAlt.samples.length}:</p>
            <ul className="mt-1 space-y-1 text-xs text-slate-700">
              {results.imagesMissingAlt.samples.map((src, i) => (
                <li key={i}>
                  <code className="break-all rounded bg-slate-100 px-1 py-0.5">{src}</code>
                </li>
              ))}
            </ul>
          </>
        ),
    },
    {
      check: "Inputs missing labels",
      status: results.inputsMissingLabels.count === 0 ? "pass" : "warning",
      details:
        results.inputsMissingLabels.count === 0 ? (
          "Every text input has a label, aria-label, or aria-labelledby."
        ) : (
          <>
            <p className="mb-1">
              {results.inputsMissingLabels.count}{" "}
              {results.inputsMissingLabels.count === 1 ? "input" : "inputs"} without an
              associated label, aria-label, or aria-labelledby. (Hidden, submit, button,
              reset, and image inputs are excluded.)
            </p>
            <p className="text-xs font-medium text-slate-600">First {results.inputsMissingLabels.samples.length}:</p>
            <ul className="mt-1 space-y-1 text-xs text-slate-700">
              {results.inputsMissingLabels.samples.map((sample, i) => (
                <li key={i}>
                  <code className="break-all rounded bg-slate-100 px-1 py-0.5">{sample}</code>
                </li>
              ))}
            </ul>
          </>
        ),
    },
  ];
}

export function ResultsTable({
  results,
  url,
}: {
  results: AuditResults;
  url: string;
}) {
  const rows = rowsFrom(results);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900">
          Audit results for <span className="break-all font-mono text-indigo-800">{url}</span>
        </caption>
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th scope="col" className="border-b border-slate-200 px-4 py-3 font-semibold">
              Check
            </th>
            <th scope="col" className="border-b border-slate-200 px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="border-b border-slate-200 px-4 py-3 font-semibold">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.check} className="border-b border-slate-100 last:border-0 align-top">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-slate-900"
              >
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{row.check}</code>
              </th>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-slate-700">{row.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
