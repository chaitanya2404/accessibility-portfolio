import Link from "next/link";
import { notFound } from "next/navigation";
import { Heading } from "@/components/Heading";
import { findDoc, listDocs, readDoc } from "@/lib/docs";
import { renderMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return listDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = findDoc(slug);
  if (!meta) return {};
  return {
    title: `${meta.title} — Docs`,
    description: meta.summary,
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = findDoc(slug);
  const body = await readDoc(slug);
  if (!meta || body === null) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/docs"
        className="mb-3 inline-flex text-sm font-medium text-accent hover:text-accent-strong"
      >
        ← All docs
      </Link>
      <Heading level={1}>{meta.title}</Heading>
      <p className="mt-4 text-lg text-fg-muted">{meta.summary}</p>
      <div
        className="prose-tight mt-8 space-y-3"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />
    </article>
  );
}
