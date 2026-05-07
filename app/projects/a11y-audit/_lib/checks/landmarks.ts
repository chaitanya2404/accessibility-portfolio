import type { Check } from "./types";

export const landmarksCheck: Check = {
  id: "landmarks",
  name: "Landmark regions",
  wcagCriterion: "1.3.1 Info and Relationships",
  severity: "moderate",
  run(doc) {
    const present = {
      main: doc.querySelectorAll("main, [role=main]").length > 0,
      header: doc.querySelectorAll("header, [role=banner]").length > 0,
      footer: doc.querySelectorAll("footer, [role=contentinfo]").length > 0,
      nav: doc.querySelectorAll("nav, [role=navigation]").length > 0,
    };
    const missing = Object.entries(present).filter(([, ok]) => !ok).map(([k]) => k);
    return {
      status: missing.length === 0 ? "pass" : missing.includes("main") ? "fail" : "warning",
      summary:
        missing.length === 0
          ? "All four landmarks present (main, header, footer, nav)."
          : `Missing: ${missing.join(", ")}.`,
      count: missing.length,
      violations: [],
    };
  },
};
