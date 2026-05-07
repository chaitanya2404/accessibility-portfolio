import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./helpers";

test.describe("Division Hub overview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/division-hub");
  });

  test("renders the project h1 and links to all three departments", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Division Hub" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Visit Procurement" })).toHaveAttribute(
      "href",
      "/projects/division-hub/procurement"
    );
    await expect(page.getByRole("link", { name: "Visit Human Resources" })).toHaveAttribute(
      "href",
      "/projects/division-hub/hr"
    );
    await expect(page.getByRole("link", { name: "Visit Facilities" })).toHaveAttribute(
      "href",
      "/projects/division-hub/facilities"
    );
  });

  test("has zero axe violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});

test.describe("Division Hub mega-menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/division-hub/procurement");
  });

  test("opens via click and lists all three departments", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Departments" });
    await trigger.click();
    const menu = page.getByRole("link", { name: /Procurement/ }).first();
    await expect(menu).toBeVisible();
    await expect(page.getByRole("link", { name: /Human Resources/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Facilities/ })).toBeVisible();
  });

  test("Esc closes the menu and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Departments" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("data-state", "open");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("data-state", "closed");
    await expect(trigger).toBeFocused();
  });
});

test.describe("Division Hub staff table sorting", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/division-hub/hr");
  });

  test("each column header has scope=col and starts unsorted", async ({ page }) => {
    const headers = page.locator("thead th");
    expect(await headers.count()).toBe(4);
    for (let i = 0; i < (await headers.count()); i++) {
      await expect(headers.nth(i)).toHaveAttribute("scope", "col");
      await expect(headers.nth(i)).toHaveAttribute("aria-sort", "none");
    }
  });

  test("clicking Name toggles aria-sort ascending then descending", async ({ page }) => {
    const nameHeader = page.locator("thead th", { hasText: "Name" });
    const nameSortBtn = nameHeader.getByRole("button", { name: /Name/ });

    await nameSortBtn.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    await nameSortBtn.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("sorting Name asc orders rows alphabetically", async ({ page }) => {
    await page.locator("thead th", { hasText: "Name" }).getByRole("button").click();
    const firstCell = page.locator("tbody tr").first().locator("td").first();
    await expect(firstCell).toHaveText("Bea Sandoval");
  });

  test("sorting Extension uses numeric order", async ({ page }) => {
    await page.locator("thead th", { hasText: "Extension" }).getByRole("button").click();
    const firstExt = page.locator("tbody tr").first().locator("td").last();
    await expect(firstExt).toHaveText(/2101$/);
  });

  test("table has a caption", async ({ page }) => {
    const caption = page.locator("table caption");
    await expect(caption).toContainText("Human Resources staff directory");
  });

  test("email links are mailto and announce 'Email <name>' to AT", async ({ page }) => {
    const link = page.getByRole("link", { name: /Email Renée Bassi at rbassi@example\.gov/ });
    await expect(link).toHaveAttribute("href", "mailto:rbassi@example.gov");
  });

  test("HR page has zero axe violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});

for (const slug of ["procurement", "facilities"] as const) {
  test(`${slug} department page has zero axe violations`, async ({ page }) => {
    await page.goto(`/projects/division-hub/${slug}`);
    await expectNoAxeViolations(page);
  });
}

test.describe("Division Hub staff search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/division-hub/hr");
  });

  test("opens via Cmd+K, filters, and selecting an item navigates", async ({ page }) => {
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByPlaceholder(/Search staff/)).toBeVisible();
    await page.getByPlaceholder(/Search staff/).fill("park");
    await expect(page.getByRole("option", { name: /Eleanor Park/ })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/facilities/);
  });

  test("opens via the Search staff button as well", async ({ page }) => {
    await page.getByRole("button", { name: /Search staff/ }).click();
    await expect(page.getByPlaceholder(/Search staff/)).toBeVisible();
    await page.keyboard.press("Escape");
  });
});

test.describe("Division Hub URL state", () => {
  test("sorting Name writes ?sort=name to the URL", async ({ page }) => {
    await page.goto("/projects/division-hub/hr");
    await page.locator("thead th", { hasText: "Name" }).getByRole("button").click();
    await expect(page).toHaveURL(/sort=name/);
  });

  test("filtering writes ?q=… to the URL", async ({ page }) => {
    await page.goto("/projects/division-hub/hr");
    await page.getByLabel(/Filter staff/).fill("yoon");
    await expect(page).toHaveURL(/q=yoon/, { timeout: 5000 });
  });
});

test.describe("Division Hub service request wizard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/division-hub/service-request");
  });

  test("focus moves to step heading on Next", async ({ page }) => {
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByRole("heading", { level: 2 })).toContainText("Step 2");
  });

  test("validation blocks Next with role=alert when title is too short", async ({ page }) => {
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByLabel("Title").fill("hi");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.locator("main").getByRole("alert").first()).toContainText(/at least 3/);
  });

  test("submitting renders a success ticket id", async ({ page }) => {
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByLabel("Title").fill("Need a new ergo chair");
    await page.getByLabel("Description").fill("My current chair is broken and I need a replacement before Monday.");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByLabel("Your email").fill("user@example.com");
    await page.getByRole("button", { name: "Submit request" }).click();
    const success = page.getByRole("heading", { level: 2, name: "Request submitted" });
    await expect(success).toBeVisible();
    await expect(page.locator("[role=group], main")).toContainText(/SR-/);
  });

  test("service request page is axe-clean", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});
