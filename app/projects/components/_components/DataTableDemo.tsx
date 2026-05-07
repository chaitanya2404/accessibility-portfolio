"use client";

import { useState } from "react";
import { DataTable, DEFAULT_STATE, type DataTableState } from "@/components/data-table";
import { A11yNotes } from "./A11yNotes";

type Framework = {
  name: string;
  category: "Hybrid" | "MPA" | "SPA";
  stars: number;
  releasedYear: number;
};

const FRAMEWORKS: Framework[] = [
  { name: "Next.js", category: "Hybrid", stars: 121000, releasedYear: 2016 },
  { name: "Remix", category: "Hybrid", stars: 27000, releasedYear: 2021 },
  { name: "Astro", category: "MPA", stars: 45000, releasedYear: 2022 },
  { name: "SvelteKit", category: "Hybrid", stars: 18000, releasedYear: 2022 },
  { name: "Nuxt", category: "Hybrid", stars: 50000, releasedYear: 2016 },
  { name: "SolidStart", category: "Hybrid", stars: 5500, releasedYear: 2023 },
  { name: "Qwik City", category: "Hybrid", stars: 20000, releasedYear: 2022 },
  { name: "Gatsby", category: "MPA", stars: 55000, releasedYear: 2015 },
  { name: "Eleventy", category: "MPA", stars: 17000, releasedYear: 2018 },
  { name: "Vite + React", category: "SPA", stars: 65000, releasedYear: 2020 },
  { name: "Create React App", category: "SPA", stars: 102000, releasedYear: 2016 },
];

export function DataTableDemo() {
  const [state, setState] = useState<DataTableState>(DEFAULT_STATE);

  return (
    <>
      <div>
        <label htmlFor="dt-search" className="sr-only">
          Filter frameworks
        </label>
        <input
          id="dt-search"
          type="search"
          placeholder="Filter frameworks…"
          value={state.search}
          onChange={(e) => setState({ ...state, search: e.target.value, page: 1 })}
          className="mb-3 w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
        />
        <DataTable<Framework>
          rows={FRAMEWORKS}
          rowKey={(f) => f.name}
          caption="Notable React-ish frameworks"
          state={state}
          onStateChange={setState}
          pageSize={5}
          selectable
        >
          <DataTable.Column<Framework> id="name" label="Name" sortable cell={(f) => f.name} />
          <DataTable.Column<Framework> id="category" label="Category" sortable cell={(f) => f.category} />
          <DataTable.Column<Framework>
            id="stars"
            label="Stars"
            sortable
            align="right"
            value={(f) => f.stars}
            cell={(f) => f.stars.toLocaleString()}
          />
          <DataTable.Column<Framework>
            id="releasedYear"
            label="Released"
            sortable
            align="right"
            value={(f) => f.releasedYear}
            cell={(f) => f.releasedYear}
          />
        </DataTable>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Sort",
            body: "Each sortable header is a button with aria-sort on the parent th. Cycling clicks toggles ascending → descending. Sort state is announced to AT via the sr-only suffix on each header button.",
          },
          {
            label: "Selection",
            body: "Checkboxes have explicit labels (sr-only). Shift-click selects a range across the visible page. aria-rowindex on each row gives the absolute position; aria-selected reflects state for assistive tech.",
          },
          {
            label: "Live region",
            body: "A polite live region above the table announces \"Showing X–Y of Z\" when the result count changes. A separate announcement fires for selection deltas.",
          },
          {
            label: "Pagination",
            body: "Pagination wrapped in <nav aria-label=\"Pagination\"> with Previous/Next buttons that disable at boundaries. Out-of-range page numbers clamp silently and announce.",
          },
        ]}
      />
    </>
  );
}
