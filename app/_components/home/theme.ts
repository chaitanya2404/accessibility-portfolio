// Editorial Mono · Paper theme — single source of truth for the home page.
// Mirrors the design canvas decisions from the design handoff.

export const PAPER_THEME = {
  bg: "#f3efe8", // warm off-white
  bg2: "#ebe5da", // panel
  ink: "#1a1916",
  ink2: "#5a564f",
  ink3: "#6a6660", // bumped from design's #8a8478 to clear WCAG AA (≥ 4.5:1) on the paper bg
  rule: "#d8d2c4",
  accent: "#9a3309", // burnt orange, darkened from design's #c2410c to clear AA on the bg2 panel
  accentInk: "#fef7f0",
  a11y: "#0f5c2c", // darkened green, ≥ 4.5:1 on both bg and bg2
} as const;

export const FONT_MONO = `var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace`;

export const T = {
  headFont: FONT_MONO,
  bodyFont: FONT_MONO,
  accent: PAPER_THEME.accent,
} as const;

export const DENSITY = {
  sectionPad: 96,
  gap: 24,
  h1: 96,
  h2: 36,
  body: 16,
  leading: 1.65,
} as const;
