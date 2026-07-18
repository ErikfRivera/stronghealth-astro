// Peptide-repositioning re-baseline (US-011).
//
// The original parity suite compared dist/ byte-for-byte against a frozen
// 2026-07-14 LIVE-production capture. The peptide repositioning intentionally
// changes output sitewide (removed TRT/service pages, retitled hubs, a new
// molecule layer), so "parity vs old production" is no longer the spec and its
// source QA capture is not present in this repo.
//
// This generator re-derives the regression baseline from the CURRENT build:
// it walks dist/ and records, per route, the title / description / robots /
// lang / canonical / h1 / sitemap values plus the site-wide bans and forbidden
// hosts — the same schema tests/parity/lib/page-assertions.mjs consumes. The
// per-field JSON-LD expectations (which encoded production's post-hydration
// DOM order) are intentionally dropped; the suite still asserts that every
// JSON-LD block PARSES and that no forbidden host leaks into canonical/schema.
//
// Re-run after any intentional sitewide change:
//   pnpm build && node scripts/generate-parity-baseline.mjs
//
// Determinism: routes sorted, no timestamps; output depends only on dist/.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractTitle,
  extractDescription,
  extractRobots,
  extractCanonical,
  extractLang,
  extractH1s,
  normalizeWs,
} from "../tests/parity/lib/html.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ORIGIN = process.env.SITE_ORIGIN || "https://www.stronghealth.com";
const OUT_PATH = join(root, "tests/fixtures/build-baseline.json");

function walkRoutes(dir, base = "") {
  const routes = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      routes.push(...walkRoutes(full, `${base}/${name}`));
    } else if (name === "index.html") {
      routes.push(base === "" ? "/" : `${base}/`);
    }
  }
  return routes;
}

function parseSitemap(xml) {
  const map = new Map();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = m[1];
    const get = (tag) => {
      const mm = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
      return mm ? mm[1].trim() : null;
    };
    const loc = (get("loc") ?? "").replace(ORIGIN, "");
    map.set(loc, {
      changefreq: get("changefreq"),
      lastmod: get("lastmod"),
      priority: get("priority"),
    });
  }
  return map;
}

const sitemap = parseSitemap(readFileSync(join(dist, "sitemap.xml"), "utf-8"));
const routes = walkRoutes(dist).filter((r) => r !== "/404/").sort();

const pages = {};
for (const route of routes) {
  const htmlPath =
    route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html");
  const html = readFileSync(htmlPath, "utf-8");
  const h1s = extractH1s(html);
  const canonical = extractCanonical(html) ?? "";
  pages[route] = {
    title: normalizeWs(extractTitle(html) ?? ""),
    description: normalizeWs(extractDescription(html) ?? ""),
    robots: normalizeWs(extractRobots(html) ?? ""),
    lang: extractLang(html),
    canonical_path: canonical.replace(ORIGIN, ""),
    h1: h1s.length === 1 ? h1s[0] : "",
    jsonld: {},
    sitemap: sitemap.get(route) ?? null,
  };
}

const out = {
  _generated_by: "scripts/generate-parity-baseline.mjs",
  _source:
    "self-snapshot of dist/ after the peptide repositioning; regenerate with `pnpm build && node scripts/generate-parity-baseline.mjs`",
  origin_placeholder: "{origin}",
  production_origin: ORIGIN,
  forbidden_url_substrings: ["staging.stronghealth.com", "localhost", "replit"],
  visible_text_bans: ["read read"],
  pages,
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
console.log(
  `generate-parity-baseline: wrote ${Object.keys(pages).length} routes to ${OUT_PATH.replace(root + "/", "")} ✓`,
);
