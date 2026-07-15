// Shared per-page parity assertions used by both build.test.mjs (dist HTML)
// and live.test.mjs (HTTP). Runs as node:test subtests so the failure list is
// readable per page per check.
import assert from "node:assert/strict";
import {
  extractCanonical,
  extractDescription,
  extractH1s,
  extractLang,
  extractLdJsonScripts,
  extractRobots,
  extractTitle,
  normalizeWs,
  visibleText,
} from "./html.mjs";
import { resolveJsonldExpectation } from "./jsonld.mjs";

/**
 * @param t        node:test context (subtests are created on it)
 * @param html     full page HTML
 * @param path     route path, e.g. "/about/"
 * @param entry    fixture.pages[path]
 * @param origin   expected canonical/schema origin (replaces "{origin}")
 * @param fixture  full fixture (for forbidden substrings / text bans)
 */
export async function runPageAssertions(t, { html, path, entry, origin, fixture }) {
  await t.test(`${path} title`, () => {
    assert.equal(normalizeWs(extractTitle(html) ?? ""), normalizeWs(entry.title));
  });

  await t.test(`${path} description`, () => {
    assert.equal(
      normalizeWs(extractDescription(html) ?? ""),
      normalizeWs(entry.description),
    );
  });

  await t.test(`${path} robots`, () => {
    assert.equal(normalizeWs(extractRobots(html) ?? ""), normalizeWs(entry.robots));
  });

  await t.test(`${path} lang`, () => {
    assert.equal(extractLang(html), entry.lang);
  });

  await t.test(`${path} canonical`, () => {
    assert.equal(extractCanonical(html), origin + entry.canonical_path);
  });

  await t.test(`${path} exactly one matching h1`, () => {
    const h1s = extractH1s(html);
    assert.equal(h1s.length, 1, `expected exactly 1 h1, found ${h1s.length}`);
    assert.equal(h1s[0], normalizeWs(entry.h1));
  });

  const scripts = extractLdJsonScripts(html);

  await t.test(`${path} every JSON-LD script parses`, () => {
    const broken = scripts.filter((s) => s.parseError);
    assert.equal(
      broken.length,
      0,
      `unparseable ld+json: ${broken.map((s) => s.parseError).join("; ")}`,
    );
  });

  for (const [field, spec] of Object.entries(entry.jsonld)) {
    await t.test(`${path} JSON-LD ${field} (@type ${spec.script_type})`, () => {
      const expected = spec.expected.replaceAll(
        fixture.origin_placeholder,
        origin,
      );
      const result = resolveJsonldExpectation(scripts, {
        ...spec,
        expected,
      });
      if (result.error) assert.fail(result.error);
      assert.equal(result.actual, expected);
    });
  }

  await t.test(`${path} no forbidden hosts in canonical/schema URLs`, () => {
    const haystacks = [extractCanonical(html) ?? "", ...scripts.map((s) => s.raw)];
    for (const bad of fixture.forbidden_url_substrings) {
      const hit = haystacks.find((h) => h.toLowerCase().includes(bad.toLowerCase()));
      assert.equal(
        hit,
        undefined,
        `"${bad}" found in canonical/JSON-LD on ${path}: ${String(hit).slice(0, 200)}`,
      );
    }
  });

  await t.test(`${path} visible text bans (reading-time "read read")`, () => {
    const text = visibleText(html);
    for (const ban of fixture.visible_text_bans) {
      // Case-SENSITIVE: production's duplicated reading-time bug renders a
      // literal lowercase "read read". Case-insensitive matching would
      // false-positive on legitimate "… min read Read article →" sequences
      // where a card's reading time is followed by its CTA link.
      const re = new RegExp(`\\b${ban}\\b`);
      const m = text.match(re);
      assert.equal(
        m,
        null,
        `banned text "${ban}" present on ${path} near: "${text.slice(
          Math.max(0, (m?.index ?? 0) - 60),
          (m?.index ?? 0) + 60,
        )}"`,
      );
    }
  });
}

// Sitemap assertions shared by build (file) and live (HTTP) suites.
export async function runSitemapAssertions(t, { xml, fixture, origin }) {
  const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  const entries = urlBlocks.map((block) => {
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].trim() : null;
    };
    return {
      loc: get("loc"),
      lastmod: get("lastmod"),
      changefreq: get("changefreq"),
      priority: get("priority"),
    };
  });

  const expectedPaths = Object.keys(fixture.pages).sort();
  const actualPaths = entries
    .map((e) => (e.loc ?? "").replace(origin, ""))
    .sort();

  await t.test("sitemap contains exactly the 47 fixture paths, no duplicates", () => {
    assert.equal(
      new Set(actualPaths).size,
      actualPaths.length,
      `duplicate <loc> entries: ${actualPaths.filter((p, i) => actualPaths.indexOf(p) !== i)}`,
    );
    assert.deepEqual(actualPaths, expectedPaths);
  });

  for (const entry of entries) {
    const path = (entry.loc ?? "").replace(origin, "");
    const expected = fixture.pages[path]?.sitemap;
    if (!expected) continue; // covered by the path-set assertion above
    await t.test(`sitemap ${path} lastmod/changefreq/priority`, () => {
      assert.deepEqual(
        {
          changefreq: entry.changefreq,
          lastmod: entry.lastmod,
          priority: entry.priority,
        },
        expected,
      );
    });
  }

  await t.test("sitemap all-same-lastmod guard (>=40 identical dates)", () => {
    const counts = new Map();
    for (const e of entries) {
      counts.set(e.lastmod, (counts.get(e.lastmod) ?? 0) + 1);
    }
    const [worstDate, worstCount] = [...counts.entries()].sort(
      (a, b) => b[1] - a[1],
    )[0] ?? [null, 0];
    assert.ok(
      worstCount < 40,
      `${worstCount} of ${entries.length} sitemap URLs share lastmod ${worstDate} — ` +
        "lastmod generation has almost certainly collapsed to the build date",
    );
  });
}
