// Smoke checks for all 47 production routes against the local preview server,
// in both desktop and mobile projects: page loads, no horizontal overflow, no
// broken image, no missing alt, zero console errors (narrow 3rd-party
// allowlist below).
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = JSON.parse(
  readFileSync(join(root, "tests/fixtures/production-parity-2026-07-14.json"), "utf-8"),
);
const ROUTES = Object.keys(fixture.pages);

// Third-party console-error allowlist. The production pages intentionally load
// AdSense / Google Ads / Ahrefs analytics / Google Tag Manager /
// LeadConnector; from a localhost preview these endpoints 403 or are blocked
// (the same AdSense 403 exists on live production — see QA report), so their
// failures are environmental noise, not site regressions. Everything else
// (including all first-party errors and page JS exceptions) fails the test.
const THIRD_PARTY_ALLOWLIST = [
  "pagead2.googlesyndication.com",
  "googleads",
  "adsbygoogle",
  "analytics.ahrefs.com",
  "googletagmanager",
  "leadconnectorhq",
];

function isAllowlisted(textOrUrl) {
  const s = (textOrUrl || "").toLowerCase();
  return THIRD_PARTY_ALLOWLIST.some((host) => s.includes(host));
}

for (const route of ROUTES) {
  test(`page ${route}`, async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const location = msg.location()?.url || "";
      if (isAllowlisted(msg.text()) || isAllowlisted(location)) return;
      consoleErrors.push(`${msg.text()} (${location})`);
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

    const response = await page.goto(route, { waitUntil: "load" });
    expect(response.status(), `HTTP status for ${route}`).toBe(200);

    // No horizontal overflow.
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.scrollingElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(
      scrollWidth,
      `horizontal overflow: scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`,
    ).toBeLessThanOrEqual(innerWidth + 1);

    // No failed images (every <img> must have decoded pixels).
    const brokenImages = await page.evaluate(() =>
      [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
    expect(brokenImages, "images that failed to load").toEqual([]);

    // No missing alt on content images (decorative alt="" is acceptable;
    // a missing attribute is not).
    const missingAlt = await page.evaluate(() =>
      [...document.querySelectorAll("img:not([alt])")].map(
        (img) => img.currentSrc || img.src,
      ),
    );
    expect(missingAlt, "images missing an alt attribute").toEqual([]);

    expect(consoleErrors, "non-allowlisted console errors").toEqual([]);
  });
}
