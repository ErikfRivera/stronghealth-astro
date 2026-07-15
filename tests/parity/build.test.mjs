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
  extractH1s,
  extractRobots,
  extractRootRelativeHrefs,
  visibleText,
} from "./lib/html.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dist = join(root, "dist");
const ORIGIN = process.env.SITE_ORIGIN || "https://www.stronghealth.com";

const fixture = JSON.parse(
  readFileSync(join(root, "tests/fixtures/production-parity-2026-07-14.json"), "utf-8"),
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
// 404 page — approved correction "unknown-route-real-404": the build must
// ship a real 404 page (Vercel serves dist/404.html with HTTP 404).
// ---------------------------------------------------------------------------
test("404 page", async (t) => {
  const file = join(dist, "404.html");
  assert.ok(existsSync(file), "dist/404.html missing");
  const html = readFileSync(file, "utf-8");

  await t.test("shows 'Page not found'", () => {
    assert.match(visibleText(html), /Page not found/);
  });
  await t.test("is noindex", () => {
    assert.match(extractRobots(html) ?? "", /noindex/);
  });
  await t.test("has exactly one h1", () => {
    assert.equal(extractH1s(html).length, 1);
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
