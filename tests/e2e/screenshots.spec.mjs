// @visual — full-page screenshot baselines.
//
// Desktop project: all 47 production routes. Mobile project: 8 representative
// routes. Baselines live in tests/e2e/screenshots.spec.mjs-snapshots/ and are
// committed; run `pnpm run test:visual -- --update-snapshots` after an
// intentional visual change.
//
// NOTE: the initial baselines were generated during Phase 1 harness bring-up
// while other remediation lanes were still landing — expect them to churn
// once those lanes merge; regenerate then.
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = JSON.parse(
  readFileSync(join(root, "tests/fixtures/production-parity-2026-07-14.json"), "utf-8"),
);

const ALL_ROUTES = Object.keys(fixture.pages);
const MOBILE_ROUTES = [
  "/",
  "/blog/",
  "/peptides-for-healing/",
  "/reviews/",
  "/reviews/andro-400/",
  "/fl/miami/trt-therapy/",
  "/privacy-policy/",
  "/fl/",
];

function snapshotName(route) {
  return `${route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "--")}.png`;
}

async function settle(page, route) {
  await page.goto(route, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}

test.describe("desktop screenshots @visual", () => {
  test.skip(({ isMobile }) => isMobile, "desktop baselines");
  for (const route of ALL_ROUTES) {
    test(`desktop ${route} @visual`, async ({ page }) => {
      await settle(page, route);
      await expect(page).toHaveScreenshot(snapshotName(route), {
        fullPage: true,
        maxDiffPixelRatio: 0.0025,
      });
    });
  }
});

test.describe("mobile screenshots @visual", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile baselines");
  for (const route of MOBILE_ROUTES) {
    test(`mobile ${route} @visual`, async ({ page }) => {
      await settle(page, route);
      await expect(page).toHaveScreenshot(snapshotName(route), {
        fullPage: true,
        maxDiffPixelRatio: 0.0025,
      });
    });
  }
});
