// US-011: sitemap.xml generation with per-route <lastmod>/<priority>/<changefreq>
// parity with the old scripts/prerender.mjs. Runs postbuild (before check-seo).
//
// Route list = every index.html in dist/ (the build IS the route list, so the
// sitemap can never drift from what was published). 404.html is excluded.
//
// <lastmod> resolution per route (same chain as production):
//   1. the max JSON-LD "dateModified" rendered in the page HTML;
//   2. else the latest git commit date across the route's contributing source
//      files (page file + content fragments + shared data);
//   3. else the build date.
// Hubs (/blog/, /reviews/, /peptides/, /fl/) additionally take the max of the
// child routes they visibly list.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE_URL = "https://www.stronghealth.com";
const BUILD_DATE_YMD = new Date().toISOString().slice(0, 10);

const LEGAL_ROUTES = new Set([
  "/editorial-guidelines/",
  "/privacy-policy/",
  "/hipaa-policy/",
  "/terms-of-use/",
]);
const REVIEW_ROUTE_RE = /^\/reviews\/[^/]+\/$/;
const AUTHOR_ROUTES = new Set(["/author/dr-angel-rivera/", "/author/mahadev-mukherjee/"]);

// Priority/changefreq rules — verbatim port of getSitemapMeta() in
// the old scripts/prerender.mjs.
function getSitemapMeta(route) {
  if (route === "/") return { priority: "1.0", changefreq: "weekly" };
  if (route === "/blog/") return { priority: "0.8", changefreq: "weekly" };
  if (route === "/services/") return { priority: "0.9", changefreq: "monthly" };
  if (route === "/peptides/" || route === "/fl/") {
    return { priority: "0.9", changefreq: "monthly" };
  }
  if (route === "/reviews/") return { priority: "0.8", changefreq: "monthly" };
  if (route === "/careers/") return { priority: "0.5", changefreq: "monthly" };
  if (LEGAL_ROUTES.has(route)) return { priority: "0.4", changefreq: "yearly" };
  if (REVIEW_ROUTE_RE.test(route) || AUTHOR_ROUTES.has(route)) {
    return { priority: "0.7", changefreq: "monthly" };
  }
  return { priority: "0.8", changefreq: "monthly" };
}

// ---------------------------------------------------------------------------
// git lastmod
// ---------------------------------------------------------------------------
const gitMtimeCache = new Map();
let gitAvailable = true;

function gitMtimeIso(relFile) {
  if (!gitAvailable) return null;
  if (gitMtimeCache.has(relFile)) return gitMtimeCache.get(relFile);
  let result = null;
  const r = spawnSync("git", ["log", "-1", "--format=%cI", "--", relFile], {
    cwd: root,
    encoding: "utf-8",
  });
  if (r.error && r.error.code === "ENOENT") {
    gitAvailable = false;
  } else if (r.status === 0) {
    const out = (r.stdout || "").trim();
    if (out) result = out;
  } else {
    const stderr = (r.stderr || "").toLowerCase();
    if (
      stderr.includes("not a git repository") ||
      stderr.includes("does not have any commits yet")
    ) {
      gitAvailable = false;
    }
  }
  gitMtimeCache.set(relFile, result);
  return result;
}

// Contributing source files per route. The page module itself plus any
// content fragments named after the slug; data-driven routes also list their
// data module so editing data bumps lastmod.
function routeSourceFiles(route) {
  const files = [];
  const push = (p) => existsSync(join(root, p)) && files.push(p);
  if (route === "/") {
    push("src/pages/index.astro");
  } else {
    const slug = route.slice(1, -1); // "reviews/revita"
    push(`src/pages/${slug}.astro`);
    push(`src/pages/${slug}/index.astro`);
    const flat = slug.replace(/\//g, "-");
    const fragDir = join(root, "src/content/fragments");
    if (existsSync(fragDir)) {
      for (const f of readdirSync(fragDir)) {
        if (f === `${flat}.html` || f.startsWith(`${flat}.`) ||
            f === `${slug.split("/").pop()}.html` ||
            f.startsWith(`${slug.split("/").pop()}.`)) {
          push(`src/content/fragments/${f}`);
        }
      }
    }
  }
  if (route === "/blog/" || route === "/reviews/") push("src/data/articles.ts");
  if (route.startsWith("/reviews/")) push("src/data/reviews.ts");
  if (route.startsWith("/fl/")) {
    push("src/data/local/cityTrtConfig.ts");
    if (route.includes("weight-loss")) push("src/data/local/cityWeightLossConfig.ts");
    if (route.includes("peptide-therapy")) push("src/data/local/cityPeptideConfig.ts");
  }
  return files;
}

function extractDateModifiedFromHtml(html) {
  const re = /"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/g;
  let max = null;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!max || m[1] > max) max = m[1];
  }
  return max;
}

