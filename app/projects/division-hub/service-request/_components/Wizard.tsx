"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { CheckCircle2 } from "lucide-react";
import { Heading } from "@/components/Heading";
import { useStepFocus } from "@/components/useStepFocus";
import { useAnnounce } from "@/components/LiveRegion";
import { track } from "@/lib/analytics";
import { submitServiceRequest, type ServiceRequestInput } from "../actions";

const STEPS = [
  { id: 1, label: "Type" },
  { id: 2, label: "Details" },
  { id: 3, label: "Review" },
] as const;

type FieldErrors = Partial<Record<keyof ServiceRequestInput, string>>;

const TYPES: { value: ServiceRequestInput["type"]; label: string; description: string }[] = [
  { value: "procurement", label: "Procurement", description: "Vendor onboarding, RFP help, contract review." },
  { value: "hr", label: "HR", description: "Benefits, onboarding, employee relations." },
  { value: "facilities", label: "Facilities", description: "Maintenance, building access, safety concerns." },
  { value: "other", label: "Other", description: "Anything that doesn't fit above." },
];

export function Wizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ServiceRequestInput>({
    type: "procurement",
    title: "",
    description: "",
    email: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<{ ticketId: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const headingRef = useStepFocus<HTMLSpanElement>(submitted ? "done" : step);
  const announce = useAnnounce();

  const validateStep = (target: number): FieldErrors => {
    const out: FieldErrors = {};
    // Validate the step we're leaving. Advancing from step 2 to 3 requires
    // title + description; step 1 to 2 has nothing to validate (type has a
    // default).
    if (target >= 3) {
      if (form.title.trim().length < 3) out.title = "Title must be at least 3 characters.";
      if (form.description.trim().length < 10)
        out.description = "Description must be at least 10 characters.";
    }
    return out;
  };

  const next = () => {
    const e = validateStep(step + 1);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      track("service-request.validation-failed", { step, field: Object.keys(e)[0] });
      announce(`Cannot continue: ${Object.values(e)[0]}`, "assertive");
      return;
    }
    track("service-request.step.changed", { from: step, to: step + 1 });
    setStep((s) => Math.min(STEPS.length, s + 1));
  };

  const back = () => {
    setErrors({});
    track("service-request.step.changed", { from: step, to: step - 1 });
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = () => {
    startTransition(async () => {
      const response = await submitServiceRequest(form);
      if (response.ok) {
        setSubmitted({ ticketId: response.ticketId });
        announce(`Request submitted. Ticket ${response.ticketId}.`, "polite");
      } else {
        setErrors(response.fieldErrors);
        const firstField = Object.keys(response.fieldErrors)[0];
        if (firstField === "title" || firstField === "description") setStep(2);
        else if (firstField === "email") setStep(3);
        announce(
          `Validation failed: ${Object.values(response.fieldErrors)[0] ?? "Check the form."}`,
          "assertive"
        );
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-md border border-pass/30 bg-pass-soft p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 text-pass" aria-hidden="true" />
          <div>
            <Heading level={2} className="mb-2 text-pass">
              <span ref={headingRef} tabIndex={-1} className="outline-none">
                Request submitted
              </span>
            </Heading>
            <p className="text-sm text-pass">
              Ticket <code className="rounded bg-surface px-1.5 py-0.5 font-mono">{submitted.ticketId}</code>{" "}
              has been recorded. The {form.type} team will follow up at {form.email}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-divider bg-surface p-6">
      <ol aria-label="Service request progress" className="mb-6 flex items-center gap-3 text-sm">
        {STEPS.map((s, idx) => {
          const status = s.id < step ? "complete" : s.id === step ? "current" : "upcoming";
          return (
            <li
              key={s.id}
              aria-current={status === "current" ? "step" : undefined}
              className="flex items-center gap-2"
            >
              <span
                aria-hidden="true"
                className={clsx(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  status === "complete" && "bg-pass text-white",
                  status === "current" && "bg-accent text-accent-fg",
                  status === "upcoming" && "bg-surface-raised text-fg-subtle"
                )}
              >
                {s.id}
              </span>
              <span className={status === "current" ? "font-semibold text-fg" : "text-fg-muted"}>
                {s.label}
              </span>
              {idx < STEPS.length - 1 && <span aria-hidden="true" className="text-fg-subtle">/</span>}
            </li>
          );
        })}
      </ol>

      <div role="group" aria-labelledby="sr-step-heading">
        <Heading level={2} id="sr-step-heading" className="mb-4">
          <span ref={headingRef} tabIndex={-1} className="outline-none">
            Step {step}: {STEPS[step - 1].label}
          </span>
        </Heading>

        {step === 1 && (
          <fieldset className="space-y-2">
            <legend className="mb-2 block text-sm font-medium text-fg">
              What kind of request is this?
            </legend>
            {TYPES.map((t) => (
              <label
                key={t.value}
                className={clsx(
                  "flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-surface-raised",
                  form.type === t.value
                    ? "border-accent bg-accent-soft"
                    : "border-divider"
                )}
              >
                <input
                  type="radio"
                  name="sr-type"
                  value={t.value}
                  checked={form.type === t.value}
                  onChange={() => setForm({ ...form, type: t.value })}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold text-fg">{t.label}</span>
                  <span className="block text-sm text-fg-muted">{t.description}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="sr-title" className="mb-1 block text-sm font-medium text-fg">
                Title
              </label>
              <input
                id="sr-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                aria-invalid={errors.title ? "true" : undefined}
                aria-describedby={errors.title ? "sr-title-error" : undefined}
                className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
              />
              {errors.title && (
                <p id="sr-title-error" role="alert" className="mt-1 text-sm text-fail">
                  {errors.title}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="sr-description" className="mb-1 block text-sm font-medium text-fg">
                Description
              </label>
              <textarea
                id="sr-description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                aria-invalid={errors.description ? "true" : undefined}
                aria-describedby={errors.description ? "sr-description-error" : undefined}
                className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
              />
              {errors.description && (
                <p id="sr-description-error" role="alert" className="mt-1 text-sm text-fail">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="sr-email" className="mb-1 block text-sm font-medium text-fg">
                Your email
              </label>
              <input
                id="sr-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "sr-email-error" : undefined}
                className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
              />
              {errors.email && (
                <p id="sr-email-error" role="alert" className="mt-1 text-sm text-fail">
                  {errors.email}
                </p>
              )}
            </div>
            <dl className="rounded-md border border-divider bg-surface-raised p-3 text-sm">
              <div className="flex gap-2"><dt className="font-semibold text-fg">Type:</dt><dd>{form.type}</dd></div>
              <div className="flex gap-2"><dt className="font-semibold text-fg">Title:</dt><dd>{form.title}</dd></div>
              <div className="flex gap-2"><dt className="font-semibold text-fg">Description:</dt><dd className="text-fg-muted">{form.description}</dd></div>
            </dl>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={back}
          disabled={step === 1 || pending}
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
            disabled={pending}
            className="rounded-md bg-pass px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Submitting…" : "Submit request"}
          </button>
        )}
      </div>
    </div>
  );
}
