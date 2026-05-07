import type { Check } from "./types";

export const viewportZoomCheck: Check = {
  id: "viewport-zoom",
  name: "Viewport allows zoom",
  wcagCriterion: "1.4.4 Resize Text",
  severity: "serious",
  run(doc) {
    const meta = doc.querySelector('meta[name="viewport"]');
    const content = meta?.getAttribute("content")?.toLowerCase() ?? "";
    const blocksZoom =
      content.includes("user-scalable=no") ||
      /maximum-scale\s*=\s*1(?!\d)/.test(content);
    return {
      status: blocksZoom ? "fail" : "pass",
      summary: blocksZoom
        ? `Viewport meta blocks pinch-zoom: "${content}".`
        : meta
          ? "Viewport meta does not restrict scaling."
          : "No viewport meta declared (browser uses default scaling).",
      violations: [],
    };
  },
};
