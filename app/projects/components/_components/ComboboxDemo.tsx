"use client";

import { Command } from "cmdk";
import { useState } from "react";
import { Search } from "lucide-react";
import { A11yNotes } from "./A11yNotes";

const FRAMEWORKS = [
  "Next.js",
  "Remix",
  "Astro",
  "SvelteKit",
  "Nuxt",
  "SolidStart",
  "Qwik City",
  "Gatsby",
];

export function ComboboxDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div>
        <label
          htmlFor="framework-combobox-input"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Choose a framework
        </label>
        <Command
          label="Choose a framework"
          className="overflow-hidden rounded-md border border-slate-300 bg-white"
        >
          <div className="flex items-center gap-2 border-b border-slate-200 px-3">
            <Search
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-500"
            />
            <Command.Input
              id="framework-combobox-input"
              placeholder="Search frameworks..."
              className="w-full bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <Command.List className="max-h-56 overflow-y-auto p-1">
            <Command.Empty className="px-3 py-6 text-center text-sm text-slate-600">
              No frameworks match your search.
            </Command.Empty>
            {FRAMEWORKS.map((name) => (
              <Command.Item
                key={name}
                value={name}
                onSelect={() => setSelected(name)}
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-800 data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-900"
              >
                {name}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
        <p className="mt-3 text-sm text-slate-700" aria-live="polite">
          {selected ? (
            <>
              Selected: <span className="font-semibold">{selected}</span>
            </>
          ) : (
            <>Use Arrow keys to browse, Enter to select.</>
          )}
        </p>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Keyboard",
            body: "Arrow Up/Down moves through results. Enter selects the highlighted item. Typing filters the list immediately.",
          },
          {
            label: "ARIA",
            body: "Input has role=\"combobox\" with aria-expanded, aria-controls, and aria-activedescendant pointing at the highlighted option. List has role=\"listbox\"; items have role=\"option\".",
          },
          {
            label: "Live region",
            body: "Selection feedback below uses aria-live=\"polite\" so screen readers announce the chosen value without stealing focus.",
          },
        ]}
      />
    </>
  );
}
