import { accessibleNameFromContent, snippetFor, type Check } from "./types";
import type { HTMLElement } from "node-html-parser";

const VAGUE_LINK_TEXTS = new Set([
  "click here",
  "here",
  "read more",
  "learn more",
  "more",
  "details",
  "this",
  "link",
]);

export const linkTextCheck: Check = {
  id: "link-text",
  name: "Link text quality",
  wcagCriterion: "2.4.4 Link Purpose (In Context)",
  severity: "moderate",
  run(doc, html) {
    const issues: HTMLElement[] = [];
    for (const a of doc.querySelectorAll("a")) {
      if (!a.getAttribute("href")) continue;
      if (a.getAttribute("aria-label")?.trim()) continue;
      const text = accessibleNameFromContent(a);
      if (!text) {
        issues.push(a);
        continue;
      }
      if (VAGUE_LINK_TEXTS.has(text.toLowerCase())) issues.push(a);
    }
    return {
      status: issues.length === 0 ? "pass" : "warning",
      summary:
        issues.length === 0
          ? "All links have descriptive text."
          : `${issues.length} link${issues.length === 1 ? "" : "s"} with empty or vague text (e.g. "click here").`,
      count: issues.length,
      violations: issues.slice(0, 5).map((el) => snippetFor(el, html)),
    };
  },
};
