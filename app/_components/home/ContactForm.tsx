"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";

type ContactInput = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof ContactInput, string>>;

type Submission = { ticketId: string; demo: boolean };

const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
  "ce6e7585-7102-4683-91c8-525ded9f33b9";

function validate(form: ContactInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  else if (form.name.length > 120) errors.name = "Name is too long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email.";
  if (form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  else if (form.message.length > 2000) errors.message = "Message is too long.";
  return errors;
}

function newTicketId() {
  return `MSG-${Date.now().toString(36).toUpperCase()}`;
}

function isAutomatedBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.webdriver === true;
}

export function ContactForm() {
  const [form, setForm] = useState<ContactInput>({ name: "", email: "", message: "" });
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Submission | null>(null);
  const [pending, startTransition] = useTransition();
  const announce = useAnnounce();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      announce(`Form has errors: ${Object.values(fieldErrors)[0]}`, "assertive");
      return;
    }
    setErrors({});

    if (honey) {
      // Honeypot tripped: pretend success and don't burn a real send.
      setSubmitted({ ticketId: "MSG-BOT", demo: true });
      return;
    }

    const ticketId = newTicketId();

    // Skip real delivery in automated browsers (Playwright) and when no key is
    // present. Both fall back to a "demo mode" success state.
    if (!ACCESS_KEY || isAutomatedBrowser()) {
      setSubmitted({ ticketId, demo: true });
      announce(`Message captured locally. Reference ${ticketId}.`, "polite");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("access_key", ACCESS_KEY);
      formData.append("from_name", form.name);
      formData.append("replyto", form.email);
      formData.append(
        "subject",
        `Portfolio contact — ${form.name} (${ticketId})`
      );
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("message", form.message);
      formData.append("ticketId", ticketId);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });
        const data = (await response.json().catch(() => ({}))) as {
          success?: boolean;
          message?: string;
        };
        if (response.ok && data.success !== false) {
          setSubmitted({ ticketId, demo: false });
          announce(`Message sent. Reference ${ticketId}.`, "polite");
        } else {
          const reason =
            data.message ?? `HTTP ${response.status}`;
          setFormError(`Could not deliver your message: ${reason}`);
          announce(`Form submission failed: ${reason}`, "assertive");
        }
      } catch (err) {
        const reason = (err as Error).message;
        setFormError(`Could not deliver your message: ${reason}`);
        announce(`Form submission failed: ${reason}`, "assertive");
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
          <p className="font-semibold">
            {submitted.demo ? "Message captured (demo mode)" : "Message sent"}
          </p>
          <p className="mt-1">
            Reference{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono">{submitted.ticketId}</code>.
            {submitted.demo
              ? " Real delivery is skipped in automated runs and when no access key is configured. Email me directly via the link in the side panel."
              : " I'll reply within a couple of business days."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-md border border-divider bg-surface p-5">
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

      {/* Honeypot — hidden from real users; bots tend to fill every field */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-gotcha">Leave this field empty</label>
        <input
          id="contact-gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </div>

      {formError && (
        <p role="alert" className="rounded-md border border-fail/40 bg-fail-soft p-3 text-sm text-fail">
          {formError}
        </p>
      )}

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
