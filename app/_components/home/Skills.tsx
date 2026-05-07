import { Heading } from "@/components/Heading";

const SKILL_GROUPS: { name: string; skills: string[] }[] = [
  {
    name: "Front-End",
    skills: [
      "Angular",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "SASS",
      "Bootstrap",
      "Responsive design",
    ],
  },
  {
    name: "Back-End",
    skills: ["Java", "Spring Boot", "REST APIs", "Node.js"],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL", "Oracle", "MongoDB", "Snowflake"],
  },
  {
    name: "Cloud & DevOps",
    skills: ["AWS", "Azure", "Git", "Jenkins", "Docker"],
  },
  {
    name: "Accessibility",
    skills: ["WCAG 2.1 AA", "Section 508", "ARIA", "NVDA", "axe"],
  },
  {
    name: "Tooling",
    skills: ["Figma", "Jira", "VS Code", "Chrome DevTools", "Lighthouse"],
  },
  {
    name: "CMS",
    skills: ["WordPress", "Drupal"],
  },
];

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-20 print:break-inside-avoid">
      <Heading level={2} id="skills-heading" className="mb-3">
        Skills
      </Heading>
      <p className="mb-6 max-w-3xl text-fg-muted">
        Grouped by category. Tools listed are ones used recently in shipped
        production work, not aspirational.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group) => (
          <section
            key={group.name}
            aria-labelledby={`skills-${group.name.replace(/\W+/g, "-").toLowerCase()}`}
            className="rounded-lg border border-divider bg-surface p-4"
          >
            <Heading
              level={3}
              id={`skills-${group.name.replace(/\W+/g, "-").toLowerCase()}`}
              className="mb-3 text-base"
            >
              {group.name}
            </Heading>
            <ul className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-strong"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
