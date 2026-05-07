# Accessibility-First Portfolio

A three-project Next.js portfolio that treats accessibility as the product, not the polish. Every route targets WCAG 2.1 AA: semantic landmarks, keyboard parity, focus-visible styles, and ARIA used sparingly and correctly.

## Projects

- **[Division Hub](./app/projects/division-hub)** (`/projects/division-hub`) — A mock county portal with a Radix `NavigationMenu` mega-menu and sortable staff directories that announce sort state via `aria-sort`.
- **[Components](./app/projects/components)** (`/projects/components`) — Five Radix-built patterns (Accordion, Dialog, Tabs, Combobox, Toast) paired with always-visible panels documenting their keyboard, ARIA, and focus contracts.
- **[A11y Audit](./app/projects/a11y-audit)** (`/projects/a11y-audit`) — A Server-Action-powered tool that fetches a URL and runs four foundational WCAG checks: `<html lang>`, `<title>`, images missing `alt`, and inputs missing labels.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Radix UI primitives · `cmdk` · `node-html-parser` · `lucide-react` · `clsx`

## Run locally

```bash
npm install
npm run dev
```

## Accessibility

Tested with NVDA, Lighthouse, and axe-core. Targets WCAG 2.1 AA.
