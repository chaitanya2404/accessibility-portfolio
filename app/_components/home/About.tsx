import { DENSITY, PAPER_THEME, T } from "./theme";
import { SectionHeader } from "./SectionHeader";

const FACTS: { k: string; v: string }[] = [
  { k: "Master's, CS", v: "University of North Texas" },
  { k: "Bachelor's, CS", v: "Computer science fundamentals" },
  { k: "7+ years", v: "Healthcare · Finance · Higher ed" },
  { k: "Specialty", v: "Front-end + accessibility" },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        scrollMarginTop: 80,
        padding: `${DENSITY.sectionPad}px 32px`,
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <SectionHeader id="about-heading" num="01" label="About" />
      <div
        className="home-about-split"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 64,
        }}
      >
        <p
          style={{
            fontFamily: T.bodyFont,
            fontSize: DENSITY.body * 1.25,
            lineHeight: 1.5,
            color: PAPER_THEME.ink,
            margin: 0,
            textWrap: "pretty",
          }}
        >
          I&rsquo;m a full stack developer with seven-plus years building web
          applications across healthcare, finance, and higher education. My
          day-to-day is Angular and TypeScript on the front end and Java with
          Spring Boot on the back end, but the work I care about most is
          closer to the user — clean front-end code, accessibility, and
          user-centered design.
        </p>
        <p
          style={{
            fontFamily: T.bodyFont,
            fontSize: DENSITY.body,
            lineHeight: DENSITY.leading,
            color: PAPER_THEME.ink2,
            margin: 0,
            textWrap: "pretty",
          }}
        >
          I enjoy translating ideas from non-technical stakeholders into
          polished web experiences. The best part of the job, for me, is
          sitting with someone who knows the problem and turning that into
          something a screen reader user can navigate as easily as a mouse
          user.
        </p>
      </div>

      <dl
        className="home-about-facts"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 1,
          marginTop: DENSITY.gap * 2,
          background: PAPER_THEME.rule,
          border: `1px solid ${PAPER_THEME.rule}`,
        }}
      >
        {FACTS.map((f) => (
          <div
            key={f.k}
            style={{ background: PAPER_THEME.bg, padding: "20px 18px", margin: 0 }}
          >
            <dt
              style={{
                fontFamily: T.headFont,
                fontSize: 11,
                color: PAPER_THEME.ink3,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 8,
              }}
            >
              {f.k}
            </dt>
            <dd
              style={{
                fontFamily: T.bodyFont,
                fontSize: 14,
                color: PAPER_THEME.ink,
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {f.v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
