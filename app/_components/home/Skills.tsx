import { DENSITY, PAPER_THEME, T } from "./theme";
import { SectionHeader } from "./SectionHeader";

const SKILL_GROUPS: { group: string; items: string[] }[] = [
  {
    group: "Front-End",
    items: [
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
  { group: "Back-End", items: ["Java", "Spring Boot", "REST APIs", "Node.js"] },
  { group: "Databases", items: ["PostgreSQL", "Oracle", "MongoDB", "Snowflake"] },
  { group: "Cloud/DevOps", items: ["AWS", "Azure", "Git", "Jenkins", "Docker"] },
  { group: "Accessibility", items: ["WCAG 2.1 AA", "Section 508", "ARIA", "NVDA", "axe"] },
  { group: "Tooling", items: ["Figma", "Jira", "VS Code", "Chrome DevTools", "Lighthouse"] },
  { group: "CMS", items: ["WordPress", "Drupal"] },
];

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      style={{
        scrollMarginTop: 80,
        padding: `${DENSITY.sectionPad}px 32px`,
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <SectionHeader id="skills-heading" num="02" label="Skills" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: DENSITY.gap * 1.2,
        }}
      >
        {SKILL_GROUPS.map((g) => (
          <section
            key={g.group}
            aria-labelledby={`skills-${g.group.replace(/\W+/g, "-").toLowerCase()}`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: `1px solid ${PAPER_THEME.rule}`,
              }}
            >
              <h3
                id={`skills-${g.group.replace(/\W+/g, "-").toLowerCase()}`}
                style={{
                  fontFamily: T.headFont,
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                  color: PAPER_THEME.ink,
                  letterSpacing: ".01em",
                }}
              >
                {g.group}
              </h3>
              <span
                style={{
                  fontFamily: T.headFont,
                  fontSize: 11,
                  color: PAPER_THEME.ink3,
                }}
              >
                {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {g.items.map((it) => (
                <li
                  key={it}
                  style={{
                    fontFamily: T.bodyFont,
                    fontSize: 14,
                    color: PAPER_THEME.ink2,
                  }}
                >
                  {it}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
