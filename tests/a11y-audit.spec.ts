import { expect, test } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { AddressInfo } from "node:net";
import { expectNoAxeViolations } from "./helpers";

function cleanShell(body: string, navLinks: string[] = ["/about"]): string {
  const links = navLinks.map((h) => `<a href="${h}">Page ${h}</a>`).join(" ");
  return `<!doctype html>
<html lang="en">
  <head>
    <title>Fixture</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <header><nav>${links}</nav></header>
    <main>
      <h1>Fixture page</h1>
      ${body}
    </main>
    <footer><p>Footer</p></footer>
  </body>
</html>`;
}

const FIXTURES: Record<string, { contentType?: string; body: string }> = {
  "/clean": {
    body: cleanShell(
      `<img src="/cat.png" alt="A cat" />
       <form><label for="email">Email</label><input id="email" type="email" /></form>`
    ),
  },
  "/missing-lang": {
    body: `<!doctype html>
<html>
  <head><title>Missing lang</title></head>
  <body><main><h1>Hi</h1></main></body>
</html>`,
  },
  "/empty-title": {
    body: `<!doctype html>
<html lang="en">
  <head><title></title></head>
  <body><main><h1>Hi</h1></main></body>
</html>`,
  },
  "/missing-alt-and-labels": {
    body: cleanShell(
      `<img src="/a.png" />
       <img src="/b.png" alt="" />
       <img src="/c.png" />
       <form>
         <label for="x">Has label</label>
         <input type="text" id="x" />
         <input type="text" name="orphan" />
         <input type="hidden" name="csrf" value="abc" />
         <input type="submit" value="Go" />
       </form>`
    ),
  },
  "/crawl/index": {
    body: cleanShell("<p>entry</p>", ["/crawl/page-a", "/crawl/page-b"]),
  },
  "/crawl/page-a": {
    body: cleanShell("<p>page a</p>", ["/crawl/index"]),
  },
  "/crawl/page-b": {
    body: cleanShell("<p>page b</p>", ["/crawl/index"]),
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
    await expect(aside).toContainText("Static-HTML audits only");
    await expect(aside.getByRole("link", { name: /axe DevTools/ })).toHaveAttribute(
      "href",
      "https://www.deque.com/axe/devtools/"
    );
  });

  test("URL input has a visible label", async ({ page }) => {
    await expect(page.getByLabel("URL to audit")).toBeVisible();
  });

  test("audits a clean fixture and every check passes", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: "Run audit" }).click();

    const status = page.locator("main").getByRole("status");
    await expect(status).toContainText("Audit complete");

    await expect(page.locator("table caption")).toContainText(`${baseUrl}/clean`);

    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(12);
    const passBadges = page.locator("tbody td").getByText("Pass", { exact: true });
    await expect(passBadges).toHaveCount(12);
    await expect(page.locator("table caption")).toContainText("Score 100/100");
  });

  test("renders WCAG criterion and severity columns", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: "Run audit" }).click();
    await expect(page.locator("main").getByRole("status")).toContainText("Audit complete");

    await expect(page.locator("thead")).toContainText("WCAG");
    await expect(page.locator("thead")).toContainText("Severity");
    const langRow = page.locator("tbody tr", { hasText: "<html lang> attribute" });
    await expect(langRow).toContainText("3.1.1 Language of Page");
  });

  test("download report triggers a JSON download with the audit URL host", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: "Run audit" }).click();
    await expect(page.locator("main").getByRole("status")).toContainText("Audit complete");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /Download report/ }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^audit-127\.0\.0\.1.*\.json$/);
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
    await expect(page.locator("main").getByRole("status")).toContainText("Audit complete");
  });

  test("page has zero axe violations on initial load", async ({ page }) => {
    await expectNoAxeViolations(page);
  });

  test("page has zero axe violations after a successful run", async ({ page }) => {
    await page.getByLabel("URL to audit").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: "Run audit" }).click();
    await expect(page.locator("main").getByRole("status")).toContainText("Audit complete");
    await expectNoAxeViolations(page);
  });
});

test.describe("A11y audit compare mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/a11y-audit");
    await page.getByRole("tab", { name: "Compare" }).click();
  });

  test("renders side-by-side diff with summary stats", async ({ page }) => {
    await page.getByLabel("Before URL").fill(`${baseUrl}/missing-lang`);
    await page.getByLabel("After URL").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: /Compare/, exact: true }).click();
    await expect(page.locator("main").getByRole("status")).toContainText(/Improved/);
    await expect(page.locator("table caption")).toContainText("→");
    await expect(page.locator("tbody tr").first()).toBeVisible();
  });

  test("compare mode is axe-clean after results", async ({ page }) => {
    await page.getByLabel("Before URL").fill(`${baseUrl}/clean`);
    await page.getByLabel("After URL").fill(`${baseUrl}/clean`);
    await page.getByRole("button", { name: /Compare/, exact: true }).click();
    await expect(page.locator("main").getByRole("status")).toContainText(/Unchanged/);
    await expectNoAxeViolations(page);
  });
});

test.describe("A11y audit about page", () => {
  test("renders the about/honesty content with comparison table", async ({ page }) => {
    await page.goto("/projects/a11y-audit/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("About this audit tool");
    await expect(page.locator("main")).toContainText("What this tool cannot detect");
    await expect(page.locator("table caption")).toContainText("vs. industry tools");
    await expectNoAxeViolations(page);
  });
});

test.describe("A11y audit crawl mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/a11y-audit");
    await page.getByRole("tab", { name: "Crawl site" }).click();
  });

  test("streams page-complete events and renders 3 pages", async ({ page }) => {
    await page.getByLabel(/Entry URL/).fill(`${baseUrl}/crawl/index`);
    await page.getByRole("button", { name: "Start crawl" }).click();

    await expect(page.locator("main")).toContainText("Crawl complete", { timeout: 15_000 });
    const captions = page.locator("table caption");
    await expect(captions).toHaveCount(3);
    await expect(captions.first()).toContainText("/crawl/index");
    const progressLabel = page.locator("label", { hasText: "Crawl complete" });
    await expect(progressLabel).toBeVisible();
  });

  test("crawl export downloads JSON of all pages", async ({ page }) => {
    await page.getByLabel(/Entry URL/).fill(`${baseUrl}/crawl/index`);
    await page.getByRole("button", { name: "Start crawl" }).click();
    await expect(page.locator("main")).toContainText("Crawl complete", { timeout: 15_000 });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /Download report/ }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^audit-127\.0\.0\.1.*\.json$/);
  });

  test("crawl mode is axe-clean once results are visible", async ({ page }) => {
    await page.getByLabel(/Entry URL/).fill(`${baseUrl}/crawl/index`);
    await page.getByRole("button", { name: "Start crawl" }).click();
    await expect(page.locator("main")).toContainText("Crawl complete", { timeout: 15_000 });
    await expectNoAxeViolations(page);
  });
});
