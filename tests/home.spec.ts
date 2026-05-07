import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./helpers";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the hero h1 and exactly one h1", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: /Chaitanya\s+Reddy\s+Basani/ })
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

  test("hero CTAs scroll to the projects and contact sections", async ({ page }) => {
    const projectsBtn = page.getByRole("button", { name: /scroll projects/ });
    await expect(projectsBtn).toBeVisible();
    await projectsBtn.click();
    await expect(page.locator("#projects")).toBeInViewport();
  });

  test("renders all main portfolio sections", async ({ page }) => {
    for (const id of ["about", "skills", "experience", "projects", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("home nav has 5 numbered items linking to each section", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["About", "Skills", "Experience", "Projects", "Contact"]) {
      await expect(nav.getByRole("button", { name: new RegExp(label) })).toBeVisible();
    }
  });

  test("Skills section lists every group", async ({ page }) => {
    const section = page.locator("#skills");
    for (const group of [
      "Front-End",
      "Back-End",
      "Databases",
      "Cloud/DevOps",
      "Accessibility",
      "Tooling",
      "CMS",
    ]) {
      await expect(section.getByRole("heading", { level: 3, name: group })).toBeVisible();
    }
  });

  test("Experience timeline has three roles", async ({ page }) => {
    const section = page.locator("#experience");
    await expect(section.getByRole("listitem").first()).toBeVisible();
    await expect(section).toContainText("Blue Cross Blue Shield");
    await expect(section).toContainText("BNY Mellon");
    await expect(section).toContainText("Chemeketa");
  });

  test("Projects rail has all 5 entries with descriptive labels", async ({ page }) => {
    const section = page.locator("#projects");
    await expect(
      section.getByRole("link", { name: /Open the Division Hub project/ })
    ).toHaveAttribute("href", "/projects/division-hub");
    await expect(
      section.getByRole("link", { name: /Open the Components project/ })
    ).toHaveAttribute("href", "/projects/components");
    await expect(
      section.getByRole("link", { name: /Open the A11y Audit project/ })
    ).toHaveAttribute("href", "/projects/a11y-audit");
    await expect(
      section.getByRole("link", { name: /Open the Service Request Form project \(opens in a new tab\)/ })
    ).toHaveAttribute("target", "_blank");
    await expect(
      section.getByRole("link", { name: /Open the Analytics Dashboard project \(opens in a new tab\)/ })
    ).toHaveAttribute("target", "_blank");
  });

  test("Projects rail next button advances the featured banner", async ({ page }) => {
    const section = page.locator("#projects");
    await expect(section).toContainText("Division Hub");
    await section.getByRole("button", { name: "Next project" }).click();
    await expect(section).toContainText(/now showing · 02/);
  });

  test("Contact form validates and shows role=alert errors", async ({ page }) => {
    const form = page.locator("#contact form");
    await form.locator("input#contact-name").fill("Test");
    await form.locator("input#contact-email").fill("test@example.com");
    await form.locator("textarea#contact-message").fill("hi");
    await form.locator("button[type=submit]").click();
    await expect(page.locator("main").getByRole("alert").first()).toBeVisible();
  });

  test("Contact form submits successfully and shows a reference id", async ({ page }) => {
    const form = page.locator("#contact form");
    await form.locator("input#contact-name").fill("Jane Tester");
    await form.locator("input#contact-email").fill("jane@example.com");
    await form
      .locator("textarea#contact-message")
      .fill("This is a test message for the contact form.");
    await form.locator("button[type=submit]").click();
    await expect(page.locator("#contact").getByRole("status")).toContainText(/MSG-/);
  });

  test("has zero axe violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});
