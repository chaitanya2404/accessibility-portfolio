import { parse } from "node-html-parser";
import { createSseStream } from "@/app/api/_lib/sse";
import { fetchHtml } from "@/app/projects/a11y-audit/_lib/http";
import {
  runChecks,
  scoreFromResults,
} from "@/app/projects/a11y-audit/_lib/checks";
import {
  cacheGet,
  cacheSet,
  CHECKS_VERSION,
} from "@/app/projects/a11y-audit/_lib/cache";
import { consume } from "@/app/projects/a11y-audit/_lib/rate-limit";
import { emitAuditEvent, newRunId } from "@/lib/observability";
import type { AuditResults } from "@/app/projects/a11y-audit/actions";

const MAX_PAGES = 5;

function discoverLinks(html: string, base: URL): string[] {
  const doc = parse(html);
  const seen = new Set<string>();
  for (const a of doc.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href) continue;
    let u: URL;
    try {
      u = new URL(href, base);
    } catch {
      continue;
    }
    if (u.origin !== base.origin) continue;
    if (u.protocol !== "http:" && u.protocol !== "https:") continue;
    u.hash = "";
    seen.add(u.toString());
  }
  return [...seen];
}

async function auditOne(targetUrl: string, runId: string): Promise<AuditResults | { error: string }> {
  const cacheKey = `single:${targetUrl}`;
  const cached = cacheGet<AuditResults>(cacheKey);
  if (cached) {
    emitAuditEvent("cache:hit", { runId, url: targetUrl });
    return cached;
  }
  emitAuditEvent("cache:miss", { runId, url: targetUrl });
  const start = Date.now();
  const fetchResult = await fetchHtml(targetUrl);
  if (!fetchResult.ok) return { error: fetchResult.message };
  const checks = runChecks(fetchResult.html);
  const score = scoreFromResults(checks);
  const results: AuditResults = {
    url: fetchResult.url,
    fetchedAt: new Date().toISOString(),
    durationMs: Date.now() - start,
    checksVersion: CHECKS_VERSION,
    score: score.score,
    earned: score.earned,
    max: score.max,
    counts: score.counts,
    checks,
  };
  cacheSet(cacheKey, results);
  return results;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let entry: URL;
  try {
    entry = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }
  if (entry.protocol !== "http:" && entry.protocol !== "https:") {
    return new Response("Only http(s) supported", { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";
  const rl = consume(ip, 3);
  if (!rl.ok) {
    return new Response(JSON.stringify({ error: "rate-limited", retryAfterSeconds: rl.retryAfterSeconds }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const runId = newRunId();
  emitAuditEvent("audit:start", { url: entry.toString(), mode: "crawl", runId });

  return createSseStream((channel) => {
    let cancelled = false;

    (async () => {
      try {
        const entryAudit = await auditOne(entry.toString(), runId);
        if (cancelled) return;
        if ("error" in entryAudit) {
          channel.send("error", { message: entryAudit.error });
          channel.close();
          emitAuditEvent("audit:error", { runId, url: entry.toString(), reason: entryAudit.error });
          return;
        }

        channel.send("page-complete", { index: 1, total: 1, page: entryAudit });
        emitAuditEvent("crawl:page-complete", {
          runId,
          url: entryAudit.url,
          index: 1,
          total: 1,
        });

        const fetched = await fetchHtml(entry.toString());
        const links = fetched.ok ? discoverLinks(fetched.html, entry) : [];
        const queue = links.filter((l) => l !== entryAudit.url).slice(0, MAX_PAGES - 1);
        const total = 1 + queue.length;
        channel.send("plan", { total, urls: queue });

        for (let i = 0; i < queue.length; i++) {
          if (cancelled) return;
          const url = queue[i];
          const result = await auditOne(url, runId);
          if (cancelled) return;
          const payload = "error" in result ? { error: result.error, url } : { page: result };
          channel.send("page-complete", { index: i + 2, total, ...payload });
          if (!("error" in result)) {
            emitAuditEvent("crawl:page-complete", {
              runId,
              url: result.url,
              index: i + 2,
              total,
            });
          }
        }

        channel.send("done", { total });
      } catch (err) {
        const message = (err as Error).message;
        emitAuditEvent("audit:error", { runId, url: entry.toString(), reason: message });
        channel.send("error", { message });
      } finally {
        channel.close();
      }
    })();

    return () => {
      cancelled = true;
    };
  });
}
