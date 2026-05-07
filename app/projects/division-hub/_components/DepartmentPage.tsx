import { Heading } from "@/components/Heading";
import type { Department } from "../data";
import { StaffTable } from "./StaffTable";

export function DepartmentPage({ department }: { department: Department }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section
        aria-labelledby="dept-heading"
        className="mb-12 grid gap-8 md:grid-cols-[1fr_minmax(0,18rem)] md:items-start"
      >
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-700">
            Department
          </p>
          <Heading level={1} id="dept-heading">
            {department.name}
          </Heading>
          <p className="mt-4 text-lg text-slate-700">{department.description}</p>
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
        <ul className="list-disc space-y-2 pl-6 text-slate-700 marker:text-indigo-600">
          {department.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="staff-heading">
        <Heading level={2} id="staff-heading" className="mb-2">
          Staff directory
        </Heading>
        <p className="mb-6 text-sm text-slate-600">
          Click a column header to sort. Sort state is announced to screen
          readers via <code className="rounded bg-slate-100 px-1 py-0.5">aria-sort</code>.
        </p>
        <StaffTable staff={department.staff} departmentName={department.name} />
      </section>
    </div>
  );
}
