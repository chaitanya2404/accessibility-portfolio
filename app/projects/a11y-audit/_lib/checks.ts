import { parse, type HTMLElement } from "node-html-parser";
import { isValidRole, VALID_ARIA_ROLES } from "./aria-roles";

export type CheckStatus = "pass" | "warning" | "fail";

export type Violation = {
  description: string;
  snippet?: string;
  line?: number;
};

export type CheckResult = {
  id: string;
  label: string;
  status: CheckStatus;
  summary: string;
  count?: number;
  violations: Violation[];
};

const NON_LABELABLE_INPUT_TYPES = new Set([
  "hidden",
  "submit",
  "button",
  "reset",
  "image",
]);

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

function snippet(el: HTMLElement, html: string): Violation {
  const outer = el.outerHTML.replace(/\s+/g, " ").trim();
  const truncated = outer.length > 240 ? outer.slice(0, 240) + "…" : outer;

  let line: number | undefined;
  const range = el.range as [number, number] | undefined;
  if (range && Array.isArray(range)) {
    line = html.slice(0, range[0]).split("\n").length;
  }
  return { description: truncated, snippet: truncated, line };
}

function accessibleNameFromContent(el: HTMLElement): string {
  return el.text.replace(/\s+/g, " ").trim();
}

function langCheck(doc: HTMLElement): CheckResult {
  const html = doc.querySelector("html");
  const value = html?.getAttribute("lang")?.trim() ?? "";
  return {
    id: "lang",
    label: "<html lang> attribute",
    status: value ? "pass" : "fail",
    summary: value ? `Found: "${value}"` : "Missing or empty.",
    violations: [],
  };
}

function titleCheck(doc: HTMLElement): CheckResult {
  const t = doc.querySelector("title")?.text?.trim() ?? "";
  return {
    id: "title",
    label: "<title> element",
    status: t ? "pass" : "fail",
    summary: t ? `Found: "${t}"` : "Missing or empty.",
    violations: [],
  };
}

function imagesAltCheck(doc: HTMLElement, html: string): CheckResult {
  const missing = doc
    .querySelectorAll("img")
    .filter((el) => el.getAttribute("alt") === undefined);
  return {
    id: "images-alt",
    label: "Images missing alt",
    status: missing.length === 0 ? "pass" : "warning",
    summary:
      missing.length === 0
        ? "Every <img> declares an alt attribute."
        : `${missing.length} image${missing.length === 1 ? "" : "s"} without alt.`,
    count: missing.length,
    violations: missing.slice(0, 5).map((el) => snippet(el, html)),
  };
}

function inputsLabelsCheck(doc: HTMLElement, html: string): CheckResult {
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
    id: "inputs-labels",
    label: "Inputs missing labels",
    status: missing.length === 0 ? "pass" : "warning",
    summary:
      missing.length === 0
        ? "Every text input has an accessible name."
        : `${missing.length} input${missing.length === 1 ? "" : "s"} without label, aria-label, or aria-labelledby.`,
    count: missing.length,
    violations: missing.slice(0, 5).map((el) => snippet(el, html)),
  };
}

function headingHierarchyCheck(doc: HTMLElement, html: string): CheckResult {
  const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const h1Count = doc.querySelectorAll("h1").length;
  const issues: HTMLElement[] = [];

  if (h1Count === 0) {
    return {
      id: "heading-hierarchy",
      label: "Heading hierarchy",
      status: "fail",
      summary: "No <h1> on the page.",
      violations: [],
    };
  }

  if (h1Count > 1) {
    issues.push(...doc.querySelectorAll("h1").slice(1));
  }

  let last = 0;
  for (const h of headings) {
    const level = Number.parseInt(h.tagName.slice(1), 10);
    if (last && level > last + 1) {
      issues.push(h);
    }
    last = level;
  }

  return {
    id: "heading-hierarchy",
    label: "Heading hierarchy",
    status: issues.length === 0 ? "pass" : "warning",
    summary:
      issues.length === 0
        ? `Single h1 and no skipped levels across ${headings.length} heading${headings.length === 1 ? "" : "s"}.`
        : `${issues.length} heading issue${issues.length === 1 ? "" : "s"}: extra h1s or skipped levels.`,
    count: issues.length,
    violations: issues.slice(0, 5).map((el) => snippet(el, html)),
  };
}

function landmarksCheck(doc: HTMLElement): CheckResult {
  const found = {
    main: doc.querySelectorAll("main, [role=main]").length > 0,
    header: doc.querySelectorAll("header, [role=banner]").length > 0,
    footer: doc.querySelectorAll("footer, [role=contentinfo]").length > 0,
    nav: doc.querySelectorAll("nav, [role=navigation]").length > 0,
  };
  const missing = Object.entries(found).filter(([, ok]) => !ok).map(([k]) => k);
  return {
    id: "landmarks",
    label: "Landmark regions",
    status: missing.length === 0 ? "pass" : missing.includes("main") ? "fail" : "warning",
    summary:
      missing.length === 0
        ? "All four landmarks present (main, header, footer, nav)."
        : `Missing: ${missing.join(", ")}.`,
    count: missing.length,
    violations: [],
  };
}

