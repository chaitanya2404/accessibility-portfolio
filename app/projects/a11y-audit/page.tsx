import { Heading } from "@/components/Heading";
import { AuditForm } from "./_components/AuditForm";

export const metadata = {
  title: "A11y Audit — Accessibility Portfolio",
  description:
    "Paste a URL and get a quick spot-check on four fundamental WCAG criteria.",
};

export default function A11yAuditPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-700">
          Project 3
        </p>
        <Heading level={1}>A11y audit tool</Heading>
        <p className="mt-4 text-lg text-slate-700">
          Enter a public URL and the server fetches the HTML, parses it, and
          reports on four foundational accessibility checks. Results render in
          a semantic table and the loading state is announced to screen
          readers.
        </p>
      </header>

      <aside
        id="audit-disclaimer"
        aria-label="Tool scope"
        className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
      >
        <p>
          <strong>Quick A11y Spot-Check</strong> — 4 fundamental WCAG checks
          only. For comprehensive auditing, use{" "}
          <a
            href="https://www.deque.com/axe/devtools/"
            className="font-semibold underline hover:text-amber-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            axe DevTools (opens in new tab)
          </a>{" "}
          or{" "}
          <a
            href="https://developer.chrome.com/docs/lighthouse/accessibility/"
            className="font-semibold underline hover:text-amber-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lighthouse (opens in new tab)
          </a>
          .
        </p>
      </aside>

      <section aria-labelledby="audit-form-heading">
        <Heading level={2} id="audit-form-heading" className="sr-only">
          Run an audit
        </Heading>
        <AuditForm />
      </section>

      <section aria-labelledby="checks-heading" className="mt-12">
        <Heading level={2} id="checks-heading" className="mb-4">
          What this tool checks
        </Heading>
        <ol className="list-decimal space-y-2 pl-6 text-sm text-slate-700 marker:text-indigo-700">
          <li>
            <strong className="text-slate-900">html lang attribute</strong> —
            present and non-empty so assistive tech can pick the right
            pronunciation engine.
          </li>
          <li>
            <strong className="text-slate-900">title element</strong> —
            present and non-empty for tab announcements and history.
          </li>
          <li>
            <strong className="text-slate-900">images missing alt</strong> —
            counts <code className="rounded bg-slate-100 px-1">img</code>{" "}
            elements with no alt attribute and lists the first five sources.
          </li>
          <li>
            <strong className="text-slate-900">inputs missing labels</strong>{" "}
            — counts text-style inputs without a label, aria-label, or
            aria-labelledby. Hidden, submit, button, reset, and image inputs
            are excluded.
          </li>
        </ol>
      </section>
    </div>
  );
}
