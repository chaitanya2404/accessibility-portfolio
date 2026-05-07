import Link from "next/link";
import { Heading } from "@/components/Heading";
import { ShieldCheck } from "lucide-react";

export function A11yStatement() {
  return (
    <section
      id="accessibility"
      aria-labelledby="a11y-heading"
      className="scroll-mt-20 rounded-lg border border-accent/20 bg-accent-soft p-6 print:break-inside-avoid"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <Heading level={2} id="a11y-heading" className="mb-2">
            Accessibility statement
          </Heading>
          <p className="text-fg-muted">
            This portfolio targets WCAG 2.1 AA. Every page declares{" "}
            <code className="rounded bg-surface px-1">lang=&quot;en&quot;</code>,
            uses semantic landmarks (header, nav, main, footer), exposes a
            skip-to-content link, and ships visible 2px focus rings. Sort
            state, status updates, and form errors are announced through a
            single live-region provider. The 63-test Playwright suite asserts
            zero{" "}
            <a
              href="https://www.deque.com/axe/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline hover:text-accent-strong"
            >
              axe-core (opens in new tab)
            </a>{" "}
            violations on every route.
          </p>
          <p className="mt-3 text-sm text-fg-muted">
            If you find an accessibility issue, the{" "}
            <Link href="#contact" className="font-medium text-accent underline hover:text-accent-strong">
              contact form
            </Link>{" "}
            is the fastest way to report it.
          </p>
        </div>
      </div>
    </section>
  );
}
