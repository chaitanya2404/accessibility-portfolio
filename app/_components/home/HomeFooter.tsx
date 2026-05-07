import { PAPER_THEME, T } from "./theme";

export function HomeFooter() {
  return (
    <footer
      style={{
        padding: "32px 32px",
        borderTop: `1px solid ${PAPER_THEME.rule}`,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        fontFamily: T.headFont,
        fontSize: 12,
        color: PAPER_THEME.ink3,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <span>© {new Date().getFullYear()} Chaitanya Reddy Basani</span>
      <span>WCAG 2.1 AA · accessible by default</span>
    </footer>
  );
}
