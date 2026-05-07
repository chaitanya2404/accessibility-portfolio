type AuditEventMap = {
  "audit:start": { url: string; mode: "single" | "crawl" | "worker"; runId: string };
  "audit:check-complete": {
    runId: string;
    checkId: string;
    status: "pass" | "warning" | "fail";
    durationMs: number;
  };
  "audit:complete": {
    runId: string;
    url: string;
    durationMs: number;
    score: number;
    counts: { pass: number; warning: number; fail: number };
  };
  "audit:error": { runId: string; url: string; reason: string };
  "crawl:page-complete": { runId: string; url: string; index: number; total: number };
  "cache:hit": { runId: string; url: string };
  "cache:miss": { runId: string; url: string };
  "rate-limit:exceeded": { key: string; retryAfterSeconds: number };
};

export type AuditEvent = {
  [K in keyof AuditEventMap]: { name: K; payload: AuditEventMap[K] };
}[keyof AuditEventMap];

type Sink = (event: AuditEvent & { ts: number }) => void;

let sink: Sink = (event) => {
  if (process.env.NODE_ENV === "test") return;
  console.log("[audit]", JSON.stringify(event));
};

export function setAuditSink(custom: Sink) {
  sink = custom;
}

export function emitAuditEvent<K extends AuditEvent["name"]>(
  name: K,
  payload: Extract<AuditEvent, { name: K }>["payload"]
): void {
  sink({ name, payload, ts: Date.now() } as AuditEvent & { ts: number });
}

export function newRunId(): string {
  return `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
