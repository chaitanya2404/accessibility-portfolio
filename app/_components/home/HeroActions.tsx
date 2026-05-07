"use client";

import { DENSITY, PAPER_THEME, T } from "./theme";

const baseStyle: React.CSSProperties = {
  appearance: "none",
  fontFamily: T.headFont,
  fontSize: 13,
  fontWeight: 500,
  padding: "11px 18px",
  borderRadius: 0,
  cursor: "pointer",
  letterSpacing: ".01em",
  transition: "background .15s, color .15s, border-color .15s",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const primary: React.CSSProperties = {
  ...baseStyle,
  border: `1px solid ${PAPER_THEME.accent}`,
  background: PAPER_THEME.accent,
  color: PAPER_THEME.accentInk,
};

const secondary: React.CSSProperties = {
  ...baseStyle,
  border: `1px solid ${PAPER_THEME.rule}`,
  background: "transparent",
  color: PAPER_THEME.ink,
};

export function HeroActions() {
  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginTop: DENSITY.gap * 2,
        flexWrap: "wrap",
      }}
    >
      <button type="button" onClick={() => onJump("projects")} style={primary}>
        scroll projects →
      </button>
      <button type="button" onClick={() => onJump("contact")} style={secondary}>
        get in touch
      </button>
      <button type="button" onClick={() => window.print()} style={secondary}>
        print résumé
      </button>
    </div>
  );
}
