# Why no Storybook

A documented non-decision. Skipping Storybook is itself a choice; this is the rationale.

## What Storybook would have given us

- **Isolated component rendering** for visual review without booting a route.
- **Knobs / controls** for prop permutations.
- **The a11y addon** that runs axe in the docs page.
- **A polished docs experience** that doesn't require Next.

## Why we skipped it at this scale

- **The component surface is small** — nine demos, all already on `/projects/components` with visible A11y notes. A second rendering surface would duplicate, not add.
- **Build complexity.** Storybook has its own bundler config, its own React tree, and its own Tailwind/PostCSS plumbing. Each new dep we add to a portfolio is justified by the signal it sends; Storybook for nine components doesn't clear that bar.
- **The a11y addon runs axe in the browser**, which we already do via Playwright + `@axe-core/playwright` against the live demo page. We get the same coverage at the integration level.
- **No external consumers.** Storybook earns its keep when other teams need to review components in isolation. We don't have that audience yet.

## When we would adopt it

- The component count crosses ~25 and we feel duplication pain across surfaces.
- A consumer team (mobile, marketing) starts depending on the components and asks for an isolated playground.
- We add design tokens that need visual audit across themes.

## What we use instead

- **Live demo page** at `/projects/components` showing every component with its a11y contract.
- **Compound DataTable** has a Components-page demo and a Division Hub usage; the API design doc covers tradeoffs.
- **Playwright** runs every keyboard interaction we'd otherwise click through manually in Storybook.
- **axe-playwright** asserts zero a11y violations on every demo page.

The test suite plus the visible demo page covers the same ground for fewer dependencies. We re-evaluate when the cost of *not* having Storybook exceeds the cost of having it.
