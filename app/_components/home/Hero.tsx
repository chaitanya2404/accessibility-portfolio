import { DENSITY, PAPER_THEME, T } from "./theme";
import { HeroActions } from "./HeroActions";
import { Marquee } from "./Marquee";

export function Hero() {
  return (
    <header
      id="top"
      style={{
        padding: `${DENSITY.sectionPad + 24}px 32px ${DENSITY.sectionPad}px`,
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
        position: "relative",
        overflow: "hidden",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      {/* Topline: just availability */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: DENSITY.gap * 1.5,
          fontFamily: T.headFont,
          fontSize: 12,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: PAPER_THEME.ink3,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: PAPER_THEME.a11y,
              boxShadow: `0 0 0 3px ${PAPER_THEME.a11y}22`,
              animation: "home-pulse 2s ease-in-out infinite",
            }}
          />
          available · open to relocation
        </span>
        <span style={{ flex: 1, height: 1, background: PAPER_THEME.rule }} />
      </div>
      <style>{`@keyframes home-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }`}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 280px)",
          gap: 48,
          alignItems: "end",
        }}
      >
        <h1
          style={{
            fontFamily: T.headFont,
            fontWeight: 600,
            letterSpacing: "-.04em",
            fontSize: "clamp(56px, 9vw, 96px)",
            lineHeight: 0.96,
            margin: 0,
            color: PAPER_THEME.ink,
            textWrap: "balance",
          }}
        >
          Chaitanya
          <br />
          Reddy <span style={{ color: PAPER_THEME.accent }}>Basani</span>
          <span style={{ color: PAPER_THEME.accent }}>.</span>
        </h1>

        {/* Credentials stack — fills the negative space beside the headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              border: `1px solid ${PAPER_THEME.rule}`,
              padding: "14px 16px",
              background: PAPER_THEME.bg2,
            }}
          >
            <div
              style={{
                fontFamily: T.headFont,
                fontSize: 10,
                color: PAPER_THEME.ink3,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                marginBottom: 6,
              }}
            >
              experience
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: T.headFont,
                  fontSize: 36,
                  fontWeight: 700,
                  color: PAPER_THEME.ink,
                  lineHeight: 1,
                  letterSpacing: "-.03em",
                }}
              >
                7+
              </span>
              <span style={{ fontFamily: T.bodyFont, fontSize: 12, color: PAPER_THEME.ink2 }}>
                yrs
              </span>
            </div>
          </div>
          <dl
            style={{
              border: `1px solid ${PAPER_THEME.rule}`,
              padding: "12px 14px",
              fontFamily: T.headFont,
              fontSize: 11,
              color: PAPER_THEME.ink2,
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "6px 14px",
              margin: 0,
            }}
          >
            <dt style={{ color: PAPER_THEME.ink3 }}>role</dt>
            <dd style={{ color: PAPER_THEME.ink, margin: 0 }}>Full Stack Dev</dd>
            <dt style={{ color: PAPER_THEME.ink3 }}>based</dt>
            <dd style={{ color: PAPER_THEME.ink, margin: 0 }}>Irving, TX</dd>
            <dt style={{ color: PAPER_THEME.ink3 }}>focus</dt>
            <dd style={{ color: PAPER_THEME.ink, margin: 0 }}>A11y · Front-end</dd>
            <dt style={{ color: PAPER_THEME.ink3 }}>stack</dt>
            <dd style={{ color: PAPER_THEME.ink, margin: 0 }}>Angular · Spring</dd>
          </dl>
        </div>
      </div>

      <p
        style={{
          fontFamily: T.bodyFont,
          fontSize: DENSITY.body * 1.6,
          lineHeight: 1.35,
          color: PAPER_THEME.ink,
          margin: 0,
          marginTop: DENSITY.gap * 2,
          maxWidth: "32ch",
          textWrap: "pretty",
          fontWeight: 400,
        }}
      >
        Full Stack Developer — front-end, with care for the details.
      </p>

      <HeroActions />

      <Marquee />
    </header>
  );
}
