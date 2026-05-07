import { Heading } from "@/components/Heading";
import { AccordionDemo } from "./_components/AccordionDemo";
import { ComboboxDemo } from "./_components/ComboboxDemo";
import { DialogDemo } from "./_components/DialogDemo";
import { Section } from "./_components/Section";
import { Sidebar } from "./_components/Sidebar";
import { TabsDemo } from "./_components/TabsDemo";
import { ToastDemo } from "./_components/ToastDemo";

export const metadata = {
  title: "Components — Accessibility Portfolio",
  description:
    "Five Radix-built UI patterns with their keyboard, ARIA, and focus contracts surfaced inline.",
};

const SECTIONS = [
  { id: "accordion", label: "Accordion", title: "Accordion" },
  { id: "dialog", label: "Dialog", title: "Modal dialog" },
  { id: "tabs", label: "Tabs", title: "Tabs" },
  { id: "combobox", label: "Combobox", title: "Combobox" },
  { id: "toast", label: "Toast", title: "Toast" },
] as const;

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-700">
          Project 2
        </p>
        <Heading level={1}>Component library showcase</Heading>
        <p className="mt-4 text-lg text-slate-700">
          Five common patterns built on Radix and cmdk, each paired with a
          visible panel that lists the keyboard shortcuts, ARIA roles, and
          focus behavior the component delivers. The anchor links below move
          focus into each section so screen reader users land on the heading,
          not a stray element.
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
        </div>
      </div>
    </div>
  );
}
