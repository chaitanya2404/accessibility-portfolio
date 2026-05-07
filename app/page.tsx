import Link from "next/link";
import { ArrowRight, Building2, LayoutGrid, ShieldCheck } from "lucide-react";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";

const projects = [
  {
    title: "Division Hub",
    href: "/projects/division-hub",
    description:
      "An internal county portal with three departments, a mega-menu, and sortable staff directories that announce sort state to assistive tech.",
    Icon: Building2,
    gradient: "from-indigo-500 to-purple-700",
    available: true,
  },
  {
    title: "Components",
    href: "/projects/components",
    description:
      "A small library of accessible patterns built on Radix primitives: combobox, accordion, dialog, tabs, and toast.",
    Icon: LayoutGrid,
    gradient: "from-emerald-500 to-teal-700",
    available: true,
  },
  {
    title: "A11y Audit",
    href: "/projects/a11y-audit",
    description:
      "Paste in HTML and get a list of accessibility issues with severity, rule reference, and a snippet of the offending markup.",
    Icon: ShieldCheck,
    gradient: "from-rose-500 to-orange-600",
    available: false,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section aria-labelledby="hero-heading" className="mb-16 max-w-3xl">
        <Heading level={1} id="hero-heading">
          Accessibility-first frontend, three projects deep.
        </Heading>
        <p className="mt-6 text-lg text-slate-700">
          A portfolio that treats accessibility as the product, not the polish.
          Each project demonstrates a different facet: realistic information
          architecture, reusable patterns, and a tool that catches violations
          in arbitrary HTML.
        </p>
      </section>

      <section aria-labelledby="projects-heading">
        <Heading level={2} id="projects-heading" className="mb-6">
          Projects
        </Heading>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(({ title, href, description, Icon, gradient, available }) => (
            <Card key={title} as="li" className="flex flex-col">
              <div
                aria-hidden="true"
                className={`mb-4 flex h-32 w-full items-center justify-center rounded-md bg-gradient-to-br ${gradient}`}
              >
                <Icon className="h-12 w-12 text-white" strokeWidth={1.5} />
              </div>
              <Heading level={3} className="mb-2">
                {title}
              </Heading>
              <p className="mb-4 flex-1 text-sm text-slate-700">{description}</p>
              <Link
                href={href}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:text-indigo-900"
                aria-label={`Open the ${title} project${available ? "" : " (placeholder route)"}`}
              >
                {available ? `View ${title}` : `${title} (coming soon)`}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </ul>
      </section>
    </div>
  );
}
