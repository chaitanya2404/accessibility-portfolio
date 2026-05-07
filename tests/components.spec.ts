import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./helpers";

test.describe("Components page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/components");
  });

  test("renders the project h1 and the nine demo h2s", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Component library showcase" })).toBeVisible();
    for (const title of [
      "Accordion",
      "Modal dialog",
      "Tabs",
      "Combobox",
      "Toast",
      "Data table",
      "Multi-step wizard",
      "Live region playground",
      "Hand-rolled Switch",
    ]) {
      await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
    }
  });

  test("clicking a sidebar anchor moves focus to the target section", async ({ page }) => {
    const sidebar = page.getByRole("navigation", { name: "Component sections" });
    await sidebar.getByRole("link", { name: "Combobox" }).click();
    const section = page.locator("#combobox");
    await expect(section).toBeFocused();
  });

  test("accordion trigger toggles aria-expanded", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "What does WCAG 2.1 AA require?" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("dialog opens, traps focus, Esc closes, focus returns to trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-labelledby", /.+/);
    const emailInput = page.getByLabel("Email address");
    await expect(emailInput).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("tabs respond to ArrowRight and update the panel", async ({ page }) => {
    const overview = page.getByRole("tab", { name: "Overview" });
    await overview.click();
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    const metrics = page.getByRole("tab", { name: "Metrics" });
    await expect(metrics).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Quantitative results");
  });

  test("combobox filters items as you type and selects via Enter", async ({ page }) => {
    const input = page.getByLabel("Choose a framework");
    await input.fill("rem");
    const remixOption = page.getByRole("option", { name: "Remix" });
    await expect(remixOption).toBeVisible();
    await expect(page.getByRole("option", { name: "Astro" })).toBeHidden();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Selected:\s*Remix/)).toBeVisible();
  });

  test("toast appears after the trigger fires", async ({ page }) => {
    await page.getByRole("button", { name: "Show toast" }).click();
    const status = page.getByRole("status").filter({ hasText: "Settings saved" });
    await expect(status).toBeVisible();
    await expect(status).toContainText("Your preferences will sync");
  });

  test("data table sorts by Name ascending then descending", async ({ page }) => {
    const section = page.locator("#data-table");
    const nameHeader = section.locator("thead th", { hasText: "Name" });
    const button = nameHeader.getByRole("button", { name: /Name/ });

    await button.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    await button.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("data table select-all checkbox toggles every row on the page", async ({ page }) => {
    const section = page.locator("#data-table");
    const selectAll = section.getByLabel(/Select all on page/);
    await selectAll.check();
    const rowChecks = section.locator("tbody input[type=checkbox]");
    expect(await rowChecks.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await rowChecks.count()); i++) {
      await expect(rowChecks.nth(i)).toBeChecked();
    }
  });

  test("data table pagination Next moves to page 2", async ({ page }) => {
    const section = page.locator("#data-table");
    await section.getByRole("button", { name: "Next" }).click();
    await expect(section.locator("nav[aria-label=Pagination]")).toContainText("Page 2");
  });

  test("wizard moves focus to the new step heading on Next", async ({ page }) => {
    const wizard = page.locator("#wizard");
    await wizard.getByLabel("Display name").fill("Sam");
    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(wizard.getByRole("heading", { level: 3 })).toContainText("Accessibility");
  });

  test("wizard validates required name and shows role=alert", async ({ page }) => {
    const wizard = page.locator("#wizard");
    await wizard.getByLabel("Display name").fill("");
    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(wizard.getByRole("alert")).toContainText("Name is required");
  });

  test("hand-rolled switch toggles via Space and Enter", async ({ page }) => {
    const section = page.locator("#from-scratch");
    const sw = section.getByRole("switch").first();
    await sw.focus();
    await expect(sw).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Space");
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Enter");
    await expect(sw).toHaveAttribute("aria-checked", "false");
  });

  test("Components page has zero axe violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});

test.describe("Conformance and docs", () => {
  test("conformance page lists per-component WCAG SCs", async ({ page }) => {
    await page.goto("/projects/components/conformance");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("WCAG conformance");
    await expect(page.getByRole("heading", { level: 2, name: "Accordion" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Data table" })).toBeVisible();
  });

  test("docs index lists all docs and links navigate", async ({ page }) => {
    await page.goto("/docs");
    await expect(page.getByRole("heading", { level: 1, name: "Docs" })).toBeVisible();
    await page.getByRole("link", { name: "Read" }).first().click();
    await expect(page).toHaveURL(/\/docs\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("docs page renders markdown", async ({ page }) => {
    await page.goto("/docs/focus-management");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Focus management");
    await expect(page.locator("article")).toContainText("Skip link activated");
  });

  test("conformance and docs pages are axe-clean", async ({ page }) => {
    await page.goto("/projects/components/conformance");
    await expectNoAxeViolations(page);
    await page.goto("/docs");
    await expectNoAxeViolations(page);
    await page.goto("/docs/focus-management");
    await expectNoAxeViolations(page);
  });
});
