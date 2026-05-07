"use client";

import { useState } from "react";
import { useAnnounce } from "@/components/LiveRegion";
import { A11yNotes } from "./A11yNotes";

export function LiveRegionDemo() {
  const announce = useAnnounce();
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              const stamp = new Date().toLocaleTimeString();
              const msg = `Polite update at ${stamp}`;
              setPoliteMessage(msg);
              announce(msg, "polite");
            }}
            className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong"
          >
            Send polite update
          </button>
          <button
            type="button"
            onClick={() => {
              const stamp = new Date().toLocaleTimeString();
              const msg = `Assertive update at ${stamp}`;
              setAssertiveMessage(msg);
              announce(msg, "assertive");
            }}
            className="rounded-md bg-fail px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Send assertive update
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-divider bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Polite — visible mirror
            </p>
            <p
              role="status"
              aria-live="polite"
              className="mt-1 min-h-6 text-sm text-fg"
            >
              {politeMessage || "(nothing yet)"}
            </p>
          </div>
          <div className="rounded-md border border-divider bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Assertive — visible mirror
            </p>
            <p
              role="alert"
              aria-live="assertive"
              className="mt-1 min-h-6 text-sm text-fg"
            >
              {assertiveMessage || "(nothing yet)"}
            </p>
          </div>
        </div>

        <p className="text-xs text-fg-subtle">
          The shared LiveRegionProvider also sends each message to a global
          sr-only announcer mounted in the root layout, so screen readers hear
          updates from anywhere in the app via a single audio surface.
        </p>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Polite vs assertive",
            body: "Use polite (role=status) for non-urgent updates: form save, filter applied, count changed. Use assertive (role=alert) only when the user must hear the message before continuing — typically errors that block progress.",
          },
          {
            label: "Why a single provider",
            body: "Multiple aria-live regions in different components race each other and can drop messages. A single provider per priority gives announcements predictable ordering, matches NVDA/JAWS expectations, and is easier to reason about.",
          },
          {
            label: "Re-announcing identical text",
            body: "Screen readers ignore identical text unless the live region's text node changes. The provider re-keys after a 4s timeout so back-to-back identical updates do announce.",
          },
        ]}
      />
    </>
  );
}
