import { promises as fs } from "node:fs";
import path from "node:path";

export type DocMeta = {
  slug: string;
  title: string;
  summary: string;
};

const DOCS_DIR = path.join(process.cwd(), "docs");

const REGISTRY: DocMeta[] = [
  {
    slug: "focus-management",
    title: "Focus management strategy",
    summary: "Where focus moves on navigation, route changes, step changes, and skip-link activation.",
  },
  {
    slug: "screen-reader-matrix",
    title: "Screen reader testing matrix",
    summary: "Tested combinations and known divergences across NVDA, JAWS, VoiceOver, and TalkBack.",
  },
  {
    slug: "api-design",
    title: "API design — composition over configuration",
    summary: "Tradeoffs between compound and prop-bag APIs, how the DataTable lands on compound.",
  },
  {
    slug: "why-no-storybook",
    title: "Why no Storybook",
    summary: "Documented non-decision: where Storybook earns its keep and where it doesn't, at this scale.",
  },
  {
    slug: "migration-example",
    title: "Migration guide format",
    summary: "Sample MIGRATION.md showing how a Modal API change would be communicated to consumers.",
  },
  {
    slug: "bundle-budgets",
    title: "Bundle budgets",
    summary: "Per-component gzip budgets enforced by size-limit, regenerated on build.",
  },
];

export function listDocs(): DocMeta[] {
  return REGISTRY;
}

export function findDoc(slug: string): DocMeta | undefined {
  return REGISTRY.find((d) => d.slug === slug);
}

export async function readDoc(slug: string): Promise<string | null> {
  const meta = findDoc(slug);
  if (!meta) return null;
  try {
    const file = path.join(DOCS_DIR, `${slug}.md`);
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}
