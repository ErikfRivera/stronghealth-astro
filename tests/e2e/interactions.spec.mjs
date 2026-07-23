// Interaction parity checks against the local preview server:
//   - desktop: peptides nav dropdown reveals on hover (CSS-only dropdown)
//   - mobile: drawer opens via the menu button (aria-expanded flips) and
//     closes on Escape
//   - homepage FAQ <details> toggles open/closed by click and keyboard
//   - all sms: CTAs use the production booking number
//   - unknown URLs return a real HTTP 404 (approved correction — production's
//     soft-404 is intentionally not preserved)
import { test, expect } from "@playwright/test";

const BOOKING_SMS_PREFIX = "sms:+17542636026";

test.describe("desktop nav dropdown", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only interaction");

  test("peptides dropdown reveals links on hover", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const trigger = nav.getByRole("button", { name: "Peptides" });

    const hubLink = nav.getByRole("link", { name: /Peptides by Goal/ });
    await expect(hubLink).not.toBeVisible();

    await trigger.hover();
    await expect(hubLink).toBeVisible();
    // A representative peptide goal link is revealed too.
    await expect(
      nav.getByRole("link", { name: "Muscle Growth", exact: true }),
    ).toBeVisible();
    await expect(hubLink).toHaveAttribute("href", "/peptides/");
  });
});

test.describe("mobile drawer", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only interaction");

  test("menu button opens drawer, Escape closes it", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("#mobile-nav-toggle");
    const drawer = page.locator("#mobile-nav-drawer");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(drawer).toHaveAttribute("aria-hidden", "true");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(drawer).toHaveAttribute("aria-hidden", "false");
    // Drawer is actually on screen (not just attribute-visible).
    await expect(drawer).toBeInViewport();
    await expect(
      drawer.getByRole("link", { name: /Book Free Assessment/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
  });
});

test.describe("homepage FAQ accordion", () => {
  test("toggles open/close via click", async ({ page }) => {
    await page.goto("/");
    // Second FAQ item (the first ships open by default).
    const item = page.locator("section details").nth(1);
    const summary = item.locator("summary").first();

    await summary.scrollIntoViewIfNeeded();
    await expect(item).not.toHaveAttribute("open", "");
    await summary.click();
    await expect(item).toHaveAttribute("open", "");
    await summary.click();
    await expect(item).not.toHaveAttribute("open", "");
  });

  test("toggles open/close via keyboard", async ({ page }) => {
    await page.goto("/");
    const item = page.locator("section details").nth(1);
    const summary = item.locator("summary").first();

    await summary.scrollIntoViewIfNeeded();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(item).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(item).not.toHaveAttribute("open", "");
  });
});

test.describe("sms booking CTAs", () => {
  for (const route of ["/", "/fl/miami/dexascan/"]) {
    test(`all sms: hrefs on ${route} use the booking number`, async ({ page }) => {
      await page.goto(route);
      const hrefs = await page.$$eval('a[href^="sms:"]', (as) =>
        as.map((a) => a.getAttribute("href")),
      );
      expect(hrefs.length, `expected sms: CTAs on ${route}`).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(href.startsWith(BOOKING_SMS_PREFIX), `bad sms href: ${href}`).toBe(true);
      }
    });
  }
});

test.describe("unknown route", () => {
  test("returns a real 404 then redirects to /peptides/", async ({ page }) => {
    // The unknown URL is served by dist/404.html with a genuine HTTP 404
    // status (the first navigation response), which then redirects the browser
    // to /peptides/ via meta-refresh + a JS location.replace.
    const response = await page.goto("/zzz-does-not-exist/");
    expect(response.status()).toBe(404);
    await page.waitForURL(/\/peptides\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
