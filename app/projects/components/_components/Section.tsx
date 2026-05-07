import { Heading } from "@/components/Heading";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
    >
      <Heading level={2} id={`${id}-heading`} className="mb-6">
        {title}
      </Heading>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        {children}
      </div>
    </section>
  );
}
