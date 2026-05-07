# Bundle budgets

Code is a liability. We track per-component gzip budgets via `size-limit` and ship them in the readme. This file is regenerated on `npm run size`.

## Why

- **Bundle size correlates with TTI on real devices.** A 10 KB component that ships on every page costs more than a 50 KB one that ships on a single low-traffic route.
- **Budgets force tradeoffs to be visible.** Pulling in a date library because one demo wants a calendar should be a conversation, not a silent commit.
- **Regression detection.** A component growing 30% in a single PR is worth a comment.

## Current budgets (placeholder until `npm run size` runs)

| Surface | Budget (gzip) |
|---|---|
| Home page | 25 KB |
| Components page (all 9 demos) | 70 KB |
| A11y audit single mode | 35 KB |
| A11y audit crawl mode | 45 KB |
| Division Hub overview | 25 KB |

These are placeholders pending the first `size-limit` run. The numbers come from the build output once Phase 7 lands.

## Enforcement

`size-limit` returns non-zero on budget overruns. Runs in CI so a regression blocks merge. Locally, `npm run size` prints the table.

## Trimming techniques used

- **Tree-shake Radix primitives.** Each Radix package is a separate npm install (`@radix-ui/react-dialog` etc) so unused primitives don't ship.
- **Lazy-load axe-core.** The Web Worker that imports `axe-core` is dynamic-imported only when the user picks "Full audit" mode. The default (Quick check) doesn't pay the axe-core bundle cost.
- **No icon libraries beyond `lucide-react`.** Each icon imports individually so unused icons aren't bundled.

## What we deliberately don't optimize

- **Tailwind CSS.** Tailwind v4 with the `@theme` system stays small after purge. Not worth replacing.
- **Inlined SVGs.** Each `lucide` icon is small enough that lazy-loading them adds more orchestration than savings.
