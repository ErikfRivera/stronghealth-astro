// Post-build SEO gate (FR-5). Codifies SEO_NEW_PAGE_CHECKLIST.md: scans every
// built HTML page and FAILS THE BUILD on any of:
//   - final <title> longer than 60 chars (including " | Strong Health")
//   - double "| Strong Health" brand suffix
//   - meta description missing or outside 120–160 chars
//   - missing/malformed canonical (must be https://www.stronghealth.com<path>/
//     matching the file's route)
//   - missing robots meta
//   - broken internal link (href="/..." that resolves to no built file)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE_URL = "https://www.stronghealth.com";
const BRAND = " | Strong Health";
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

if (!existsSync(dist)) {
  console.error("check-seo: dist/ not found — run astro build first.");
  process.exit(1);
}

/** Recursively collect files under dir. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const allFiles = walk(dist);
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

// Set of valid internal URL paths: directories containing index.html (as
// "/dir/"), the root "/", plus every literal file path (assets, txt, xml…).
const validPaths = new Set(["/"]);
for (const f of allFiles) {
  const rel = "/" + relative(dist, f).split("\\").join("/");
  validPaths.add(rel);
  if (rel.endsWith("/index.html")) {
    validPaths.add(rel.slice(0, -"index.html".length));
  }
}

function routeForFile(file) {
  const rel = relative(dist, file).split("\\").join("/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404/"; // canonical policy for the 404 page
  return "/" + rel.replace(/index\.html$/, "");
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extract(html, re) {
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : null;
}

// Production-parity waivers (remediation D5): live production ships these
// exact over-budget strings; the migration must not change SEO copy. The
// budget gates stay in force for every other page.
const PARITY_WAIVERS = {
  "fl/delray-beach/trt-therapy/index.html": {
    titleMax: 64,
    descMax: 167,
    reason: "live production values restored per remediation PRD §10.1",
  },
  "fl/delray-beach/weight-loss-clinic/index.html": {
    descMax: 191,
    reason: "live production values restored per remediation PRD §10.1",
  },
  "fl/delray-beach/peptide-therapy/index.html": {
    descMax: 193,
    reason: "live production values restored per remediation PRD §10.1",
  },
};

const errors = [];

for (const file of htmlFiles) {
  const rel = relative(dist, file);
  const html = readFileSync(file, "utf-8");
  const route = routeForFile(file);
  const is404 = rel === "404.html";

  const title = extract(html, /<title[^>]*>([^<]*)<\/title>/);
  const description = extract(
    html,
    /<meta\s+name="description"\s+content="([^"]*)"/,
  );
  const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/);
  const robots = extract(html, /<meta\s+name="robots"\s+content="([^"]*)"/);

  const waiver = PARITY_WAIVERS[rel] || {};
  if (!title) {
    errors.push(`${rel}: missing <title>`);
  } else {
    if (title.length > (waiver.titleMax ?? TITLE_MAX)) {
      errors.push(`${rel}: title ${title.length} chars (max ${TITLE_MAX}): "${title}"`);
    }
    if (title.split(BRAND).length > 2) {
      errors.push(`${rel}: double brand suffix in title: "${title}"`);
    }
  }

  if (!description) {
    errors.push(`${rel}: missing meta description`);
  } else if (description.length < DESC_MIN || description.length > (waiver.descMax ?? DESC_MAX)) {
    errors.push(
      `${rel}: description ${description.length} chars (must be ${DESC_MIN}–${DESC_MAX})`,
    );
  }

  if (!canonical) {
    errors.push(`${rel}: missing canonical`);
  } else {
    const expected = `${SITE_URL}${route}`;
    if (canonical !== expected) {
      errors.push(`${rel}: canonical "${canonical}" !== expected "${expected}"`);
    }
  }

  if (!robots) {
    errors.push(`${rel}: missing robots meta`);
  } else if (is404 && !robots.startsWith("noindex")) {
    errors.push(`${rel}: 404 page must be noindex (got "${robots}")`);
  }

  // Internal links: every root-relative href must resolve to a built file.
  // The 404 page must never be linked to (checklist §9).
  const hrefRe = /href="(\/[^"]*)"/g;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    let href = m[1];
    if (href.startsWith("//")) continue; // protocol-relative external
    href = href.split("#")[0].split("?")[0];
    if (href === "") continue;
    if (!validPaths.has(href)) {
      errors.push(`${rel}: broken internal link "${m[1]}"`);
    }
    if (href === "/404/" || href === "/404") {
      errors.push(`${rel}: links to the 404 page`);
    }
  }
}

// Sitemap ↔ build consistency (FR-5/FR-8): every built page route must be in
// sitemap.xml (except the 404), and every sitemap URL must exist in the build.
const sitemapPath = join(dist, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  errors.push("sitemap.xml missing from dist/");
} else {
  const xml = readFileSync(sitemapPath, "utf-8");
  const sitemapRoutes = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(SITE_URL, ""),
    ),
  );
  const builtRoutes = new Set(
    htmlFiles
      .filter((f) => !f.endsWith("404.html"))
      .map((f) => routeForFile(f)),
  );
  for (const r of builtRoutes) {
    if (!sitemapRoutes.has(r)) errors.push(`sitemap.xml: missing built route ${r}`);
  }
  for (const r of sitemapRoutes) {
    if (!builtRoutes.has(r)) errors.push(`sitemap.xml: lists non-existent route ${r}`);
  }
}

if (errors.length > 0) {
  console.error(`check-seo: ${errors.length} error(s):\n`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`check-seo: ${htmlFiles.length} page(s) + sitemap clean ✓`);
