import { snippetFor, type Check } from "./types";

export const positiveTabindexCheck: Check = {
  id: "positive-tabindex",
  name: "Positive tabindex",
  wcagCriterion: "2.4.3 Focus Order",
  severity: "moderate",
  run(doc, html) {
    const positive = doc.querySelectorAll("[tabindex]").filter((el) => {
      const v = Number.parseInt(el.getAttribute("tabindex") ?? "0", 10);
      return Number.isFinite(v) && v > 0;
    });
    return {
      status: positive.length === 0 ? "pass" : "warning",
      summary:
        positive.length === 0
          ? "No positive tabindex values."
          : `${positive.length} element${positive.length === 1 ? "" : "s"} use tabindex>0, which disrupts the natural tab order.`,
      count: positive.length,
      violations: positive.slice(0, 5).map((el) => snippetFor(el, html)),
    };
  },
};
