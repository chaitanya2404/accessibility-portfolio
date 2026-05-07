import { PAPER_THEME } from "./theme";

const ink = PAPER_THEME.ink2;
const accent = PAPER_THEME.accent;

const common = {
  width: "100%",
  height: "100%",
  style: { display: "block" } as React.CSSProperties,
  preserveAspectRatio: "xMidYMid slice" as const,
};

export function ProjectGlyph({ kind }: { kind: string }) {
  switch (kind) {
    case "division-hub":
      return (
        <svg {...common} viewBox="0 0 380 220">
          <g stroke={ink} strokeWidth=".8" fill="none" opacity=".5">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1={i * 20} y1={0} x2={i * 20} y2={220} />
            ))}
          </g>
          <rect x="40" y="40" width="300" height="32" fill={accent} />
          <rect x="40" y="80" width="80" height="100" fill={ink} opacity=".15" />
          <rect x="130" y="80" width="80" height="100" fill={ink} opacity=".25" />
          <rect x="220" y="80" width="80" height="100" fill={ink} opacity=".15" />
        </svg>
      );
    case "components":
      return (
        <svg {...common} viewBox="0 0 380 220">
          <g fill="none" stroke={ink} strokeWidth="1.2" opacity=".6">
            <rect x="40" y="50" width="120" height="40" rx="20" />
            <rect x="170" y="50" width="60" height="40" rx="4" />
            <rect x="240" y="50" width="100" height="40" rx="4" />
            <rect x="40" y="100" width="80" height="80" rx="40" />
            <rect x="130" y="100" width="80" height="80" rx="4" />
            <rect x="220" y="100" width="120" height="80" rx="4" />
          </g>
          <circle cx="80" cy="140" r="12" fill={accent} />
        </svg>
      );
    case "a11y-audit":
      return (
        <svg {...common} viewBox="0 0 380 220">
          <g fill={ink} opacity=".7" fontFamily="ui-monospace,monospace" fontSize="10">
            <rect x="40" y="50" width="300" height="20" fill={ink} opacity=".1" />
            <text x="48" y="64">https://example.com</text>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(40,${90 + i * 28})`}>
                <rect x="0" y="0" width="300" height="20" fill={ink} opacity=".06" />
                <circle cx="10" cy="10" r="4" fill={accent} />
                <text x="22" y="14" fill={ink}>WCAG check {i + 1}</text>
                <text x="280" y="14" textAnchor="end" fill={accent}>pass</text>
              </g>
            ))}
          </g>
        </svg>
      );
    case "service-request":
      return (
        <svg {...common} viewBox="0 0 380 220">
          <g stroke={ink} strokeWidth="1.5" fill="none" opacity=".7">
            <circle cx="90" cy="110" r="22" />
            <circle cx="190" cy="110" r="22" fill={accent} stroke={accent} />
            <circle cx="290" cy="110" r="22" />
            <line x1="112" y1="110" x2="168" y2="110" />
            <line x1="212" y1="110" x2="268" y2="110" />
          </g>
          <g
            fill={ink}
            fontFamily="ui-monospace,monospace"
            fontSize="11"
            opacity=".6"
            textAnchor="middle"
          >
            <text x="90" y="160">contact</text>
            <text x="190" y="160" fill={accent}>details</text>
            <text x="290" y="160">review</text>
          </g>
        </svg>
      );
    case "analytics":
      return (
        <svg {...common} viewBox="0 0 380 220">
          <polyline
            points="30,170 70,140 110,150 150,100 190,120 230,80 270,90 310,50 350,70"
            fill="none"
            stroke={accent}
            strokeWidth="2"
          />
          <g fill={ink} opacity=".15">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x={40 + i * 40}
                y={180}
                width="20"
                height={20 + Math.sin(i) * 15 + 15}
              />
            ))}
          </g>
          <g stroke={ink} strokeWidth=".5" opacity=".3">
            {[50, 90, 130, 170].map((y) => (
              <line key={y} x1="20" y1={y} x2="360" y2={y} />
            ))}
          </g>
        </svg>
      );
    default:
      return null;
  }
}
