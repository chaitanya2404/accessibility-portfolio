import type { HTMLElement } from "node-html-parser";

export type Severity = "critical" | "serious" | "moderate" | "minor";
export type CheckStatus = "pass" | "warning" | "fail";

export type Violation = {
  description: string;
  snippet?: string;
  line?: number;
};

export type CheckOutcome = {
  status: CheckStatus;
  summary: string;
  count?: number;
  violations: Violation[];
};

export type CheckResult = CheckOutcome & {
  id: string;
  name: string;
  wcagCriterion: string;
  severity: Severity;
};

export type Check = {
  id: string;
  name: string;
  wcagCriterion: string;
  severity: Severity;
  run(doc: HTMLElement, html: string): CheckOutcome;
};

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 5,
  serious: 3,
  moderate: 2,
  minor: 1,
};

export function snippetFor(el: HTMLElement, html: string): Violation {
  const outer = el.outerHTML.replace(/\s+/g, " ").trim();
  const truncated = outer.length > 240 ? outer.slice(0, 240) + "…" : outer;
  let line: number | undefined;
  const range = el.range as [number, number] | undefined;
  if (range && Array.isArray(range)) {
    line = html.slice(0, range[0]).split("\n").length;
  }
  return { description: truncated, snippet: truncated, line };
}

export function accessibleNameFromContent(el: HTMLElement): string {
  return el.text.replace(/\s+/g, " ").trim();
}
