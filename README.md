# Accessibility-First Portfolio

**Live:** [accessibility-portfolio.vercel.app](https://accessibility-portfolio.vercel.app)

A three-project Next.js portfolio that treats accessibility as the product, not the polish. Every route targets WCAG 2.1 AA: semantic landmarks, keyboard parity, focus-visible styles, ARIA used sparingly and correctly, and a single live region provider that callers reach into via `useAnnounce()`.

## Projects

- **[Division Hub](./app/projects/division-hub)** (`/projects/division-hub`) — A mock county portal. Radix `NavigationMenu` mega-menu, cmdk `⌘K` staff search across all departments, sortable / filterable / paginated staff directory whose state lives in the URL, three-step service request wizard with per-field validation, and an SSE-driven "currently viewing" presence indicator backed by an in-memory hub.
- **[Components](./app/projects/components)** (`/projects/components`) — Nine accessible patterns built on Radix and cmdk plus a hand-rolled `role=switch` button. Each pairs with a visible panel listing its keyboard shortcuts, ARIA roles, and focus behavior. Sister surface: a [WCAG conformance report](./app/projects/components/conformance) mapping every demo to specific success criteria.
- **[A11y Audit](./app/projects/a11y-audit)** (`/projects/a11y-audit`) — Twelve foundational WCAG checks against any URL with severity-weighted scoring and snippet + line numbers per violation. Four modes: single-page audit, multi-page crawl with SSE progress streaming, before/after compare with diff semantics, and a Web Worker that runs the real `axe-core` against fetched HTML. JSON export, a 5-min cache, an in-memory token-bucket rate limit, exponential backoff retries on 5xx only. Honest [About](./app/projects/a11y-audit/about) page about what static-HTML audits cannot catch.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 with semantic CSS variables (no theming toggle, but a layered token system) · Radix UI · `cmdk` · `node-html-parser` · `axe-core` (Web Worker only) · `zod` · `lucide-react` · `clsx`. Tests: `@playwright/test` + `@axe-core/playwright`.

## Senior-bar features (where the time went)

| Project | Feature |
|---|---|
| Cross-cutting | Two-layer CSS variable token system (`--surface`, `--fg`, `--accent`, `--pass/warn/fail`) |
| | `LiveRegionProvider` mounted at the layout root; callers use `useAnnounce(message, priority)` |
| | Typed analytics + audit observability sinks (`lib/analytics.ts`, `lib/observability.ts`) |
| | URL-as-state helper with codecs for string / int / oneOf |
| | error.tsx, loading.tsx, not-found.tsx per route segment |
| | zod schemas at the data-module boundary (`StaffSchema` parsed at module load) |
| Division Hub | Compound `<DataTable>` + `<DataTable.Column>` API, controlled+uncontrolled |
| | URL state for sort / page / filter on every department directory |
| | `⌘K` cmdk Command.Dialog over all 18 staff |
| | Three-step Service Request wizard with per-field `aria-describedby` errors |
| | SSE presence indicator (`/api/presence`) backed by in-memory topic hub |
| | ISR (`revalidate = 60`) + protected `/api/revalidate` endpoint |
| Components | Compound DataTable demo (sort, filter, multi-select, shift-range, pagination, live count) |
| | Multi-step wizard demo with `useStepFocus` |
| | Live region playground (polite vs assertive) |
| | Hand-rolled `role=switch` Switch with Space + Enter, side by side with native checkbox |
| | VPAT-lite WCAG conformance report per component |
| | `/docs/[slug]` route with filesystem markdown |
| A11y Audit | Pluggable check architecture: one file per check, each declaring `id, name, wcagCriterion, severity, run` |
| | Severity-weighted scoring (critical=5, serious=3, moderate=2, minor=1) |
| | Multi-page crawl with SSE progress streaming and per-page result cards |
| | Before/after compare with diff semantics (improved/regressed/unchanged + count delta) |
| | Real axe-core inside a Web Worker against DOMParser-parsed HTML |
| | Robust HTTP client (timeout, exponential backoff on 5xx only, real UA, scheme guard) |
| | 5-minute TTL cache keyed by URL + checks version |
| | Per-IP token-bucket rate limit (10/min) |
| | JSON export of single-page or full crawl |
| | About page enumerating what the tool cannot detect |

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint
npm test             # Playwright + axe-core, 63 tests
```

## Testing

The 63-test Playwright suite asserts:
- axe-clean on every page (every project, every sub-route)
- keyboard parity for every interactive component
- ARIA wiring (aria-sort, aria-selected, aria-current, aria-expanded, aria-labelledby, role=switch, role=alert, role=status)
- URL state round-trips on the staff directory
- SSE crawl streams page-complete events end-to-end
- Server Action validation surfaces field-level errors
- Wizard focus moves to step heading on Next
- Hand-rolled Switch toggles via Space and Enter
- JSON export downloads with the host in the filename

Tested with NVDA, Lighthouse, and axe-core. Targets WCAG 2.1 AA. Real screen-reader transcripts and recording slots live in [docs/screen-reader-matrix.md](./docs/screen-reader-matrix.md).
