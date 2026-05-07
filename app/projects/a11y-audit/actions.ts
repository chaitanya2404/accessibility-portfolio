"use server";

import { parse, type HTMLElement } from "node-html-parser";

export type AuditResults = {
  lang: { ok: boolean; value: string | null };
  title: { ok: boolean; value: string | null };
  imagesMissingAlt: { count: number; samples: string[] };
  inputsMissingLabels: { count: number; samples: string[] };
};

export type AuditResponse =
  | { ok: true; url: string; results: AuditResults }
  | { ok: false; error: string };

const NON_LABELABLE_INPUT_TYPES = new Set([
  "hidden",
  "submit",
  "button",
  "reset",
  "image",
]);

function describeInput(el: HTMLElement) {
  const id = el.getAttribute("id");
  const name = el.getAttribute("name");
  const type = el.getAttribute("type") ?? "text";
  if (id) return `<input id="${id}" type="${type}">`;
  if (name) return `<input name="${name}" type="${type}">`;
  return `<input type="${type}">`;
}

function truncate(value: string, max = 80) {
  if (value.length <= max) return value;
  return value.slice(0, max - 1) + "…";
}

export async function runAudit(rawUrl: string): Promise<AuditResponse> {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter a URL." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return {
      ok: false,
      error: "That doesn't look like a valid URL. Include the protocol, e.g. https://example.com.",
    };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported." };
  }

  let html: string;
  try {
    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "A11yAuditBot/1.0 (+https://example.com/a11y-audit; demo tool)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `The site returned HTTP ${response.status}. The page could not be audited.`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      return {
        ok: false,
        error: `Expected an HTML response but got ${contentType || "an unknown content type"}.`,
      };
    }

    html = await response.text();
  } catch (err) {
    const name = (err as Error)?.name;
    if (name === "TimeoutError" || name === "AbortError") {
      return {
        ok: false,
        error: "The request timed out after 8 seconds. The site may be slow or blocking automated requests.",
      };
    }
    return {
      ok: false,
      error: `Network error fetching the URL: ${(err as Error).message}.`,
    };
  }

  const doc = parse(html);

  const htmlEl = doc.querySelector("html");
  const langValue = htmlEl?.getAttribute("lang")?.trim() ?? null;

  const titleEl = doc.querySelector("title");
  const titleValue = titleEl?.text?.trim() ?? null;

  const missingAltImages = doc
    .querySelectorAll("img")
    .filter((el) => el.getAttribute("alt") === undefined);
  const altSamples = missingAltImages
    .slice(0, 5)
    .map((el) => truncate(el.getAttribute("src") ?? "(no src)"));

  const inputs = doc.querySelectorAll("input");
  const missingLabelInputs = inputs.filter((el) => {
    const type = (el.getAttribute("type") ?? "text").toLowerCase();
    if (NON_LABELABLE_INPUT_TYPES.has(type)) return false;

    const ariaLabel = el.getAttribute("aria-label")?.trim();
    if (ariaLabel) return false;

    const labelledBy = el.getAttribute("aria-labelledby")?.trim();
    if (labelledBy) return false;

    const id = el.getAttribute("id");
    if (id && doc.querySelector(`label[for="${id}"]`)) return false;

    return true;
  });
  const inputSamples = missingLabelInputs.slice(0, 5).map(describeInput);

  return {
    ok: true,
    url: url.toString(),
    results: {
      lang: { ok: !!langValue, value: langValue },
      title: { ok: !!titleValue, value: titleValue },
      imagesMissingAlt: {
        count: missingAltImages.length,
        samples: altSamples,
      },
      inputsMissingLabels: {
        count: missingLabelInputs.length,
        samples: inputSamples,
      },
    },
  };
}
