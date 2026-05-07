import { DENSITY, PAPER_THEME, T } from "./theme";
import { SectionHeader } from "./SectionHeader";

type Role = {
  company: string;
  role: string;
  via?: string;
  period: string;
  bullets: string[];
};

const ROLES: Role[] = [
  {
    company: "Blue Cross Blue Shield",
    role: "Full Stack Developer",
    via: "via Incom Technologies",
    period: "Current",
    bullets: [
      "Build member-facing healthcare applications using Angular and Spring Boot.",
      "Drive WCAG 2.1 AA compliance across new features; partner with QA on assistive-tech smoke tests before release.",
      "Translate business stakeholder requirements into structured user stories and component specs.",
    ],
  },
  {
    company: "BNY Mellon",
    role: "Full Stack Developer",
    period: "Prior",
    bullets: [
      "Shipped secure, high-traffic financial web applications used by internal operators.",
      "Built reusable Angular components and tightened page performance against TTI / LCP budgets.",
      "Worked closely with UX designers and back-end teams across global time zones.",
    ],
  },
  {
    company: "Chemeketa Community College",
    role: "Web Developer",
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
    <section
      id="experience"
      aria-labelledby="experience-heading"
      style={{
        scrollMarginTop: 80,
        padding: `${DENSITY.sectionPad}px 32px`,
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <SectionHeader id="experience-heading" num="03" label="Experience" />
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: DENSITY.gap * 1.4,
        }}
      >
        {ROLES.map((e, i) => {
          const accent = i === 0 ? PAPER_THEME.accent : PAPER_THEME.ink3;
          return (
            <li
              key={e.company}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 32,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: 8,
                }}
                aria-hidden="true"
              >
                <span
                  style={{
                    fontFamily: T.headFont,
                    fontSize: 12,
                    color: accent,
                    fontWeight: 600,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    width: 1,
                    flex: 1,
                    background: PAPER_THEME.rule,
                    marginTop: 8,
                    minHeight: 30,
                  }}
                />
              </div>
              <div style={{ paddingBottom: DENSITY.gap }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    flexWrap: "wrap",
                    marginBottom: 6,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: T.headFont,
                      fontSize: 20,
                      fontWeight: 600,
                      color: PAPER_THEME.ink,
                      margin: 0,
                      letterSpacing: "-.01em",
                    }}
                  >
                    {e.company}
                  </h3>
                  <span
                    style={{
                      fontFamily: T.headFont,
                      fontSize: 12,
                      color: accent,
                      padding: "2px 8px",
                      border: `1px solid ${accent}`,
                      borderRadius: 99,
                    }}
                  >
                    {e.period}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: T.bodyFont,
                    fontSize: 14,
                    color: PAPER_THEME.ink2,
                    margin: 0,
                    marginBottom: 14,
                  }}
                >
                  {e.role}
                  {e.via ? ` · ${e.via}` : ""}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    color: PAPER_THEME.ink2,
                    fontFamily: T.bodyFont,
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {e.bullets.map((b) => (
                    <li key={b} style={{ textWrap: "pretty", marginBottom: 4 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
