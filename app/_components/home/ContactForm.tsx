"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import {
  submitContactMessage,
  type ContactInput,
} from "./contact-actions";

type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export function ContactForm() {
  const [form, setForm] = useState<ContactInput>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<{ ticketId: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const announce = useAnnounce();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const response = await submitContactMessage(form);
      if (response.ok) {
        setSubmitted({ ticketId: response.ticketId });
        announce(`Message sent. Reference ${response.ticketId}.`, "polite");
      } else {
        setErrors(response.fieldErrors);
        announce(
          `Form has errors: ${Object.values(response.fieldErrors)[0] ?? "Check the form."}`,
          "assertive"
        );
      }
    });
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-md border border-pass/30 bg-pass-soft p-4"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pass" aria-hidden="true" />
        <div className="text-sm text-pass">
          <p className="font-semibold">Message sent</p>
          <p className="mt-1">
            Reference{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono">{submitted.ticketId}</code>.
            I&rsquo;ll reply within a couple of business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-md border border-divider bg-surface p-5">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-fg">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className="mt-1 text-sm text-fail">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-fg">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="mt-1 text-sm text-fail">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1 text-sm text-fail">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
