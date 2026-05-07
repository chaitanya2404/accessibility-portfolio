import { snippetFor, type Check } from "./types";
import type { HTMLElement } from "node-html-parser";

export const duplicateIdsCheck: Check = {
  id: "duplicate-ids",
  name: "Duplicate id attributes",
  wcagCriterion: "4.1.1 Parsing",
  severity: "moderate",
  run(doc, html) {
    const seen = new Map<string, HTMLElement[]>();
    for (const el of doc.querySelectorAll("[id]")) {
      const id = el.getAttribute("id");
      if (!id) continue;
      const list = seen.get(id) ?? [];
      list.push(el);
      seen.set(id, list);
    }
    const dups = [...seen.entries()].filter(([, els]) => els.length > 1);
    return {
      status: dups.length === 0 ? "pass" : "warning",
      summary:
        dups.length === 0
          ? "All id attributes are unique."
          : `${dups.length} id value${dups.length === 1 ? "" : "s"} appear on multiple elements.`,
      count: dups.length,
      violations: dups.slice(0, 5).map(([id, els]) => {
        const first = snippetFor(els[0], html);
        return {
          description: `id="${id}" used ${els.length} times`,
          snippet: first.snippet,
          line: first.line,
        };
      }),
    };
  },
};
