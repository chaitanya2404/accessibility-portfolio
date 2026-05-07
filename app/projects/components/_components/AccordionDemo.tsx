"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { A11yNotes } from "./A11yNotes";

const items = [
  {
    value: "wcag",
    title: "What does WCAG 2.1 AA require?",
    body: "Perceivable, operable, understandable, and robust content. AA targets text contrast of 4.5:1 for body and 3:1 for large text, plus keyboard parity for every mouse interaction.",
  },
  {
    value: "axe",
    title: "How is axe different from Lighthouse?",
    body: "axe runs over 90 deterministic rules in the page DOM and surfaces nuanced issues like name-from-content. Lighthouse runs a subset and adds performance and SEO signals.",
  },
  {
    value: "aria",
    title: "When should I reach for ARIA?",
    body: "After exhausting native HTML. ARIA describes; HTML elements behave. A native button with focus styles beats a div with role=button every time.",
  },
];

export function AccordionDemo() {
  return (
    <>
      <div>
        <Accordion.Root
          type="single"
          collapsible
          className="overflow-hidden rounded-md border border-slate-200"
        >
          {items.map((item, i) => (
            <Accordion.Item
              key={item.value}
              value={item.value}
              className={i > 0 ? "border-t border-slate-200" : ""}
            >
              <Accordion.Header className="m-0">
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 data-[state=open]:bg-slate-50">
                  {item.title}
                  <ChevronDown
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden bg-white text-sm text-slate-700 data-[state=closed]:animate-none">
                <div className="px-4 py-3">{item.body}</div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Keyboard",
            body: "Tab moves to a header. Enter or Space toggles. Arrow Up/Down moves between headers; Home/End jump to first/last.",
          },
          {
            label: "ARIA",
            body: "Each header is a button with aria-expanded and aria-controls pointing to its panel. Panels carry role=region and are labelled by their header.",
          },
          {
            label: "Focus",
            body: "Focus stays on the trigger when a panel opens or closes — the user can keep arrow-keying without losing place.",
          },
        ]}
      />
    </>
  );
}
