// Playwright config for the Phase 1 parity harness (tests/e2e/).
//
// Two projects: desktop (1440x1000) and mobile (375x812), both chromium,
// deviceScaleFactor 1, en-US, America/New_York, light, reduced motion — so
// screenshots are stable across machines.
//
// Screenshot tests are tagged @visual:
//   pnpm run test:e2e     → everything except @visual (what CI runs)
//   pnpm run test:visual  → only @visual (local / nightly)
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  expect: {
    // Visual comparisons: allow 0.25% differing pixels (font rasterization).
    toHaveScreenshot: { maxDiffPixelRatio: 0.0025, animations: "disabled" },
  },
  use: {
    baseURL: "http://localhost:4322",
    locale: "en-US",
    timezoneId: "America/New_York",
    colorScheme: "light",
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  // Serves the already-built dist/ — run `pnpm build` before the e2e suites.
  webServer: {
    command: "pnpm exec astro preview --port 4322",
    url: "http://localhost:4322",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
