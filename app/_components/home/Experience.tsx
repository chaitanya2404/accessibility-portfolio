import { Heading } from "@/components/Heading";

type Role = {
  title: string;
  org: string;
  via?: string;
  period: string;
  bullets: string[];
};

const ROLES: Role[] = [
  {
    title: "Full Stack Developer",
    org: "Blue Cross Blue Shield",
    via: "Incom Technologies",
    period: "Current",
    bullets: [
      "Build member-facing healthcare applications using Angular and Spring Boot.",
      "Drive WCAG 2.1 AA compliance across new features; partner with QA on assistive-tech smoke tests before release.",
      "Translate business stakeholder requirements into structured user stories and component specs.",
    ],
  },
  {
    title: "Full Stack Developer",
    org: "BNY Mellon",
    period: "Prior",
    bullets: [
      "Shipped secure, high-traffic financial web applications used by internal operators.",
      "Built reusable Angular components and tightened page performance against TTI / LCP budgets.",
      "Worked closely with UX designers and back-end teams across global time zones.",
    ],
  },
  {
    title: "Web Developer",
    org: "Chemeketa Community College",
    period: "Earlier",
    bullets: [
      "Maintained academic websites for students, faculty, and staff.",
      "Designed page templates, navigation, and visual content for non-technical authors.",
      "Ran usability sessions and addressed accessibility findings before launch.",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-20 print:break-inside-avoid">
      <Heading level={2} id="experience-heading" className="mb-3">
        Experience
      </Heading>
      <ol className="relative space-y-6 border-l-2 border-divider pl-6">
        {ROLES.map((role) => (
          <li key={`${role.org}-${role.title}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[34px] top-1 h-3 w-3 rounded-full bg-accent ring-4 ring-surface"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Heading level={3} className="text-lg">
                {role.title} ·{" "}
                <span className="text-fg-muted">{role.org}</span>
              </Heading>
              <p className="text-xs uppercase tracking-wider text-fg-subtle">
                {role.period}
              </p>
            </div>
            {role.via ? (
              <p className="text-sm text-fg-subtle">via {role.via}</p>
            ) : null}
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-muted marker:text-accent">
              {role.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
