type EventMap = {
  "nav.skip-link.activated": Record<string, never>;
  "nav.section.focused": { sectionId: string };
  "nav.search.opened": { source: "shortcut" | "button" };
  "nav.search.selected": { staffEmail: string };
  "service-request.step.changed": { from: number; to: number };
  "service-request.submitted": { type: string };
  "service-request.validation-failed": { step: number; field: string };
  "audit.run.started": { url: string; mode: "single" | "crawl" | "compare" | "worker" };
  "audit.run.completed": { url: string; durationMs: number; passes: number; warnings: number; failures: number };
  "audit.run.failed": { url: string; reason: string };
  "audit.export.downloaded": { url: string; mode: string };
  "presence.subscribed": { topic: string };
  "presence.unsubscribed": { topic: string };
  "demo.interacted": { demo: string; action: string };
};

export type AnalyticsEvent = {
  [K in keyof EventMap]: { name: K; payload: EventMap[K] };
}[keyof EventMap];

type Sink = (event: AnalyticsEvent & { ts: number }) => void;

let sink: Sink = (event) => {
  if (process.env.NODE_ENV === "test") return;
  console.log("[analytics]", JSON.stringify(event));
};

export function setAnalyticsSink(custom: Sink) {
  sink = custom;
}

export function track<K extends AnalyticsEvent["name"]>(
  name: K,
  payload: Extract<AnalyticsEvent, { name: K }>["payload"]
): void {
  sink({ name, payload, ts: Date.now() } as AnalyticsEvent & { ts: number });
}
