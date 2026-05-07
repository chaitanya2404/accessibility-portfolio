import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";
import { departmentList } from "./data";

export const metadata = {
  title: "Division Hub — Accessibility Portfolio",
  description:
    "An internal county portal demonstrating semantic landmarks, an accessible mega-menu, and sortable staff directories.",
};

export default function DivisionHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section aria-labelledby="hub-heading" className="mb-12 max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-700">
          Project 1
        </p>
        <Heading level={1} id="hub-heading">
          Division Hub
        </Heading>
        <p className="mt-4 text-lg text-slate-700">
          A mock county portal showing how a small information architecture can
          stay fully accessible: an unambiguous primary nav, a Radix
          NavigationMenu mega-menu, and staff directories that announce sort
          state to assistive technology.
        </p>
      </section>

      <section aria-labelledby="departments-heading">
        <Heading level={2} id="departments-heading" className="mb-6">
          Departments
        </Heading>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departmentList.map((dept) => (
            <Card key={dept.slug} as="li" className="flex flex-col">
              <div
                aria-hidden="true"
                className={`mb-4 h-28 w-full rounded-md bg-gradient-to-br ${dept.gradient}`}
              />
              <Heading level={3} className="mb-2">
                {dept.name}
              </Heading>
              <p className="mb-4 flex-1 text-sm text-slate-700">
                {dept.shortDescription}
              </p>
              <Link
                href={`/projects/division-hub/${dept.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:text-indigo-900"
              >
                Visit {dept.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </ul>
      </section>
    </div>
  );
}
