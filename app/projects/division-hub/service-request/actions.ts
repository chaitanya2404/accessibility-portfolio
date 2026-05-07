"use server";

import { z } from "zod";
import { track } from "@/lib/analytics";

const RequestSchema = z.object({
  type: z.enum(["procurement", "hr", "facilities", "other"]),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  email: z.email("Enter a valid email address."),
});

export type ServiceRequestInput = z.infer<typeof RequestSchema>;

export type ServiceRequestResponse =
  | { ok: true; ticketId: string }
  | { ok: false; fieldErrors: Partial<Record<keyof ServiceRequestInput, string>>; formError?: string };

const log: Array<ServiceRequestInput & { ticketId: string; receivedAt: string }> = [];

export async function submitServiceRequest(
  raw: unknown
): Promise<ServiceRequestResponse> {
  const parsed = RequestSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<keyof ServiceRequestInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ServiceRequestInput | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    track("service-request.validation-failed", {
      step: 0,
      field: Object.keys(errors)[0] ?? "unknown",
    });
    return { ok: false, fieldErrors: errors };
  }

  const ticketId = `SR-${Date.now().toString(36).toUpperCase()}`;
  log.push({ ...parsed.data, ticketId, receivedAt: new Date().toISOString() });
  track("service-request.submitted", { type: parsed.data.type });
  return { ok: true, ticketId };
}

export async function recentRequestCount(): Promise<number> {
  return log.length;
}
