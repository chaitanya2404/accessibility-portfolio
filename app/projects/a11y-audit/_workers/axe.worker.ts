/// <reference lib="webworker" />

import axe from "axe-core";

type Request = {
  id: string;
  html: string;
  url: string;
};

type Response =
  | { id: string; ok: true; violations: AxeViolation[]; passes: number; incomplete: number; url: string }
  | { id: string; ok: false; error: string };

export type AxeViolation = {
  id: string;
  help: string;
  helpUrl: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  description: string;
  nodes: { html: string; failureSummary?: string; target: string[] }[];
};

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = async (event: MessageEvent<Request>) => {
  const { id, html, url } = event.data;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const results = await axe.run(doc as unknown as Element, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
      resultTypes: ["violations", "passes", "incomplete"],
    });

    const violations: AxeViolation[] = results.violations.map((v) => ({
      id: v.id,
      help: v.help,
      helpUrl: v.helpUrl,
      impact: v.impact ?? null,
      description: v.description,
      nodes: v.nodes.slice(0, 5).map((n) => ({
        html: n.html,
        failureSummary: n.failureSummary,
        target: n.target as unknown as string[],
      })),
    }));

    const reply: Response = {
      id,
      ok: true,
      violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      url,
    };
    ctx.postMessage(reply);
  } catch (err) {
    const reply: Response = {
      id,
      ok: false,
      error: (err as Error).message,
    };
    ctx.postMessage(reply);
  }
};