function linkTextCheck(doc: HTMLElement, html: string): CheckResult {
  const issues: HTMLElement[] = [];
  for (const a of doc.querySelectorAll("a")) {
    if (!a.getAttribute("href")) continue;
    const aria = a.getAttribute("aria-label")?.trim();
    if (aria) continue;
    const text = accessibleNameFromContent(a);
    if (!text) {
      issues.push(a);
      continue;
    }
    if (VAGUE_LINK_TEXTS.has(text.toLowerCase())) {
      issues.push(a);
    }
  }
  return {
    id: "link-text",
    label: "Link text quality",
    status: issues.length === 0 ? "pass" : "warning",
    summary:
      issues.length === 0
        ? "All links have descriptive text."
        : `${issues.length} link${issues.length === 1 ? "" : "s"} with empty or vague text (e.g. "click here").`,
    count: issues.length,
    violations: issues.slice(0, 5).map((el) => snippet(el, html)),
  };
}

function duplicateIdsCheck(doc: HTMLElement, html: string): CheckResult {
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
    id: "duplicate-ids",
    label: "Duplicate id attributes",
    status: dups.length === 0 ? "pass" : "warning",
    summary:
      dups.length === 0
        ? "All id attributes are unique."
        : `${dups.length} id value${dups.length === 1 ? "" : "s"} appear on multiple elements.`,
    count: dups.length,
    violations: dups.slice(0, 5).map(([id, els]) => ({
      description: `id="${id}" used ${els.length} times`,
      snippet: snippet(els[0], html).snippet,
      line: snippet(els[0], html).line,
    })),
  };
}

function tabindexCheck(doc: HTMLElement, html: string): CheckResult {
  const positive = doc.querySelectorAll("[tabindex]").filter((el) => {
    const v = Number.parseInt(el.getAttribute("tabindex") ?? "0", 10);
    return Number.isFinite(v) && v > 0;
  });
  return {
    id: "positive-tabindex",
    label: "Positive tabindex",
    status: positive.length === 0 ? "pass" : "warning",
    summary:
      positive.length === 0
        ? "No positive tabindex values."
        : `${positive.length} element${positive.length === 1 ? "" : "s"} use tabindex>0, which disrupts the natural tab order.`,
    count: positive.length,
    violations: positive.slice(0, 5).map((el) => snippet(el, html)),
  };
}

function buttonNamesCheck(doc: HTMLElement, html: string): CheckResult {
  const issues: HTMLElement[] = [];
  for (const el of doc.querySelectorAll("button, [role=button]")) {
    if (el.getAttribute("aria-label")?.trim()) continue;
    if (el.getAttribute("aria-labelledby")?.trim()) continue;
    if (accessibleNameFromContent(el)) continue;
    if (el.querySelector("img[alt]")) continue;
    issues.push(el);
  }
  return {
    id: "button-names",
    label: "Buttons missing accessible names",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "All buttons have an accessible name."
        : `${issues.length} button${issues.length === 1 ? "" : "s"} have no text content, aria-label, or aria-labelledby.`,
    count: issues.length,
    violations: issues.slice(0, 5).map((el) => snippet(el, html)),
  };
}

function viewportCheck(doc: HTMLElement): CheckResult {
  const meta = doc.querySelector('meta[name="viewport"]');
  const content = meta?.getAttribute("content")?.toLowerCase() ?? "";
  const blocksZoom =
    content.includes("user-scalable=no") ||
    /maximum-scale\s*=\s*1(?!\d)/.test(content);
  return {
    id: "viewport-zoom",
    label: "Viewport allows zoom",
    status: blocksZoom ? "fail" : "pass",
    summary: blocksZoom
      ? `Viewport meta blocks pinch-zoom: "${content}".`
      : meta
        ? `Viewport meta does not restrict scaling.`
        : "No viewport meta declared (browser uses default scaling).",
    violations: [],
  };
}

function ariaRoleCheck(doc: HTMLElement, html: string): CheckResult {
  const invalid: HTMLElement[] = [];
  for (const el of doc.querySelectorAll("[role]")) {
    const role = el.getAttribute("role");
    if (!role) continue;
    if (!isValidRole(role)) invalid.push(el);
  }
  return {
    id: "aria-roles",
    label: "ARIA role validity",
    status: invalid.length === 0 ? "pass" : "warning",
    summary:
      invalid.length === 0
        ? `All role values map to a valid WAI-ARIA role (${VALID_ARIA_ROLES.size} known).`
        : `${invalid.length} element${invalid.length === 1 ? "" : "s"} use an unknown role value.`,
    count: invalid.length,
    violations: invalid.slice(0, 5).map((el) => snippet(el, html)),
  };
}

export function runChecks(html: string): CheckResult[] {
  const doc = parse(html, { blockTextElements: { script: false, style: false } });
  return [
    langCheck(doc),
    titleCheck(doc),
    headingHierarchyCheck(doc, html),
    landmarksCheck(doc),
    imagesAltCheck(doc, html),
    inputsLabelsCheck(doc, html),
    linkTextCheck(doc, html),
    buttonNamesCheck(doc, html),
    duplicateIdsCheck(doc, html),
    tabindexCheck(doc, html),
    viewportCheck(doc),
    ariaRoleCheck(doc, html),
  ];
}
