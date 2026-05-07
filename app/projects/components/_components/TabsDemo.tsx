"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { A11yNotes } from "./A11yNotes";

const tabs = [
  {
    value: "overview",
    label: "Overview",
    body: "A short, plain-language summary that anyone landing on the page can grasp in five seconds.",
  },
  {
    value: "metrics",
    label: "Metrics",
    body: "Quantitative results — response times, conversion lift, error rate — pulled from production.",
  },
  {
    value: "notes",
    label: "Notes",
    body: "Open questions, follow-ups, and links to related work. Updated weekly during planning.",
  },
];

export function TabsDemo() {
  return (
    <>
      <div>
        <Tabs.Root defaultValue="overview" className="rounded-md border border-slate-200">
          <Tabs.List
            aria-label="Project sections"
            className="flex border-b border-slate-200 bg-slate-50 p-1"
          >
            {tabs.map((t) => (
              <Tabs.Trigger
                key={t.value}
                value={t.value}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-indigo-800 data-[state=active]:shadow-sm"
              >
                {t.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {tabs.map((t) => (
            <Tabs.Content
              key={t.value}
              value={t.value}
              className="bg-white p-4 text-sm text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              {t.body}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Keyboard",
            body: "Arrow Left/Right move between tabs. Home/End jump to first/last. Tab moves into the active panel.",
          },
          {
            label: "ARIA",
            body: "role=\"tablist\" with role=\"tab\" children. Each tab has aria-selected and aria-controls. Panels carry role=\"tabpanel\" and aria-labelledby.",
          },
          {
            label: "Focus",
            body: "Roving tabindex — only the active tab is in the tab sequence. Activating a tab moves visible focus and updates the panel.",
          },
        ]}
      />
    </>
  );
}
