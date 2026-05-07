import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Heading } from "@/components/Heading";

export const metadata = {
  title: "About this audit tool — Accessibility Portfolio",
  description:
    "Honest scope of what this static-HTML audit tool can and cannot detect, and which tools to reach for when it falls short.",
};

const COMPARISON: { feature: string; thisTool: boolean; axe: boolean; lighthouse: boolean; wave: boolean; note?: string }[] = [
  { feature: "Static HTML structural checks", thisTool: true, axe: true, lighthouse: true, wave: true },
  { feature: "12 WCAG checks with severity weighting", thisTool: true, axe: true, lighthouse: false, wave: true },
  { feature: "Multi-page crawl with SSE progress", thisTool: true, axe: false, lighthouse: false, wave: false, note: "axe DevTools' single-page focus + browser extension model means crawl isn't part of its core flow." },
  { feature: "Comparison / regression diff between runs", thisTool: true, axe: false, lighthouse: false, wave: false },
  { feature: "Color contrast on rendered pages", thisTool: false, axe: true, lighthouse: true, wave: true, note: "Requires computed CSS, which static HTML doesn't have." },
  { feature: "Focus order verification", thisTool: false, axe: true, lighthouse: false, wave: false, note: "Requires running the tab key against a live browser." },
  { feature: "Keyboard trap detection", thisTool: false, axe: false, lighthouse: false, wave: false, note: "Requires running keyboard interaction; manual testing or Playwright." },
  { feature: "Live region behavior verification", thisTool: false, axe: false, lighthouse: false, wave: false, note: "Requires triggering the live region; manual or scripted." },
  { feature: "Screen reader output capture", thisTool: false, axe: false, lighthouse: false, wave: false, note: "No automated tool produces verbatim NVDA/JAWS output. Pair with a real reader." },
];

export default function AboutAuditToolPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 max-w-3xl">
        <Link
          href="/projects/a11y-audit"
          className="mb-3 inline-flex text-sm font-medium text-accent hover:text-accent-strong"
        >
          ← Back to audit tool
        </Link>
        <Heading level={1}>About this audit tool</Heading>
        <p className="mt-4 text-lg text-fg-muted">
          A spot-check, not a verdict. Static-HTML audits catch a real class
          of issues — the foundational structural ones — but they cannot tell
          you whether your site is accessible. Anyone who claims otherwise
          either hasn&rsquo;t paired with a screen reader or is selling
          something.
        </p>
      </header>

      <section aria-labelledby="cant-detect" className="mb-10">
        <Heading level={2} id="cant-detect" className="mb-4">
          What this tool cannot detect
        </Heading>
        <p className="mb-4 text-fg-muted">
          A static HTML inspector cannot run JavaScript, simulate
          interaction, capture screen reader output, or compute final styles.
          That rules out a long list of important issues:
        </p>
        <ul className="space-y-3 rounded-md border border-divider bg-surface-raised p-4 text-sm">
          <li>
            <strong className="text-fg">Color contrast on dynamic content.</strong>{" "}
            <span className="text-fg-muted">
              Computed contrast depends on rendered CSS, including hover and
              focus states the static HTML doesn&rsquo;t expose.
            </span>
          </li>
          <li>
            <strong className="text-fg">Focus order and visibility.</strong>{" "}
            <span className="text-fg-muted">
              You have to press Tab. Tools that drive a real browser (axe
              DevTools, Playwright + axe) can verify; we can&rsquo;t.
            </span>
          </li>
          <li>
            <strong className="text-fg">Keyboard traps.</strong>{" "}
            <span className="text-fg-muted">
              Detected only by actually trying to escape one. A skill issue,
              not a parser issue.
            </span>
          </li>
          <li>
            <strong className="text-fg">Live region behavior.</strong>{" "}
            <span className="text-fg-muted">
              We confirm the markup is wired (aria-live, role=status) but we
              cannot confirm the announcement actually fires on the timing the
              user expects.
            </span>
          </li>
          <li>
            <strong className="text-fg">SPA route changes.</strong>{" "}
            <span className="text-fg-muted">
              The first paint is what we audit. Anything that hydrates,
              streams, or replaces content client-side is invisible to us.
            </span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="reach-for" className="mb-10">
        <Heading level={2} id="reach-for" className="mb-4">
          When to reach for what
        </Heading>
        <div className="overflow-x-auto rounded-lg border border-divider">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="border-b border-divider bg-surface-raised px-4 py-3 text-left font-semibold text-fg">
              Static HTML audit vs. industry tools
            </caption>
            <thead className="bg-surface-raised text-fg-muted">
              <tr>
                <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Feature</th>
                <th scope="col" className="border-b border-divider px-4 py-3 font-semibold text-center">This tool</th>
                <th scope="col" className="border-b border-divider px-4 py-3 font-semibold text-center">axe DevTools</th>
                <th scope="col" className="border-b border-divider px-4 py-3 font-semibold text-center">Lighthouse</th>
                <th scope="col" className="border-b border-divider px-4 py-3 font-semibold text-center">WAVE</th>
                <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-b border-divider/60 align-top last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium text-fg">{row.feature}</th>
                  {[row.thisTool, row.axe, row.lighthouse, row.wave].map((v, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      {v ? (
                        <>
                          <CheckCircle2 className="inline h-4 w-4 text-pass" aria-hidden="true" />
                          <span className="sr-only">Yes</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="inline h-4 w-4 text-fg-subtle" aria-hidden="true" />
                          <span className="sr-only">No</span>
                        </>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-xs text-fg-muted">{row.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="how-this-fits" className="mb-10">
        <Heading level={2} id="how-this-fits" className="mb-4">
          How to use this in a real workflow
        </Heading>
        <ol className="ml-5 list-decimal space-y-2 text-fg-muted marker:text-accent">
          <li>
            Run this tool on a URL early in development to catch structural
            misses (missing lang, heading hierarchy, vague link text). They&rsquo;re
            easy to fix while you&rsquo;re in the file.
          </li>
          <li>
            Use the crawl mode to check that whole sections of a site share
            the same baseline.
          </li>
          <li>
            For dynamic / interactive issues, switch to axe DevTools (browser
            extension) or run Lighthouse against a deployed preview.
          </li>
          <li>
            Pair with a real screen reader (NVDA + Firefox is the cheapest
            useful pairing) at least once per feature. Tools cannot replace
            this.
          </li>
        </ol>
      </section>
    </div>
  );
}
