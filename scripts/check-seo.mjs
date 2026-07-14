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

// TEMPORARY migration scaffolding: the 46 canonical routes that WILL exist
// once US-004..US-010 are complete. Internal links to a not-yet-built member
// of this list only warn; once every page is migrated this set is deleted and
// all broken links hard-fail. (Deletion enforced in US-011.)
const PENDING_ROUTES = new Set([
  "/", "/blog/", "/services/", "/about/", "/careers/", "/dexa-scan/",
  "/author/dr-angel-rivera/", "/author/mahadev-mukherjee/",
  "/editorial-guidelines/", "/privacy-policy/", "/hipaa-policy/", "/terms-of-use/",
  "/porn-induced-erectile-dysfunction/", "/baking-soda-for-ed/",
  "/garlic-and-honey-for-erectile-dysfunction/", "/home-remedies-for-premature-ejaculation/",
  "/premature-ejaculation-exercises/",
  "/lysine-benefit-men-health/", "/nac-benefits-men/", "/nadh-benefits/",
  "/resveratrol-side-effects/", "/foods-that-lower-testosterone/",
  "/peptides/", "/peptides-for-healing/", "/peptides-for-tendon-repair/",
  "/peptides-for-libido/", "/peptides-for-sleep/", "/peptides-for-belly-fat/",
  "/peptides-for-muscle-growth/", "/peptides-for-arthritis/", "/collagen-peptides/",
  "/semaglutide-diet/", "/stillman-diet/",
  "/reviews/", "/reviews/low-t-center/", "/reviews/andro-400/",
  "/reviews/nugenix-ultimate-testosterone/", "/reviews/elysium-basis-review/", "/reviews/revita/",
  "/fl/", "/fl/miami/trt-therapy/", "/fl/miami/weight-loss-clinic/",
  "/fl/miami/peptide-therapy/", "/fl/miami/dexascan/",
  "/fl/delray-beach/trt-therapy/", "/fl/delray-beach/weight-loss-clinic/",
  "/fl/delray-beach/peptide-therapy/",
]);

const errors = [];
const warnings = [];

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

  if (!title) {
    errors.push(`${rel}: missing <title>`);
  } else {
    if (title.length > TITLE_MAX) {
      errors.push(`${rel}: title ${title.length} chars (max ${TITLE_MAX}): "${title}"`);
    }
    if (title.split(BRAND).length > 2) {
      errors.push(`${rel}: double brand suffix in title: "${title}"`);
    }
  }

  if (!description) {
    errors.push(`${rel}: missing meta description`);
  } else if (description.length < DESC_MIN || description.length > DESC_MAX) {
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
      if (PENDING_ROUTES.has(href)) {
        warnings.push(`${rel}: link to not-yet-migrated route "${m[1]}"`);
      } else {
        errors.push(`${rel}: broken internal link "${m[1]}"`);
      }
    }
    if (href === "/404/" || href === "/404") {
      errors.push(`${rel}: links to the 404 page`);
    }
  }
}

if (warnings.length > 0) {
  const shown = warnings.slice(0, 8);
  console.warn(`check-seo: ${warnings.length} pending-route link(s) (migration in progress):`);
  for (const w of shown) console.warn("  ⚠ " + w);
  if (warnings.length > shown.length) console.warn(`  … and ${warnings.length - shown.length} more`);
}

if (errors.length > 0) {
  console.error(`check-seo: ${errors.length} error(s):\n`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`check-seo: ${htmlFiles.length} page(s) clean ✓`);
