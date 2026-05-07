"use server";

import { z } from "zod";
import { track } from "@/lib/analytics";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  email: z.email("Enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000),
  // Honeypot. Real users leave it empty; bots tend to fill every field.
  _gotcha: z.string().max(0).optional(),
});

export type ContactInput = Pick<
  z.infer<typeof ContactSchema>,
  "name" | "email" | "message"
>;

export type ContactResponse =
  | { ok: true; ticketId: string; demo?: boolean }
  | {
      ok: false;
      fieldErrors: Partial<Record<keyof ContactInput, string>>;
      formError?: string;
    };

export async function submitContactMessage(raw: unknown): Promise<ContactResponse> {
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<keyof ContactInput, string>> = {};
    const visibleFields = new Set<string>(["name", "email", "message"]);
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path !== "string" || !visibleFields.has(path)) continue;
      const key = path as keyof ContactInput;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, fieldErrors: errors };
  }

  // Silently absorb bot submissions: pretend success so they don't iterate.
  if (parsed.data._gotcha) {
    return { ok: true, ticketId: "MSG-BOT", demo: true };
  }

  const ticketId = `MSG-${Date.now().toString(36).toUpperCase()}`;
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    track("demo.interacted", { demo: "contact", action: "submitted-demo" });
    return { ok: true, ticketId, demo: true };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: parsed.data.name,
        replyto: parsed.data.email,
        subject: `Portfolio contact — ${parsed.data.name} (${ticketId})`,
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        ticketId,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return {
        ok: false,
        fieldErrors: {},
        formError: `Could not deliver your message (HTTP ${response.status}). ${detail.slice(0, 120)}`,
      };
    }

    track("demo.interacted", { demo: "contact", action: "submitted" });
    return { ok: true, ticketId };
  } catch (err) {
    const name = (err as Error)?.name;
    const reason =
      name === "TimeoutError" || name === "AbortError"
        ? "The delivery service timed out."
        : (err as Error).message;
    return {
      ok: false,
      fieldErrors: {},
      formError: `Could not deliver your message: ${reason}`,
    };
  }
}
