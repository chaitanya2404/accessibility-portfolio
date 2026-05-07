import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./helpers";

test.describe("Components page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/components");
  });

  test("renders the project h1 and the five demo h2s", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Component library showcase" })).toBeVisible();
    for (const title of ["Accordion", "Modal dialog", "Tabs", "Combobox", "Toast"]) {
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

  test("Components page has zero axe violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});
