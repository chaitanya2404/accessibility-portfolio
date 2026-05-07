"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { A11yNotes } from "./A11yNotes";

export function DialogDemo() {
  return (
    <>
      <div>
        <Dialog.Root>
          <Dialog.Trigger className="inline-flex items-center rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800">
            Open dialog
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-900/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                Confirm subscription
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-slate-700">
                You will receive a monthly digest of accessibility links. You
                can unsubscribe from any email.
              </Dialog.Description>
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label
                    htmlFor="dialog-email"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Email address
                  </label>
                  <input
                    id="dialog-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:border-indigo-700"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Dialog.Close className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
                    Cancel
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-700 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <Dialog.Close
                aria-label="Close dialog"
                className="absolute right-3 top-3 rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Focus management",
            body: "Focus traps inside the dialog when open. Returns to the triggering button on close.",
          },
          {
            label: "Keyboard",
            body: "Esc closes. Tab and Shift+Tab cycle within the dialog only — focus cannot escape to background content.",
          },
          {
            label: "ARIA",
            body: "role=\"dialog\", aria-modal=\"true\", aria-labelledby on the title, aria-describedby on the description.",
          },
          {
            label: "Background",
            body: "Marked aria-hidden=\"true\" and made inert while the dialog is open so screen readers ignore it.",
          },
        ]}
      />
    </>
  );
}
