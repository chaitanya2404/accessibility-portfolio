import { Heading } from "@/components/Heading";
import type { Department } from "../data";
import { PresenceIndicator } from "./PresenceIndicator";
import { StaffDirectory } from "./StaffDirectory";

export function DepartmentPage({ department }: { department: Department }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section
        aria-labelledby="dept-heading"
        className="mb-12 grid gap-8 md:grid-cols-[1fr_minmax(0,18rem)] md:items-start"
      >
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Department
            </p>
            <PresenceIndicator departmentSlug={department.slug} />
          </div>
          <Heading level={1} id="dept-heading">
            {department.name}
          </Heading>
          <p className="mt-4 text-lg text-fg-muted">{department.description}</p>
        </div>
        <div
          aria-hidden="true"
          className={`h-44 w-full rounded-lg bg-gradient-to-br ${department.gradient}`}
        />
      </section>

      <section aria-labelledby="responsibilities-heading" className="mb-12 max-w-3xl">
        <Heading level={2} id="responsibilities-heading" className="mb-4">
          What we do
        </Heading>
        <ul className="list-disc space-y-2 pl-6 text-fg-muted marker:text-accent">
          {department.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="staff-heading">
        <Heading level={2} id="staff-heading" className="mb-2">
          Staff directory
        </Heading>
        <p className="mb-6 text-sm text-fg-muted">
          Sort, filter, and pagination state lives in the URL — share or
          bookmark a filtered view. Sort state is announced via{" "}
          <code className="rounded bg-surface-raised px-1 py-0.5">aria-sort</code>.
        </p>
        <StaffDirectory staff={department.staff} departmentName={department.name} />
      </section>
    </div>
  );
}
