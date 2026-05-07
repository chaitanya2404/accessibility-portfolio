import { accessibleNameFromContent, snippetFor, type Check } from "./types";
import type { HTMLElement } from "node-html-parser";

export const buttonNamesCheck: Check = {
  id: "button-names",
  name: "Buttons missing accessible names",
  wcagCriterion: "4.1.2 Name, Role, Value",
  severity: "critical",
  run(doc, html) {
    const issues: HTMLElement[] = [];
    for (const el of doc.querySelectorAll("button, [role=button]")) {
      if (el.getAttribute("aria-label")?.trim()) continue;
      if (el.getAttribute("aria-labelledby")?.trim()) continue;
      if (accessibleNameFromContent(el)) continue;
      if (el.querySelector("img[alt]")) continue;
      issues.push(el);
    }
    return {
      status: issues.length === 0 ? "pass" : "fail",
      summary:
        issues.length === 0
          ? "All buttons have an accessible name."
          : `${issues.length} button${issues.length === 1 ? "" : "s"} have no text content, aria-label, or aria-labelledby.`,
      count: issues.length,
      violations: issues.slice(0, 5).map((el) => snippetFor(el, html)),
    };
  },
};
