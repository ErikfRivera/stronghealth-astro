// Smoke checks for all 48 fixture routes (47 production + the post-cutover
// NYC page) against the local preview server,
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

// Third-party console-error allowlist (Phase 9, tightened from substring
// matching to exact resource-load failures from exact hosts). The pages
// intentionally load AdSense / GA4 / Ahrefs analytics / LeadConnector; the
// only console *error* those produce is the AdSense ad request 403 from
// googleads.g.doubleclick.net — the identical 403 exists on live production
// with the same publisher ID (D8: inherited, excluded narrowly). The other
// hosts are listed because from CI/localhost their fetches can be blocked
// entirely, which Chromium also reports as "Failed to load resource".
//
// Scope of the exclusion: ONLY messages of the form "Failed to load
// resource: …" whose source URL's hostname is an exact entry below. Script
// runtime errors, page JS exceptions, and anything first-party always fail.
const THIRD_PARTY_RESOURCE_HOSTS = new Set([
  "googleads.g.doubleclick.net", // AdSense ad request — 403 shared with prod
  "pagead2.googlesyndication.com", // AdSense loader + ping
  "ep1.adtrafficquality.google", // AdSense bot-quality subresources
  "ep2.adtrafficquality.google",
  "www.googletagmanager.com", // GA4
  "www.google-analytics.com",
  "analytics.google.com",
  "analytics.ahrefs.com",
  "widgets.leadconnectorhq.com", // chat widget
]);

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function isAllowlistedResourceError(msg) {
  if (!msg.text().startsWith("Failed to load resource")) return false;
  const location = msg.location()?.url || "";
  return THIRD_PARTY_RESOURCE_HOSTS.has(hostOf(location));
}

// Production served a "request credentials mode does not match" warning for
// its CSS preload on every page; the migration must NOT reproduce it (fonts
// preload with crossorigin, the stylesheet link carries no credentials-mode
// mismatch). Guard it explicitly.
const PRELOAD_CREDENTIALS_RE = /preload.*credentials mode does not match/i;

for (const route of ROUTES) {
  test(`page ${route}`, async ({ page }) => {
    const consoleErrors = [];
    const preloadWarnings = [];
    page.on("console", (msg) => {
      if (msg.type() === "warning" && PRELOAD_CREDENTIALS_RE.test(msg.text())) {
        preloadWarnings.push(msg.text());
        return;
      }
      if (msg.type() !== "error") return;
      if (isAllowlistedResourceError(msg)) return;
      consoleErrors.push(`${msg.text()} (${msg.location()?.url || ""})`);
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
    expect(
      preloadWarnings,
      "preload credentials-mode warnings (production regression we must not reproduce)",
    ).toEqual([]);
  });
}