// Hub aggregation children — same policy as the old prerender.mjs.
function hubChildren(route, allRoutes) {
  if (route === "/blog/") {
    return allRoutes.filter((r) =>
      /^\/(dexa-scan|porn-induced-erectile-dysfunction|baking-soda-for-ed|garlic-and-honey-for-erectile-dysfunction|home-remedies-for-premature-ejaculation|premature-ejaculation-exercises|lysine-benefit-men-health|nac-benefits-men|nadh-benefits|resveratrol-side-effects|foods-that-lower-testosterone|peptides-for-[a-z-]+|collagen-peptides|semaglutide-diet|stillman-diet)\/$/.test(r),
    );
  }
  if (route === "/reviews/") return allRoutes.filter((r) => REVIEW_ROUTE_RE.test(r));
  if (route === "/peptides/") {
    return allRoutes.filter(
      (r) => r.startsWith("/peptides-for-") || r === "/collagen-peptides/",
    );
  }
  if (route === "/fl/") {
    return allRoutes.filter((r) => r.startsWith("/fl/") && r !== "/fl/");
  }
  return [];
}

// ---------------------------------------------------------------------------
function walkRoutes(dir) {
  const routes = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      routes.push(...walkRoutes(p));
    } else if (entry === "index.html") {
      const rel = relative(dist, dir).split("\\").join("/");
      routes.push(rel === "" ? "/" : `/${rel}/`);
    }
  }
  return routes;
}

const routes = walkRoutes(dist).sort();

const lastmodByRoute = new Map();
for (const route of routes) {
  const htmlPath =
    route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html");
  const html = readFileSync(htmlPath, "utf-8");
  const explicit = extractDateModifiedFromHtml(html);
  let chosen = explicit;
  if (!chosen) {
    const isos = routeSourceFiles(route)
      .map((f) => gitMtimeIso(f))
      .filter(Boolean);
    if (isos.length) chosen = isos.reduce((a, b) => (a > b ? a : b)).slice(0, 10);
  }
  lastmodByRoute.set(route, chosen || BUILD_DATE_YMD);
}

// Hub aggregation pass.
for (const hub of ["/blog/", "/reviews/", "/peptides/", "/fl/"]) {
  if (!lastmodByRoute.has(hub)) continue;
  const dates = [
    lastmodByRoute.get(hub),
    ...hubChildren(hub, routes).map((c) => lastmodByRoute.get(c)),
  ].filter(Boolean);
  lastmodByRoute.set(hub, dates.reduce((a, b) => (a > b ? a : b)));
}

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
];
for (const route of routes) {
  const { priority, changefreq } = getSitemapMeta(route);
  lines.push("  <url>");
  lines.push(`    <loc>${SITE_URL}${route}</loc>`);
  lines.push(`    <lastmod>${lastmodByRoute.get(route)}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`);
  lines.push(`    <priority>${priority}</priority>`);
  lines.push("  </url>");
}
lines.push("</urlset>");
lines.push("");
writeFileSync(join(dist, "sitemap.xml"), lines.join("\n"), "utf-8");

if (!gitAvailable) {
  console.warn(
    "generate-sitemap: ⚠ git history unavailable — lastmod fell back to build date where no JSON-LD dateModified existed.",
  );
}
const fallbacks = routes.filter(
  (r) => lastmodByRoute.get(r) === BUILD_DATE_YMD,
);
console.log(
  `generate-sitemap: ${routes.length} URLs (${fallbacks.length} on build-date fallback${fallbacks.length ? ": " + fallbacks.join(", ") : ""})`,
);
