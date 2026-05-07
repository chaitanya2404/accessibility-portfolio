"use client";

import { Download } from "lucide-react";
import { track } from "@/lib/analytics";
import type { AuditResults } from "../actions";

export function ExportButton({
  results,
  mode = "single",
}: {
  results: AuditResults | { mode: "crawl"; pages: AuditResults[]; entryUrl: string };
  mode?: "single" | "crawl";
}) {
  const onClick = () => {
    const payload = JSON.stringify(results, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const host = (() => {
      try {
        const target = "url" in results ? results.url : results.entryUrl;
        return new URL(target).host;
      } catch {
        return "audit";
      }
    })();
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `audit-${host}-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    track("audit.export.downloaded", {
      url: "url" in results ? results.url : results.entryUrl,
      mode,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-divider bg-surface px-3 py-2 text-sm font-medium text-fg hover:bg-surface-raised"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Download report (JSON)
    </button>
  );
}
