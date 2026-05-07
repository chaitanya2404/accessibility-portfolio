"use client";

import { useState, useTransition } from "react";
import { useAnnounce } from "@/components/LiveRegion";
import { PAPER_THEME, T } from "./theme";

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

const labelStyle: React.CSSProperties = {
  fontFamily: T.headFont,
  fontSize: 11,
  color: PAPER_THEME.ink3,
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const inputStyle: React.CSSProperties = {
  appearance: "none",
  border: `1px solid ${PAPER_THEME.rule}`,
  background: PAPER_THEME.bg,
  color: PAPER_THEME.ink,
  fontFamily: T.bodyFont,
  fontSize: 14,
  padding: "12px 14px",
  borderRadius: 0,
  resize: "vertical",
};

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
      setSubmitted({ ticketId: "MSG-BOT", demo: true });
      return;
    }

    const ticketId = newTicketId();

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
          const reason = data.message ?? `HTTP ${response.status}`;
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
        style={{
          padding: 18,
          border: `1px solid ${PAPER_THEME.a11y}`,
          background: PAPER_THEME.bg2,
          color: PAPER_THEME.ink,
          fontFamily: T.bodyFont,
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: T.headFont,
            fontSize: 13,
            fontWeight: 600,
            color: PAPER_THEME.a11y,
          }}
        >
          ✓ {submitted.demo ? "message captured (demo mode)" : "message sent"}
        </p>
        <p style={{ margin: "8px 0 0", color: PAPER_THEME.ink2 }}>
          Reference{" "}
          <code
            style={{
              fontFamily: T.headFont,
              padding: "1px 6px",
              border: `1px solid ${PAPER_THEME.rule}`,
              background: PAPER_THEME.bg,
            }}
          >
            {submitted.ticketId}
          </code>
          .{" "}
          {submitted.demo
            ? "Real delivery is skipped in automated runs and when no access key is configured. Email me directly via the link in the side panel."
            : "I'll reply within a couple of business days."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={labelStyle}>name</span>
        <input
          id="contact-name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          style={inputStyle}
        />
        {errors.name && (
          <p
            id="contact-name-error"
            role="alert"
            style={{
              margin: 0,
              fontFamily: T.bodyFont,
              fontSize: 12,
              color: PAPER_THEME.accent,
            }}
          >
            {errors.name}
          </p>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={labelStyle}>email</span>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          style={inputStyle}
        />
        {errors.email && (
          <p
            id="contact-email-error"
            role="alert"
            style={{
              margin: 0,
              fontFamily: T.bodyFont,
              fontSize: 12,
              color: PAPER_THEME.accent,
            }}
          >
            {errors.email}
          </p>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={labelStyle}>message</span>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          style={inputStyle}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            style={{
              margin: 0,
              fontFamily: T.bodyFont,
              fontSize: 12,
              color: PAPER_THEME.accent,
            }}
          >
            {errors.message}
          </p>
        )}
      </label>

      {/* Honeypot — hidden from real users */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: -9999, height: 0, width: 0, overflow: "hidden" }}
      >
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
        <p
          role="alert"
          style={{
            margin: 0,
            padding: 12,
            border: `1px solid ${PAPER_THEME.accent}`,
            background: PAPER_THEME.bg2,
            color: PAPER_THEME.ink,
            fontFamily: T.bodyFont,
            fontSize: 13,
          }}
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          appearance: "none",
          border: 0,
          background: PAPER_THEME.accent,
          color: PAPER_THEME.accentInk,
          fontFamily: T.headFont,
          fontSize: 13,
          fontWeight: 600,
          padding: "14px 20px",
          cursor: pending ? "default" : "pointer",
          alignSelf: "flex-start",
          letterSpacing: ".02em",
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? "sending…" : "send message →"}
      </button>
    </form>
  );
}
