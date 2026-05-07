import { Heading } from "@/components/Heading";
import { Wizard } from "./_components/Wizard";

export const metadata = {
  title: "Submit service request — Division Hub",
  description:
    "Three-step wizard with per-field validation, focus management, and assistive announcements.",
};

export default function ServiceRequestPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
          Division Hub
        </p>
        <Heading level={1}>Submit a service request</Heading>
        <p className="mt-4 text-lg text-fg-muted">
          Three steps. Tab order is logical, focus moves to the new step
          heading on each transition, and per-field errors are wired with{" "}
          <code className="rounded bg-surface-raised px-1">aria-invalid</code> +
          <code className="rounded bg-surface-raised px-1">aria-describedby</code>.
          Submission is announced through the global live region.
        </p>
      </header>
      <Wizard />
    </div>
  );
}
