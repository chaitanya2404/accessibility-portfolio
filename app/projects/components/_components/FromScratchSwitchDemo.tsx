"use client";

import { useState } from "react";
import { Switch } from "@/components/from-scratch/Switch";
import { A11yNotes } from "./A11yNotes";

export function FromScratchSwitchDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-divider bg-surface p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Hand-rolled (role=switch button)
          </p>
          <div className="flex items-center gap-3">
            <Switch
              id="from-scratch-a"
              checked={a}
              onCheckedChange={setA}
              aria-describedby="from-scratch-a-desc"
            />
            <label htmlFor="from-scratch-a" className="text-sm font-medium text-fg">
              Send weekly digest
            </label>
          </div>
          <p id="from-scratch-a-desc" className="mt-2 text-xs text-fg-subtle">
            <code>role=&quot;switch&quot;</code>, <code>aria-checked</code>, Space + Enter toggle, focus-visible ring.
          </p>
        </div>

        <div className="rounded-md border border-divider bg-surface p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Native checkbox (visually styled)
          </p>
          <div className="flex items-center gap-3">
            <input
              id="native-checkbox-b"
              type="checkbox"
              checked={b}
              onChange={(e) => setB(e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
            <label htmlFor="native-checkbox-b" className="text-sm font-medium text-fg">
              Send weekly digest
            </label>
          </div>
          <p className="mt-2 text-xs text-fg-subtle">
            Native &lt;input type=&quot;checkbox&quot;&gt; — binary on/off semantics, not the
            two-state boolean a switch implies.
          </p>
        </div>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Why role=switch?",
            body: "A switch represents an on/off setting that takes effect immediately. A checkbox represents inclusion in a set or agreement. Screen readers announce them differently (\"switch\" vs \"checkbox\") which gives users the right mental model.",
          },
          {
            label: "Keyboard model",
            body: "Buttons with role=switch follow the button keyboard model: Space toggles, Enter toggles. The hand-rolled component intercepts both keys and prevents default to avoid scroll on Space.",
          },
          {
            label: "What Radix would add",
            body: "Radix Switch wraps a hidden native input so form submission and uncontrolled mode work; mirrors data-state attributes for CSS styling; and maintains the same role/aria-checked contract. The hand-rolled version skips form integration to keep the example small.",
          },
          {
            label: "Focus styles",
            body: "Both versions show a clearly visible 2px ring on focus-visible. Pointer focus does not show the ring, only keyboard focus.",
          },
        ]}
      />
    </>
  );
}
