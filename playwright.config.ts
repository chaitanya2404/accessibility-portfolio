import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // In CI serve the production build: `next dev` compiles each route lazily on
    // first request, and a cold compile on a 2-4 vCPU runner can outlast the
    // 30s per-test timeout (webServer.timeout only covers the port opening).
    command: process.env.CI
      ? `npm run build && npm run start -- --port ${PORT}`
      : `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // The CI command includes a full `next build`, so allow for it.
    timeout: process.env.CI ? 300_000 : 120_000,
    reuseExistingServer: !process.env.CI,
    env: { PLAYWRIGHT: "1" },
    stdout: "pipe",
    stderr: "pipe",
  },
});
