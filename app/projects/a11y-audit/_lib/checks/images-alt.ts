import { snippetFor, type Check } from "./types";

export const imagesAltCheck: Check = {
  id: "images-alt",
  name: "Images missing alt",
  wcagCriterion: "1.1.1 Non-text Content",
  severity: "serious",
  run(doc, html) {
    const missing = doc
      .querySelectorAll("img")
      .filter((el) => el.getAttribute("alt") === undefined);
    return {
      status: missing.length === 0 ? "pass" : "warning",
      summary:
        missing.length === 0
          ? "Every <img> declares an alt attribute."
          : `${missing.length} image${missing.length === 1 ? "" : "s"} without alt.`,
      count: missing.length,
      violations: missing.slice(0, 5).map((el) => snippetFor(el, html)),
    };
  },
};
