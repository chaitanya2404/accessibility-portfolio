import Link from "next/link";
import { Heading } from "@/components/Heading";
import { AuditTabs } from "./_components/AuditTabs";

export const metadata = {
  title: "A11y Audit — Accessibility Portfolio",
  description:
    "Audit a URL or crawl a small site against twelve foundational WCAG checks.",
};

export default function A11yAuditPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
          Project 3
        </p>
        <Heading level={1}>A11y audit tool</Heading>
        <p className="mt-4 text-lg text-fg-muted">
          Twelve foundational WCAG checks against any public URL. Single-page
          mode returns a scored results table; crawl mode discovers up to five
          same-origin pages, audits each, and streams results back as they
          complete via Server-Sent Events; compare mode runs two URLs and
          shows a per-check diff.
        </p>
        <p className="mt-3 text-sm text-fg-subtle">
          Honest about what this tool can&rsquo;t detect — see{" "}
          <Link
            href="/projects/a11y-audit/about"
            className="font-medium text-accent hover:text-accent-strong"
          >
            About this tool
          </Link>
          .
        </p>
      </header>

      <aside
        id="audit-disclaimer"
        aria-label="Tool scope"
        className="mb-8 rounded-md border border-warn/30 bg-warn-soft p-4 text-sm text-warn"
      >
        <p>
          <strong>Static-HTML audits only.</strong> This tool inspects the HTML
          delivered by the server and cannot detect color contrast on dynamic
          content, focus traps, or anything that requires interaction. For
          comprehensive auditing, use{" "}
          <a
            href="https://www.deque.com/axe/devtools/"
            className="font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            axe DevTools (opens in new tab)
          </a>{" "}
          or{" "}
          <a
            href="https://developer.chrome.com/docs/lighthouse/accessibility/"
            className="font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lighthouse (opens in new tab)
          </a>
          .
        </p>
      </aside>

      <section aria-labelledby="audit-tabs-heading">
        <Heading level={2} id="audit-tabs-heading" className="sr-only">
          Run an audit
        </Heading>
        <AuditTabs />
      </section>

      <section aria-labelledby="checks-heading" className="mt-12">
        <Heading level={2} id="checks-heading" className="mb-4">
          What this tool checks
        </Heading>
        <p className="mb-4 text-sm text-fg-muted">
          Each check declares a WCAG success criterion, a severity level, and a
          status. Score weights pass/warning/fail by severity (critical=5,
          serious=3, moderate=2, minor=1).
        </p>
        <ol className="list-decimal space-y-1 pl-6 text-sm text-fg-muted marker:text-accent">
          <li><strong>html lang attribute</strong> — pronunciation engine selection (3.1.1)</li>
          <li><strong>title element</strong> — tab and history announcements (2.4.2)</li>
          <li><strong>heading hierarchy</strong> — single h1 and no skipped levels (1.3.1)</li>
          <li><strong>landmark regions</strong> — main, header, footer, nav (1.3.1)</li>
          <li><strong>images missing alt</strong> — meaningful or empty alt declared (1.1.1)</li>
          <li><strong>inputs missing labels</strong> — text-style inputs only (3.3.2)</li>
          <li><strong>link text quality</strong> — flags vague text like &ldquo;click here&rdquo; (2.4.4)</li>
          <li><strong>buttons missing accessible names</strong> — text, aria-label, or labelledby (4.1.2)</li>
          <li><strong>duplicate id attributes</strong> — flags repeats (4.1.1)</li>
          <li><strong>positive tabindex</strong> — disrupts natural tab order (2.4.3)</li>
          <li><strong>viewport allows zoom</strong> — no user-scalable=no or maximum-scale=1 (1.4.4)</li>
          <li><strong>ARIA role validity</strong> — values map to real WAI-ARIA roles (4.1.2)</li>
        </ol>
      </section>
    </div>
  );
}
