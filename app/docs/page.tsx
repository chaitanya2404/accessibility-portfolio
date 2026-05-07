import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";
import { listDocs } from "@/lib/docs";

export const metadata = {
  title: "Docs — Accessibility Portfolio",
  description: "Architectural and process notes that travel alongside the portfolio code.",
};

export default function DocsIndexPage() {
  const docs = listDocs();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <Heading level={1}>Docs</Heading>
        <p className="mt-4 text-lg text-fg-muted">
          The decisions, non-decisions, and accessibility commitments that
          accompany the code. These are written for an engineer joining the
          portfolio next.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {docs.map((d) => (
          <Card as="li" key={d.slug}>
            <Heading level={2} className="mb-1 text-lg">
              {d.title}
            </Heading>
            <p className="mb-3 text-sm text-fg-muted">{d.summary}</p>
            <Link
              href={`/docs/${d.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-strong"
            >
              Read
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Card>
        ))}
      </ul>
    </div>
  );
}
