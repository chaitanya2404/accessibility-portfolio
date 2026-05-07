import { PAPER_THEME, T } from "./theme";

const ITEMS = [
  "Angular",
  "TypeScript",
  "Spring Boot",
  "Java",
  "PostgreSQL",
  "AWS",
  "Healthcare",
  "Finance",
  "Higher Ed",
  "Front-end · 7yr",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      aria-hidden="true"
      style={{
        marginTop: 56,
        marginInline: -32,
        paddingBlock: 14,
        borderTop: `1px solid ${PAPER_THEME.rule}`,
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
        overflow: "hidden",
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          fontFamily: T.headFont,
          fontSize: 12,
          color: PAPER_THEME.ink2,
          whiteSpace: "nowrap",
          width: "max-content",
          animation: "home-marquee 38s linear infinite",
        }}
      >
        {row.map((it, i) => (
          <span
            key={i}
            style={{ display: "inline-flex", alignItems: "center", gap: 48 }}
          >
            {it}
            <span style={{ color: PAPER_THEME.accent }}>◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes home-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
