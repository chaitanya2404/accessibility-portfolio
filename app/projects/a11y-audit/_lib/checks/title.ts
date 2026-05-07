import type { Check } from "./types";

export const titleCheck: Check = {
  id: "title",
  name: "<title> element",
  wcagCriterion: "2.4.2 Page Titled",
  severity: "serious",
  run(doc) {
    const value = doc.querySelector("title")?.text?.trim() ?? "";
    return value
      ? { status: "pass", summary: `Found: "${value}"`, violations: [] }
      : {
          status: "fail",
          summary: "Missing or empty. Add a descriptive <title> in <head>.",
          violations: [],
        };
  },
};
