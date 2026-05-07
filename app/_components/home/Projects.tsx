import { DENSITY, PAPER_THEME } from "./theme";
import { SectionHeader } from "./SectionHeader";
import { ProjectsRail, type Project } from "./ProjectsRail";

const PROJECTS: Project[] = [
  {
    id: "division-hub",
    title: "Division Hub",
    kind: "Government portal",
    blurb:
      "An internal county portal with three departments, a mega-menu, and sortable staff directories that announce sort state to assistive tech.",
    stack: ["Next.js", "Radix", "Tailwind"],
    href: "/projects/division-hub",
    external: false,
    meta: { routes: 7, tests: 18, axe: 0, contrast: "7.2:1" },
  },
  {
    id: "components",
    title: "Components",
    kind: "Pattern library",
    blurb:
      "A small library of accessible patterns built on Radix primitives: combobox, accordion, dialog, tabs, and toast.",
    stack: ["Radix", "TypeScript", "Tailwind"],
    href: "/projects/components",
    external: false,
    meta: { routes: 5, tests: 12, axe: 0, contrast: "8.4:1" },
  },
  {
    id: "a11y-audit",
    title: "A11y Audit",
    kind: "Tool",
    blurb:
      "Paste a URL and the server fetches, parses, and reports on twelve foundational WCAG checks in a semantic table.",
    stack: ["Next.js", "Server Actions", "node-html-parser"],
    href: "/projects/a11y-audit",
    external: false,
    meta: { routes: 2, tests: 16, axe: 0, contrast: "7.0:1" },
  },
  {
    id: "service-request",
    title: "Service Request Form",
    kind: "Form / state machine",
    blurb:
      "A three-step form modelled as an explicit state machine, submitting via Server Actions with cookie-backed state so it works without JavaScript.",
    stack: ["Next.js", "Server Actions", "XState"],
    href: "https://forms-and-data.vercel.app/projects/service-request",
    external: true,
    meta: { routes: 3, tests: 14, axe: 0, contrast: "7.5:1" },
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    kind: "Data viz",
    blurb:
      "URL-driven filter state, streaming Suspense per chart, and three-layer chart accessibility — including a sonification button that plays the line trend as ascending or descending tones.",
    stack: ["Next.js", "D3", "Web Audio"],
    href: "https://forms-and-data.vercel.app/projects/analytics",
    external: true,
    meta: { routes: 4, tests: 10, axe: 0, contrast: "7.1:1" },
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      style={{
        scrollMarginTop: 80,
        padding: `${DENSITY.sectionPad}px 0`,
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <div style={{ padding: "0 32px" }}>
        <SectionHeader
          id="projects-heading"
          num="04"
          label="Projects"
          sub={`${PROJECTS.length} live · scroll horizontally to explore`}
        />
      </div>
      <ProjectsRail projects={PROJECTS} />
    </section>
  );
}
