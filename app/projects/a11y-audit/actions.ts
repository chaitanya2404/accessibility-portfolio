"use server";

import { headers } from "next/headers";
import { emitAuditEvent, newRunId } from "@/lib/observability";
import { cacheGet, cacheSet, CHECKS_VERSION } from "./_lib/cache";
import { runChecks, scoreFromResults } from "./_lib/checks";
import type { CheckResult } from "./_lib/checks";
import { fetchHtml } from "./_lib/http";
import { consume as consumeRateLimit } from "./_lib/rate-limit";

export type AuditResults = {
  url: string;
  fetchedAt: string;
  durationMs: number;
  checksVersion: string;
  score: number;
  earned: number;
  max: number;
  counts: { pass: number; warning: number; fail: number };
  checks: CheckResult[];
};

export type AuditResponse =
  | { ok: true; results: AuditResults; cached: boolean }
  | { ok: false; error: string; retryAfterSeconds?: number };

async function rateLimitKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? "anonymous";
  return h.get("x-real-ip") ?? "anonymous";
}

export async function runAudit(rawUrl: string): Promise<AuditResponse> {
  const trimmed = rawUrl.trim();
  if (!trimmed) return { ok: false, error: "Please enter a URL." };

  const cacheKey = `single:${trimmed}`;
  const cached = cacheGet<AuditResults>(cacheKey);
  if (cached) {
    const runId = newRunId();
    emitAuditEvent("cache:hit", { runId, url: trimmed });
    emitAuditEvent("audit:complete", {
      runId,
      url: cached.url,
      durationMs: 0,
      score: cached.score,
      counts: cached.counts,
    });
    return { ok: true, results: cached, cached: true };
  }

  const key = await rateLimitKey();
  const rl = consumeRateLimit(key);
  if (!rl.ok) {
    emitAuditEvent("rate-limit:exceeded", { key, retryAfterSeconds: rl.retryAfterSeconds });
    return {
      ok: false,
      error: `Rate limited. Try again in ${rl.retryAfterSeconds} seconds.`,
      retryAfterSeconds: rl.retryAfterSeconds,
    };
  }

  const runId = newRunId();
  emitAuditEvent("audit:start", { url: trimmed, mode: "single", runId });
  emitAuditEvent("cache:miss", { runId, url: trimmed });

  const start = Date.now();
  const fetchResult = await fetchHtml(trimmed);
  if (!fetchResult.ok) {
    emitAuditEvent("audit:error", { runId, url: trimmed, reason: fetchResult.message });
    return { ok: false, error: fetchResult.message };
  }

  const checks = runChecks(fetchResult.html);
  const score = scoreFromResults(checks);
  const durationMs = Date.now() - start;

  const results: AuditResults = {
    url: fetchResult.url,
    fetchedAt: new Date().toISOString(),
    durationMs,
    checksVersion: CHECKS_VERSION,
    score: score.score,
    earned: score.earned,
    max: score.max,
    counts: score.counts,
    checks,
  };

  cacheSet(cacheKey, results);
  emitAuditEvent("audit:complete", {
    runId,
    url: results.url,
    durationMs,
    score: score.score,
    counts: score.counts,
  });

  return { ok: true, results, cached: false };
}
