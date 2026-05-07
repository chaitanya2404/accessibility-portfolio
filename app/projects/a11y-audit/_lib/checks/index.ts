import { parse } from "node-html-parser";
import { langCheck } from "./lang";
import { titleCheck } from "./title";
import { headingHierarchyCheck } from "./heading-hierarchy";
import { landmarksCheck } from "./landmarks";
import { imagesAltCheck } from "./images-alt";
import { inputsLabelsCheck } from "./inputs-labels";
import { linkTextCheck } from "./link-text";
import { buttonNamesCheck } from "./button-names";
import { duplicateIdsCheck } from "./duplicate-ids";
import { positiveTabindexCheck } from "./positive-tabindex";
import { viewportZoomCheck } from "./viewport-zoom";
import { ariaRoleCheck } from "./aria-roles";
import {
  SEVERITY_WEIGHT,
  type Check,
  type CheckResult,
} from "./types";

export const ALL_CHECKS: Check[] = [
  langCheck,
  titleCheck,
  headingHierarchyCheck,
  landmarksCheck,
  imagesAltCheck,
  inputsLabelsCheck,
  linkTextCheck,
  buttonNamesCheck,
  duplicateIdsCheck,
  positiveTabindexCheck,
  viewportZoomCheck,
  ariaRoleCheck,
];

export function runChecks(html: string): CheckResult[] {
  const doc = parse(html, {
    blockTextElements: { script: false, style: false, pre: true, code: true },
  });
  return ALL_CHECKS.map((check) => ({
    id: check.id,
    name: check.name,
    wcagCriterion: check.wcagCriterion,
    severity: check.severity,
    ...check.run(doc, html),
  }));
}

export function scoreFromResults(results: CheckResult[]): {
  score: number;
  earned: number;
  max: number;
  counts: { pass: number; warning: number; fail: number };
} {
  let earned = 0;
  let max = 0;
  const counts = { pass: 0, warning: 0, fail: 0 };
  for (const r of results) {
    const w = SEVERITY_WEIGHT[r.severity];
    max += w;
    counts[r.status]++;
    if (r.status === "pass") earned += w;
    else if (r.status === "warning") earned += w * 0.5;
  }
  return {
    score: max === 0 ? 100 : Math.round((earned / max) * 100),
    earned,
    max,
    counts,
  };
}

export type { Check, CheckResult, CheckOutcome, Severity, Violation, CheckStatus } from "./types";
