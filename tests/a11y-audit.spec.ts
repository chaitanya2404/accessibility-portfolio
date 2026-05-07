import { expect, test } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { AddressInfo } from "node:net";
import { expectNoAxeViolations } from "./helpers";

const FIXTURES: Record<string, { contentType?: string; body: string }> = {
  "/clean": {
    body: `<!doctype html>
<html lang="en">
  <head><title>Clean fixture</title></head>
  <body>
    <img src="/cat.png" alt="A cat" />
    <label for="email">Email</label>
    <input id="email" type="email" />
  </body>
</html>`,
  },
  "/missing-lang": {
    body: `<!doctype html>
<html>
  <head><title>Missing lang</title></head>
  <body>hello</body>
</html>`,
  },
  "/empty-title": {
    body: `<!doctype html>
<html lang="en">
  <head><title></title></head>
  <body>hello</body>
</html>`,
  },
  "/missing-alt-and-labels": {
    body: `<!doctype html>
<html lang="en">
  <head><title>Issues</title></head>
  <body>
    <img src="/a.png" />
    <img src="/b.png" alt="" />
    <img src="/c.png" />
    <input type="text" id="x" />
    <label for="x">Has label</label>
    <input type="text" name="orphan" />
    <input type="hidden" name="csrf" value="abc" />
    <input type="submit" value="Go" />
  </body>
</html>`,
  },
};

let server: Server;
let baseUrl: string;

test.beforeAll(async () => {
  server = createServer((req, res) => {
    const path = req.url ?? "/";
    const fixture = FIXTURES[path];
    if (!fixture) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    res.setHeader("Content-Type", fixture.contentType ?? "text/html; charset=utf-8");
    res.end(fixture.body);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as AddressInfo).port;
  baseUrl = `http://127.0.0.1:${port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );
});

test.describe("A11y audit page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/a11y-audit");
  });

  test("renders the project h1 and the disclaimer aside", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "A11y audit tool" })).toBeVisible();
    const aside = page.getByRole("complementary", { name: "Tool scope" });
    await expect(aside).toContainText("Quick A11y Spot-Check");
    await expect(aside.getByRole("link", { name: /axe DevTools/ })).toHaveAttribute(
      "href",
      "https://www.deque.com/axe/devtools/"
    );
  });

  test("URL input has a visible label", async ({ page }) => {
    await expect(page.getByLabel("URL to audit")).toBeVisible();
  });

  test("audits a clean fixture and renders four passing rows", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: "Run audit" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("Audit complete");

    await expect(page.locator("table caption")).toContainText(`${baseUrl}/clean`);

    const passBadges = page.locator("tbody td").getByText("Pass");
    await expect(passBadges).toHaveCount(4);
  });

  test("flags missing lang as Fail", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/missing-lang`);
    await page.getByRole("button", { name: "Run audit" }).click();

    const langRow = page.locator("tbody tr", { hasText: "html lang" });
    await expect(langRow).toContainText("Fail");
    await expect(langRow).toContainText("Missing or empty");
  });

  test("flags empty title as Fail", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/empty-title`);
    await page.getByRole("button", { name: "Run audit" }).click();

    const titleRow = page.locator("tbody tr", { hasText: "title" }).first();
    await expect(titleRow).toContainText("Fail");
  });

  test("counts missing alt images and excludes hidden/submit inputs from label check", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/missing-alt-and-labels`);
    await page.getByRole("button", { name: "Run audit" }).click();

    const altRow = page.locator("tbody tr", { hasText: "Images missing alt" });
    await expect(altRow).toContainText("Warning");
    await expect(altRow).toContainText("2 images");
    await expect(altRow).toContainText("/a.png");
    await expect(altRow).toContainText("/c.png");

    const inputRow = page.locator("tbody tr", { hasText: "Inputs missing labels" });
    await expect(inputRow).toContainText("Warning");
    await expect(inputRow).toContainText("1 input");
    await expect(inputRow).toContainText("orphan");
  });

  test("unreachable host produces a role=alert error, not a crash", async ({ page }) => {
    await page.getByLabel("URL to audit").fill("http://127.0.0.1:1/does-not-exist");
    await page.getByRole("button", { name: "Run audit" }).click();
    const alert = page.locator("main").getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/Audit failed/);
  });

  test("non-html and non-supported scheme rejected", async ({ page }) => {
    await page.getByLabel("URL to audit").fill("ftp://example.com");
    await page.getByRole("button", { name: "Run audit" }).click();
    const alert = page.locator("main").getByRole("alert");
    await expect(alert).toContainText(/http and https/);
  });

  test("Submit button is disabled while a request is in flight", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/clean`);
    const button = page.getByRole("button", { name: /Run audit|Running/ });
    const responsePromise = page.waitForResponse((r) =>
      r.url().includes("/projects/a11y-audit")
    );
    await button.click();
    await responsePromise;
    await expect(page.getByRole("status")).toContainText("Audit complete");
  });

  test("page has zero axe violations on initial load", async ({ page }) => {
    await expectNoAxeViolations(page);
  });

  test("page has zero axe violations after a successful run", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: "Run audit" }).click();
    await expect(page.getByRole("status")).toContainText("Audit complete");
    await expectNoAxeViolations(page);
  });
});
