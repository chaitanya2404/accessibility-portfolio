import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./helpers";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the hero h1 and exactly one h1", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Accessibility-first frontend, five projects deep.",
      })
    ).toBeVisible();
    expect(await page.locator("h1").count()).toBe(1);
  });

  test("declares lang=\"en\" on the html element", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("exposes a skip link as the first focusable element", async ({ page }) => {
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveText("Skip to main content");
    await expect(focused).toHaveAttribute("href", "#main-content");
  });

  test("links to all three projects with descriptive labels", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Open the Division Hub project/ })
    ).toHaveAttribute("href", "/projects/division-hub");
    await expect(
      page.getByRole("link", { name: /Open the Components project/ })
    ).toHaveAttribute("href", "/projects/components");
    await expect(
      page.getByRole("link", { name: /Open the A11y Audit project/ })
    ).toHaveAttribute("href", "/projects/a11y-audit");
  });

  test("has zero axe violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});
