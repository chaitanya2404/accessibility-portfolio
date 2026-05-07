import type { Check } from "./types";

export const langCheck: Check = {
  id: "lang",
  name: "<html lang> attribute",
  wcagCriterion: "3.1.1 Language of Page",
  severity: "serious",
  run(doc) {
    const value = doc.querySelector("html")?.getAttribute("lang")?.trim() ?? "";
    return value
      ? { status: "pass", summary: `Found: "${value}"`, violations: [] }
      : {
          status: "fail",
          summary: "Missing or empty. Set lang=\"en\" (or appropriate code) on <html>.",
          violations: [],
        };
  },
};
