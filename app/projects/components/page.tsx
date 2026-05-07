import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/Heading";
import { AccordionDemo } from "./_components/AccordionDemo";
import { ComboboxDemo } from "./_components/ComboboxDemo";
import { DataTableDemo } from "./_components/DataTableDemo";
import { DialogDemo } from "./_components/DialogDemo";
import { FromScratchSwitchDemo } from "./_components/FromScratchSwitchDemo";
import { LiveRegionDemo } from "./_components/LiveRegionDemo";
import { Section } from "./_components/Section";
import { Sidebar } from "./_components/Sidebar";
import { TabsDemo } from "./_components/TabsDemo";
import { ToastDemo } from "./_components/ToastDemo";
import { WizardDemo } from "./_components/WizardDemo";

export const metadata = {
  title: "Components — Accessibility Portfolio",
  description:
    "Nine UI patterns with visible accessibility contracts: Radix primitives, cmdk, a hand-rolled Switch, a compound DataTable, a Wizard, and live regions.",
};

const SECTIONS = [
  { id: "accordion", label: "Accordion", title: "Accordion" },
  { id: "dialog", label: "Dialog", title: "Modal dialog" },
  { id: "tabs", label: "Tabs", title: "Tabs" },
  { id: "combobox", label: "Combobox", title: "Combobox" },
  { id: "toast", label: "Toast", title: "Toast" },
  { id: "data-table", label: "Data table", title: "Data table" },
  { id: "wizard", label: "Wizard", title: "Multi-step wizard" },
  { id: "live-region", label: "Live region", title: "Live region playground" },
  { id: "from-scratch", label: "Hand-rolled Switch", title: "Hand-rolled Switch" },
] as const;

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
          Project 2
        </p>
        <Heading level={1}>Component library showcase</Heading>
        <p className="mt-4 text-lg text-fg-muted">
          Nine patterns paired with visible panels documenting their keyboard
          shortcuts, ARIA roles, and focus behavior. Five built on Radix, one
          on cmdk, one compound DataTable, one Wizard, one Live region
          playground, and a hand-rolled Switch you can compare to a native
          checkbox.
        </p>
        <p className="mt-4 text-sm text-fg-subtle">
          See also:{" "}
          <Link
            href="/projects/components/conformance"
            className="inline-flex items-center gap-1 font-medium text-accent hover:text-accent-strong"
          >
            WCAG conformance report
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <Sidebar items={SECTIONS.map(({ id, label }) => ({ id, label }))} />
        <div className="space-y-10">
          <Section id="accordion" title="Accordion">
            <AccordionDemo />
          </Section>
          <Section id="dialog" title="Modal dialog">
            <DialogDemo />
          </Section>
          <Section id="tabs" title="Tabs">
            <TabsDemo />
          </Section>
          <Section id="combobox" title="Combobox">
            <ComboboxDemo />
          </Section>
          <Section id="toast" title="Toast">
            <ToastDemo />
          </Section>
          <Section id="data-table" title="Data table">
            <DataTableDemo />
          </Section>
          <Section id="wizard" title="Multi-step wizard">
            <WizardDemo />
          </Section>
          <Section id="live-region" title="Live region playground">
            <LiveRegionDemo />
          </Section>
          <Section id="from-scratch" title="Hand-rolled Switch">
            <FromScratchSwitchDemo />
          </Section>
        </div>
      </div>
    </div>
  );
}
