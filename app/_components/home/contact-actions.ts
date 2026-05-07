"use server";

import { z } from "zod";
import { track } from "@/lib/analytics";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  email: z.email("Enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export type ContactResponse =
  | { ok: true; ticketId: string }
  | { ok: false; fieldErrors: Partial<Record<keyof ContactInput, string>> };

const log: Array<ContactInput & { ticketId: string; receivedAt: string }> = [];

export async function submitContactMessage(raw: unknown): Promise<ContactResponse> {
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false, fieldErrors: errors };
  }

  const ticketId = `MSG-${Date.now().toString(36).toUpperCase()}`;
  log.push({ ...parsed.data, ticketId, receivedAt: new Date().toISOString() });
  track("demo.interacted", { demo: "contact", action: "submitted" });
  return { ok: true, ticketId };
}
