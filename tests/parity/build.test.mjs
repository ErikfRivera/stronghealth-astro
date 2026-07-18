// Phase 1 parity regression suite — static build (dist/) vs the production
// fixture captured 2026-07-14. Run with:
//
//   pnpm build && pnpm run test:parity:build
//
// SITE_ORIGIN (default https://www.stronghealth.com) is the origin expected
// in canonical URLs and JSON-LD; "{origin}" placeholders in the fixture are
// substituted with it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  runPageAssertions,
  runSitemapAssertions,
} from "./lib/page-assertions.mjs";
import {
  extractRobots,
  extractRootRelativeHrefs,
  visibleText,
} from "./lib/html.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dist = join(root, "dist");
const ORIGIN = process.env.SITE_ORIGIN || "https://www.stronghealth.com";

// Re-baselined 2026-07-18 by the peptide repositioning (US-011): the suite now
// regresses against a self-snapshot of the current build
// (tests/fixtures/build-baseline.json, regenerated via
// `scripts/generate-parity-baseline.mjs`), not the retired frozen 2026-07-14
// production capture — that byte-parity spec no longer applies once the site
// was intentionally rethemed. See CHANGES-FROM-PRODUCTION.md.
const fixture = JSON.parse(
  readFileSync(join(root, "tests/fixtures/build-baseline.json"), "utf-8"),
);

function distHtmlPath(path) {
  return path === "/"
    ? join(dist, "index.html")
    : join(dist, path.replace(/^\//, "").replace(/\/$/, ""), "index.html");
}

test("dist exists (run `pnpm build` first)", () => {
  assert.ok(existsSync(dist), `missing ${dist}`);
});

// ---------------------------------------------------------------------------
// Per-page parity vs production fixture.
// ---------------------------------------------------------------------------
for (const [path, entry] of Object.entries(fixture.pages)) {
  test(`page ${path}`, async (t) => {
    const file = distHtmlPath(path);
    assert.ok(existsSync(file), `not built: ${file}`);
    const html = readFileSync(file, "utf-8");
    await runPageAssertions(t, { html, path, entry, origin: ORIGIN, fixture });
  });
}

// ---------------------------------------------------------------------------
// 404 page — the build must ship dist/404.html (Vercel serves it with a real
// HTTP 404 for any unmatched URL). Per request, that page redirects every
// unknown URL to /peptides/: the response keeps its honest 404 status for
// crawlers while browsers are bounced client-side to the Peptide Therapy hub.
// ---------------------------------------------------------------------------
test("404 page redirects to /peptides/", async (t) => {
  const file = join(dist, "404.html");
  assert.ok(existsSync(file), "dist/404.html missing");
  const html = readFileSync(file, "utf-8");

  await t.test("meta-refreshes to /peptides/", () => {
    assert.match(
      html,
      /<meta[^>]+http-equiv="refresh"[^>]+content="0;\s*url=\/peptides\/"/i,
    );
  });
  await t.test("scripts a client redirect to /peptides/", () => {
    assert.match(html, /location\.replace\(\s*["']\/peptides\/["']\s*\)/);
  });
  await t.test("keeps a no-JS fallback link to /peptides/", () => {
    assert.match(html, /href="\/peptides\/"/);
  });
  await t.test("is noindex", () => {
    assert.match(extractRobots(html) ?? "", /noindex/);
  });
  await t.test("visible text bans apply to 404 too", () => {
    for (const ban of fixture.visible_text_bans) {
      // Case-sensitive — see page-assertions.mjs.
      assert.doesNotMatch(visibleText(html), new RegExp(`\\b${ban}\\b`));
    }
  });
});

// ---------------------------------------------------------------------------
// Sitemap.
// ---------------------------------------------------------------------------
test("sitemap.xml", async (t) => {
  const file = join(dist, "sitemap.xml");
  assert.ok(existsSync(file), "dist/sitemap.xml missing");
  const xml = readFileSync(file, "utf-8");
  await runSitemapAssertions(t, { xml, fixture, origin: ORIGIN });
});

// ---------------------------------------------------------------------------
// Internal link integrity: every root-relative href in every built HTML file
// must resolve to a file in dist (route index.html or a static asset).
// ---------------------------------------------------------------------------
test("every root-relative href resolves to a dist file", () => {
  const htmlFiles = [
    join(dist, "404.html"),
    ...Object.keys(fixture.pages).map(distHtmlPath),
  ];
  const broken = [];
  for (const file of htmlFiles) {
    if (!existsSync(file)) continue; // reported by the per-page tests
    const html = readFileSync(file, "utf-8");
    for (const href of extractRootRelativeHrefs(html)) {
      const rel = href.replace(/^\//, "");
      const candidates = href.endsWith("/")
        ? [join(dist, rel, "index.html")]
        : [join(dist, rel), join(dist, rel, "index.html"), join(dist, `${rel}.html`)];
      if (!candidates.some((c) => existsSync(c))) {
        broken.push(`${file.replace(dist, "")} -> ${href}`);
      }
    }
  }
  assert.deepEqual(broken, [], `broken internal hrefs:\n${broken.join("\n")}`);
});
