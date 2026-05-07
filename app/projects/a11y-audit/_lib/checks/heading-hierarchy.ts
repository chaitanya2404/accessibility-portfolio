import { snippetFor, type Check } from "./types";
import type { HTMLElement } from "node-html-parser";

export const headingHierarchyCheck: Check = {
  id: "heading-hierarchy",
  name: "Heading hierarchy",
  wcagCriterion: "1.3.1 Info and Relationships",
  severity: "serious",
  run(doc, html) {
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const h1s = doc.querySelectorAll("h1");

    if (h1s.length === 0) {
      return {
        status: "fail",
        summary: "No <h1> on the page.",
        violations: [],
      };
    }

    const issues: HTMLElement[] = [];
    if (h1s.length > 1) issues.push(...h1s.slice(1));

    let last = 0;
    for (const h of headings) {
      const level = Number.parseInt(h.tagName.slice(1), 10);
      if (last && level > last + 1) issues.push(h);
      last = level;
    }

    return {
      status: issues.length === 0 ? "pass" : "warning",
      summary:
        issues.length === 0
          ? `Single h1 and no skipped levels across ${headings.length} heading${headings.length === 1 ? "" : "s"}.`
          : `${issues.length} heading issue${issues.length === 1 ? "" : "s"}: extra h1s or skipped levels.`,
      count: issues.length,
      violations: issues.slice(0, 5).map((el) => snippetFor(el, html)),
    };
  },
};
