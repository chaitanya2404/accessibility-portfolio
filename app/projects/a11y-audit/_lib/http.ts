export type HttpFailure = {
  ok: false;
  kind: "invalid-url" | "unsupported-scheme" | "timeout" | "network" | "http-error" | "non-html";
  message: string;
  status?: number;
};

export type HttpSuccess = {
  ok: true;
  url: string;
  status: number;
  html: string;
};

export type HttpResult = HttpSuccess | HttpFailure;

const USER_AGENT =
  "A11yAuditBot/1.0 (+https://example.com/a11y-audit; portfolio demo)";

const RETRY_STATUSES = new Set([502, 503, 504]);

export async function fetchHtml(
  rawUrl: string,
  opts: { timeoutMs?: number; maxRetries?: number } = {}
): Promise<HttpResult> {
  const { timeoutMs = 8000, maxRetries = 2 } = opts;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return {
      ok: false,
      kind: "invalid-url",
      message:
        "That doesn't look like a valid URL. Include the protocol, e.g. https://example.com.",
    };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      kind: "unsupported-scheme",
      message: "Only http and https URLs are supported.",
    };
  }

  let attempt = 0;
  let lastError: HttpFailure | undefined;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(parsed.toString(), {
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });

      if (!response.ok) {
        if (RETRY_STATUSES.has(response.status) && attempt < maxRetries) {
          await delay(backoffMs(attempt));
          attempt++;
          continue;
        }
        return {
          ok: false,
          kind: "http-error",
          message: `The site returned HTTP ${response.status}.`,
          status: response.status,
        };
      }

      const ct = response.headers.get("content-type") ?? "";
      if (!ct.includes("html")) {
        return {
          ok: false,
          kind: "non-html",
          message: `Expected an HTML response but got ${ct || "an unknown content type"}.`,
        };
      }

      const html = await response.text();
      return { ok: true, url: parsed.toString(), status: response.status, html };
    } catch (err) {
      const name = (err as Error)?.name;
      if (name === "TimeoutError" || name === "AbortError") {
        lastError = {
          ok: false,
          kind: "timeout",
          message: `Request timed out after ${timeoutMs}ms.`,
        };
      } else {
        lastError = {
          ok: false,
          kind: "network",
          message: `Network error: ${(err as Error).message}.`,
        };
      }
      if (attempt < maxRetries) {
        await delay(backoffMs(attempt));
        attempt++;
        continue;
      }
      return lastError;
    }
  }

  return lastError ?? { ok: false, kind: "network", message: "Unknown failure." };
}

function backoffMs(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, 4000);
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
