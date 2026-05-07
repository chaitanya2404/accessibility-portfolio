import { snippetFor, type Check } from "./types";

const NON_LABELABLE_INPUT_TYPES = new Set([
  "hidden",
  "submit",
  "button",
  "reset",
  "image",
]);

export const inputsLabelsCheck: Check = {
  id: "inputs-labels",
  name: "Inputs missing labels",
  wcagCriterion: "3.3.2 Labels or Instructions",
  severity: "serious",
  run(doc, html) {
    const missing = doc.querySelectorAll("input").filter((el) => {
      const type = (el.getAttribute("type") ?? "text").toLowerCase();
      if (NON_LABELABLE_INPUT_TYPES.has(type)) return false;
      if (el.getAttribute("aria-label")?.trim()) return false;
      if (el.getAttribute("aria-labelledby")?.trim()) return false;
      const id = el.getAttribute("id");
      if (id && doc.querySelector(`label[for="${id}"]`)) return false;
      return true;
    });
    return {
      status: missing.length === 0 ? "pass" : "warning",
      summary:
        missing.length === 0
          ? "Every text input has an accessible name."
          : `${missing.length} input${missing.length === 1 ? "" : "s"} without label, aria-label, or aria-labelledby.`,
      count: missing.length,
      violations: missing.slice(0, 5).map((el) => snippetFor(el, html)),
    };
  },
};
