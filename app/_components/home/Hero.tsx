import Link from "next/link";
import { ArrowRight, Mail, Printer } from "lucide-react";
import { Heading } from "@/components/Heading";
import { PrintButton } from "./PrintButton";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 pb-16 pt-12 sm:pt-16"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
          Full Stack Developer · Front-End Specialist
        </p>
        <Heading level={1} id="hero-heading" className="text-balance">
          Chaitanya Reddy Basani
        </Heading>
        <p className="mt-4 max-w-3xl text-lg text-fg-muted">
          Building accessible, user-friendly web experiences for over 7 years.
          Full Stack Developer with experience designing and shipping
          responsive, accessible web applications across healthcare, finance,
          and higher education.
        </p>
        <p className="mt-3 text-sm text-fg-subtle">
          Irving, TX · open to relocation
        </p>

        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-strong"
          >
            View my work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-divider bg-surface px-5 py-2.5 text-sm font-semibold text-fg hover:bg-surface-raised"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Get in touch
          </Link>
          <PrintButton>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print résumé
          </PrintButton>
        </div>
      </div>
    </section>
  );
}
