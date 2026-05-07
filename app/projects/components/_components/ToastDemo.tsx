"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { X } from "lucide-react";
import { A11yNotes } from "./A11yNotes";

export function ToastDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Toast.Provider swipeDirection="right" duration={4000}>
      <div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            window.requestAnimationFrame(() => setOpen(true));
          }}
          className="inline-flex items-center rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          Show toast
        </button>
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="data-[state=open]:animate-none flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-lg"
        >
          <div className="flex-1">
            <Toast.Title className="text-sm font-semibold text-slate-900">
              Settings saved
            </Toast.Title>
            <Toast.Description className="mt-1 text-sm text-slate-700">
              Your preferences will sync to other devices in a moment.
            </Toast.Description>
          </div>
          <Toast.Action altText="Undo saving settings" asChild>
            <button
              type="button"
              className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              Undo
            </button>
          </Toast.Action>
          <Toast.Close
            aria-label="Close notification"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-[min(92vw,22rem)] flex-col gap-2 outline-none" />
      </div>
      <A11yNotes
        notes={[
          {
            label: "Live region",
            body: "Viewport is a polite live region by default. Screen readers announce the toast without moving focus.",
          },
          {
            label: "Keyboard",
            body: "F6 jumps to the toast viewport from anywhere on the page. Tab moves between the action and close buttons. Esc dismisses.",
          },
          {
            label: "ARIA",
            body: "Each toast carries role=\"status\" and aria-live=\"polite\". The action button must include altText so screen readers can describe it.",
          },
          {
            label: "Timing",
            body: "Auto-dismiss is paused when focused or when the user is interacting with the page, so timeouts don't strand keyboard users mid-read.",
          },
        ]}
      />
    </Toast.Provider>
  );
}
