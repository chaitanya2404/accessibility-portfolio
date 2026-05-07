import { DENSITY, PAPER_THEME, T } from "./theme";

export function SectionHeader({
  num,
  label,
  sub,
  id,
}: {
  num: string;
  label: string;
  sub?: string;
  id: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: 18,
        marginBottom: DENSITY.gap * 1.6,
      }}
    >
      <span
        style={{
          fontFamily: T.headFont,
          fontSize: 11,
          color: PAPER_THEME.accent,
          letterSpacing: ".1em",
        }}
      >
        § {num}
      </span>
      <h2
        id={id}
        style={{
          fontFamily: T.headFont,
          fontSize: DENSITY.h2,
          margin: 0,
          fontWeight: 600,
          color: PAPER_THEME.ink,
          letterSpacing: "-.02em",
        }}
      >
        {label}
      </h2>
      {sub && (
        <span
          style={{
            fontFamily: T.bodyFont,
            fontSize: 13,
            color: PAPER_THEME.ink3,
            textWrap: "pretty",
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
