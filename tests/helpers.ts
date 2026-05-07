import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, axeFailureMessage(results.violations)).toEqual([]);
}

function axeFailureMessage(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]
) {
  if (violations.length === 0) return "no violations";
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`)
    .join("\n");
}
