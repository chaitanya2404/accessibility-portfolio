"use client";

import { useState } from "react";
import clsx from "clsx";
import { useStepFocus } from "@/components/useStepFocus";
import { useAnnounce } from "@/components/LiveRegion";
import { Heading } from "@/components/Heading";
import { A11yNotes } from "./A11yNotes";

type Prefs = {
  name: string;
  reduceMotion: boolean;
  highContrast: boolean;
  notifyBy: "email" | "sms" | "none";
};

const STEPS = [
  { id: 1, label: "Profile" },
  { id: 2, label: "Accessibility" },
  { id: 3, label: "Review" },
] as const;

export function WizardDemo() {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Prefs>({
    name: "",
    reduceMotion: false,
    highContrast: false,
    notifyBy: "email",
  });
  const [error, setError] = useState<string | null>(null);
  const headingRef = useStepFocus<HTMLHeadingElement>(step);
  const announce = useAnnounce();

  const next = () => {
    if (step === 1 && !prefs.name.trim()) {
      setError("Name is required.");
      announce("Name is required.", "assertive");
      return;
    }
    setError(null);
    setStep((s) => Math.min(STEPS.length, s + 1));
    announce(`Step ${Math.min(STEPS.length, step + 1)} of ${STEPS.length}.`, "polite");
  };

  const back = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = () => {
    announce("Preferences saved.", "polite");
  };

  return (
    <>
      <div className="rounded-md border border-divider bg-surface p-4">
        <ol
          aria-label="Wizard progress"
          className="mb-6 flex items-center gap-2 text-sm"
        >
          {STEPS.map((s, idx) => {
            const status =
              s.id < step ? "complete" : s.id === step ? "current" : "upcoming";
            return (
              <li
                key={s.id}
                aria-current={status === "current" ? "step" : undefined}
                className="flex items-center gap-2"
              >
                <span
                  className={clsx(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    status === "complete" && "bg-pass text-white",
                    status === "current" && "bg-accent text-accent-fg",
                    status === "upcoming" && "bg-surface-raised text-fg-subtle"
                  )}
                  aria-hidden="true"
                >
                  {s.id}
                </span>
                <span
                  className={clsx(
                    status === "current" ? "font-semibold text-fg" : "text-fg-muted"
                  )}
                >
                  {s.label}
                </span>
                {idx < STEPS.length - 1 ? (
                  <span aria-hidden="true" className="ml-1 text-fg-subtle">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <div role="group" aria-labelledby="wizard-step-heading">
          <Heading
            level={3}
            id="wizard-step-heading"
            className="mb-4 outline-none"
          >
            <span ref={headingRef} tabIndex={-1} className="outline-none">
              {STEPS[step - 1].label}
            </span>
          </Heading>

          {step === 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-fg" htmlFor="wiz-name">
                Display name
              </label>
              <input
                id="wiz-name"
                type="text"
                value={prefs.name}
                onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "wiz-name-error" : undefined}
                className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
              />
              {error ? (
                <p id="wiz-name-error" role="alert" className="text-sm text-fail">
                  {error}
                </p>
              ) : null}
            </div>
          )}

          {step === 2 && (
            <fieldset className="space-y-3">
              <legend className="sr-only">Accessibility preferences</legend>
              <label className="flex items-center gap-2 text-sm text-fg">
                <input
                  type="checkbox"
                  checked={prefs.reduceMotion}
                  onChange={(e) => setPrefs({ ...prefs, reduceMotion: e.target.checked })}
                />
                Reduce motion
              </label>
              <label className="flex items-center gap-2 text-sm text-fg">
                <input
                  type="checkbox"
                  checked={prefs.highContrast}
                  onChange={(e) => setPrefs({ ...prefs, highContrast: e.target.checked })}
                />
                High contrast
              </label>
              <fieldset className="mt-2">
                <legend className="text-sm font-medium text-fg">Notify by</legend>
                <div className="mt-2 flex gap-4 text-sm text-fg">
                  {(["email", "sms", "none"] as const).map((v) => (
                    <label key={v} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="wiz-notify"
                        value={v}
                        checked={prefs.notifyBy === v}
                        onChange={() => setPrefs({ ...prefs, notifyBy: v })}
                      />
                      {v === "none" ? "None" : v.toUpperCase()}
                    </label>
                  ))}
                </div>
              </fieldset>
            </fieldset>
          )}

          {step === 3 && (
            <dl className="space-y-2 text-sm text-fg">
              <div className="flex gap-2">
                <dt className="font-semibold">Name:</dt>
                <dd>{prefs.name}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold">Reduce motion:</dt>
                <dd>{prefs.reduceMotion ? "On" : "Off"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold">High contrast:</dt>
                <dd>{prefs.highContrast ? "On" : "Off"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold">Notify by:</dt>
                <dd>{prefs.notifyBy}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="rounded-md border border-divider px-3 py-2 text-sm font-medium text-fg hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>
          {step < STEPS.length ? (
            <button
              type="button"
              onClick={next}
              className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="rounded-md bg-pass px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Save preferences
            </button>
          )}
        </div>
      </div>
      <A11yNotes
        notes={[
          {
            label: "Step indicator",
            body: "Rendered as <ol> with aria-current=\"step\" on the active item. Visual styling repeats the same status as text, so screen reader users and sighted users get identical info.",
          },
          {
            label: "Focus on step change",
            body: "useStepFocus moves focus to the step heading when the step changes (skipping initial mount). Screen readers announce the new heading; sighted keyboard users see the focus ring.",
          },
          {
            label: "Validation",
            body: "Per-field errors use role=alert and aria-describedby on the input + aria-invalid=true. Validation runs only on Next so users aren't yelled at while typing.",
          },
        ]}
      />
    </>
  );
}
