// Phase 1 parity harness — fixture generator.
//
// Reads the read-only QA artifact directory captured from LIVE production on
// 2026-07-14 and deterministically writes
// tests/fixtures/production-parity-2026-07-14.json, the single source of
// expected values for the parity regression suites
// (tests/parity/build.test.mjs and tests/parity/live.test.mjs).
//
// Inputs (QA_DIR env var, or first CLI arg, else the default capture path):
//   - page-parity-results.json   → per-path prod status/title/description/
//                                  canonical/robots/lang/h1 + prod JSON-LD capture
//   - jsonld-differences.json    → the 79 prod-vs-stage JSON-LD field diffs;
//                                  prod values are authoritative
//   - sitemap-parity-results.json→ per-path production <lastmod>
//
// Determinism: keys are emitted sorted, no timestamps, output depends only on
// the artifact contents. Re-running always produces byte-identical output.
//
// IMPORTANT — JSON-LD field indices. The "$[N]..." indices in
// jsonld-differences.json refer to live production's post-hydration DOM order
// (react-helmet reordered scripts). That order does NOT match this repo's
// static script order, so the index must never be used against dist HTML.
// This generator resolves each $[N] against the QA *production capture*
// (pages["prod:<path>"].jsonld, one JSON object per line, same order as the
// indices) to record the target object's @type + occurrence. The test suites
// then resolve semantically by @type in document order.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const DEFAULT_QA_DIR =
  "/Users/erik/Documents/Codex/2026-07-14/c/outputs/stronghealth-migration-qa-2026-07-14";
const qaDir = process.env.QA_DIR || process.argv[2] || DEFAULT_QA_DIR;

const OUT_PATH = join(root, "tests/fixtures/production-parity-2026-07-14.json");

function readJson(name) {
  return JSON.parse(readFileSync(join(qaDir, name), "utf-8"));
}

const pageParity = readJson("page-parity-results.json");
const jsonldDiffs = readJson("jsonld-differences.json");
const sitemapParity = readJson("sitemap-parity-results.json");

// ---------------------------------------------------------------------------
// Approved corrections to raw production behavior. Encoded as explicit
// overrides so the fixture is honest about where it deviates from the capture.
// ---------------------------------------------------------------------------
const OVERRIDES = [
  {
    id: "reading-time-single-read",
    rule: "No page's visible text may contain the standalone text 'read read'.",
    reason:
      "Production renders a duplicated reading-time suffix (e.g. '6 min read read') " +
      "on some pages — a known production bug. Approved correction: the rebuilt site " +
      "must render a single 'read'. Consequently prod visible_text is NOT carried as " +
      "an expectation; the only visible-text assertion is the 'read read' ban.",
  },
  {
    id: "unknown-route-real-404",
    rule: "Unknown URLs must return a real HTTP 404 status; the 404 document then redirects the browser to /peptides/.",
    reason:
      "Production serves a soft-404 (HTTP 200) for unknown routes. Approved correction: " +
      "the rebuilt site returns a genuine 404 for crawlers while redirecting visitors to " +
      "the /peptides/ hub. The fixture encodes the corrected behavior, not production's.",
  },
  {
    id: "sitemap-meta-rules-derived",
    rule: "sitemap <changefreq>/<priority> expectations are derived from the route-class rule table below.",
    reason:
      "The QA artifacts record only match booleans for changefreq/priority (all 47 matched " +
      "production), not the raw values. Values are therefore derived from the verbatim " +
      "production rule table (getSitemapMeta), guarded here by asserting every artifact row " +
      "reported changefreq_match && priority_match.",
  },
  {
    id: "post-cutover-nyc-peptide-therapy",
    rule:
      "/ny/new-york/peptide-therapy/ expectations are authored in POST_CUTOVER_PAGES below, not derived from the QA capture; live-suite reference cross-checks skip post_cutover pages.",
    reason:
      "post-cutover addition, no production counterpart — the NYC telehealth peptide page " +
      "launched 2026-07-14 (after the production capture), so its expected values come from " +
      "the approved PRD (tasks/prd-nyc-peptide-therapy.md), with sitemap lastmod = the " +
      "launch-date HISTORICAL_LASTMOD registry entry.",
  },
  {
    id: "jsonld-resolution-by-type",
    rule: "JSON-LD expectations are resolved by target object @type, never by script index.",
    reason:
      "The $[N] indices in jsonld-differences.json reflect live production's post-hydration " +
      "DOM order (react-helmet reordering) and do not match this repo's static script order. " +
      "Each index is resolved against the QA production capture to record the target @type; " +
      "tests locate the object semantically. priceRange expected '$' comes naturally from the " +
      "prod side of the capture.",
  },
];

// ---------------------------------------------------------------------------
// Sitemap changefreq/priority rule table (see override sitemap-meta-rules-derived).
// ---------------------------------------------------------------------------
const LEGAL_ROUTES = new Set([
  "/editorial-guidelines/",
  "/privacy-policy/",
  "/hipaa-policy/",
  "/terms-of-use/",
]);
const REVIEW_ROUTE_RE = /^\/reviews\/[^/]+\/$/;
const AUTHOR_ROUTES = new Set([
  "/author/dr-angel-rivera/",
  "/author/mahadev-mukherjee/",
]);

function sitemapMeta(route) {
  if (route === "/") return { changefreq: "weekly", priority: "1.0" };
  if (route === "/blog/") return { changefreq: "weekly", priority: "0.8" };
  if (route === "/services/") return { changefreq: "monthly", priority: "0.9" };
  if (route === "/peptides/" || route === "/fl/") {
    return { changefreq: "monthly", priority: "0.9" };
  }
  if (route === "/reviews/") return { changefreq: "monthly", priority: "0.8" };
  if (route === "/careers/") return { changefreq: "monthly", priority: "0.5" };
  if (LEGAL_ROUTES.has(route)) return { changefreq: "yearly", priority: "0.4" };
  if (REVIEW_ROUTE_RE.test(route) || AUTHOR_ROUTES.has(route)) {
    return { changefreq: "monthly", priority: "0.7" };
  }
  return { changefreq: "monthly", priority: "0.8" };
}

// ---------------------------------------------------------------------------
// Sitemap rows (production side).
// ---------------------------------------------------------------------------
const sitemapByPath = new Map();
for (const row of sitemapParity.rows) {
  if (!row.in_production) {
    throw new Error(`sitemap row not in production: ${row.path}`);
  }
  if (!row.changefreq_match || !row.priority_match) {
    // Guard for override "sitemap-meta-rules-derived": the rule-table derivation
    // is only valid because the QA run showed staging == production on both.
    throw new Error(
      `changefreq/priority mismatch recorded for ${row.path}; rule-table derivation is unsafe`,
    );
  }
  const { changefreq, priority } = sitemapMeta(row.path);
  sitemapByPath.set(row.path, {
    changefreq,
    lastmod: row.prod_lastmod,
    priority,
  });
}

// ---------------------------------------------------------------------------
// JSON-LD expectations: path -> field -> { expected, script_type, type_occurrence }.
// ---------------------------------------------------------------------------
function parseProdJsonld(path) {
  const rec = pageParity.pages[`prod:${path}`];
  if (!rec) throw new Error(`no prod capture for ${path}`);
  if (!rec.jsonld) return [];
  return rec.jsonld.split("\n").map((line, i) => {
    try {
      return JSON.parse(line);
    } catch (e) {
      throw new Error(`unparseable prod JSON-LD line ${i} on ${path}: ${e.message}`);
    }
  });
}

// Resolve a "$[N].a.b[2].c" style field against an array of parsed objects.
function resolveField(objects, field) {
  const tokens = [...field.matchAll(/\[(\d+)\]|\.([^.[\]]+)/g)].map((m) =>
    m[1] !== undefined ? Number(m[1]) : m[2],
  );
  let cur = objects;
  for (const t of tokens) {
    if (cur == null) return undefined;
    cur = cur[t];
  }
  return cur;
}

const jsonldByPath = new Map();
for (const diff of jsonldDiffs.diffs) {
  const objects = parseProdJsonld(diff.path);
  const idxMatch = diff.field.match(/^\$\[(\d+)\]/);
  if (!idxMatch) throw new Error(`unexpected field shape: ${diff.field}`);
  const idx = Number(idxMatch[1]);
  const target = objects[idx];
  if (!target) throw new Error(`no capture object at ${diff.field} on ${diff.path}`);
  const scriptType = Array.isArray(target["@type"])
    ? target["@type"].join(",")
    : String(target["@type"]);

  // Sanity guard: resolving the full path against the capture must reproduce
  // the recorded prod value, or the capture/index model is wrong.
  const resolved = resolveField(objects, diff.field);
  if (resolved !== diff.prod) {
    throw new Error(
      `capture self-check failed for ${diff.path} ${diff.field}: ` +
        `${JSON.stringify(resolved)} != ${JSON.stringify(diff.prod)}`,
    );
  }

  const typeOccurrence = objects
    .slice(0, idx)
    .filter((o) => {
      const t = Array.isArray(o["@type"]) ? o["@type"].join(",") : String(o["@type"]);
      return t === scriptType;
    }).length;

  // The relative path inside the target object (field minus the "$[N]" head).
  const tail = diff.field.slice(idxMatch[0].length).replace(/^\./, "");

  if (!jsonldByPath.has(diff.path)) jsonldByPath.set(diff.path, {});
  jsonldByPath.get(diff.path)[diff.field] = {
    expected: diff.prod,
    script_type: scriptType,
    tail,
    type_occurrence: typeOccurrence,
  };
}

// ---------------------------------------------------------------------------
// Per-page expectations from production rows.
// ---------------------------------------------------------------------------
const pages = {};
for (const row of pageParity.rows) {
  const prod = pageParity.pages[`prod:${row.path}`];
  if (!prod) throw new Error(`missing prod page record for ${row.path}`);
  if (prod.status !== 200) throw new Error(`prod status ${prod.status} for ${row.path}`);
  if (!Array.isArray(prod.h1s) || prod.h1s.length !== 1) {
    throw new Error(`expected exactly one prod h1 on ${row.path}, got ${prod.h1s?.length}`);
  }
  if (!prod.canonical || !prod.canonical.startsWith("{origin}")) {
    throw new Error(`unexpected prod canonical on ${row.path}: ${prod.canonical}`);
  }
  const sitemap = sitemapByPath.get(row.path);
  if (!sitemap) throw new Error(`no sitemap row for ${row.path}`);

  const jsonldFields = jsonldByPath.get(row.path) || {};
  pages[row.path] = {
    canonical_path: prod.canonical.slice("{origin}".length),
    description: prod.description,
    h1: prod.h1s[0],
    jsonld: sortObject(jsonldFields),
    lang: prod.lang,
    robots: prod.robots,
    sitemap,
    status: 200,
    title: prod.title,
  };
}

if (Object.keys(pages).length !== 47) {
  throw new Error(`expected 47 captured pages, got ${Object.keys(pages).length}`);
}

// ---------------------------------------------------------------------------
// Post-cutover routes (override "post-cutover-nyc-peptide-therapy"): pages
// launched after the 2026-07-14 production capture. Expectations are authored
// here (they have no production counterpart); `post_cutover: true` makes the
// live suite skip the reference-origin cross-check for them.
// ---------------------------------------------------------------------------
const POST_CUTOVER_PAGES = {
  "/ny/new-york/peptide-therapy/": {
    canonical_path: "/ny/new-york/peptide-therapy/",
    description:
      "Physician-supervised peptide therapy for New York patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
    h1: "Peptide Therapy in New York, NY.",
    jsonld: {},
    lang: "en",
    post_cutover: true,
    robots: "index, follow, max-image-preview:large",
    sitemap: { changefreq: "monthly", lastmod: "2026-07-14", priority: "0.8" },
    status: 200,
    title: "Peptide Therapy in New York, NY — Telehealth | Strong Health",
  },
  "/ca/san-diego/peptide-therapy/": {
    canonical_path: "/ca/san-diego/peptide-therapy/",
    description:
      "Physician-supervised peptide therapy for San Diego patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
    h1: "Peptide Therapy in San Diego, CA.",
    jsonld: {},
    lang: "en",
    post_cutover: true,
    robots: "index, follow, max-image-preview:large",
    sitemap: { changefreq: "monthly", lastmod: "2026-07-15", priority: "0.8" },
    status: 200,
    title: "San Diego Peptide Therapy, CA — Telehealth | Strong Health",
  },
  "/nv/las-vegas/peptide-therapy/": {
    canonical_path: "/nv/las-vegas/peptide-therapy/",
    description:
      "Physician-supervised peptide therapy for Las Vegas patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
    h1: "Peptide Therapy in Las Vegas, NV.",
    jsonld: {},
    lang: "en",
    post_cutover: true,
    robots: "index, follow, max-image-preview:large",
    sitemap: { changefreq: "monthly", lastmod: "2026-07-15", priority: "0.8" },
    status: 200,
    title: "Las Vegas Peptide Therapy, NV — Telehealth | Strong Health",
  },
  "/ga/atlanta/peptide-therapy/": {
    canonical_path: "/ga/atlanta/peptide-therapy/",
    description:
      "Physician-supervised peptide therapy for Atlanta patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
    h1: "Peptide Therapy in Atlanta, GA.",
    jsonld: {},
    lang: "en",
    post_cutover: true,
    robots: "index, follow, max-image-preview:large",
    sitemap: { changefreq: "monthly", lastmod: "2026-07-15", priority: "0.8" },
    status: 200,
    title: "Peptide Therapy in Atlanta, GA — Telehealth | Strong Health",
  },
  "/tx/austin/peptide-therapy/": {
    canonical_path: "/tx/austin/peptide-therapy/",
    description:
      "Physician-supervised peptide therapy for Austin patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
    h1: "Peptide Therapy in Austin, TX.",
    jsonld: {},
    lang: "en",
    post_cutover: true,
    robots: "index, follow, max-image-preview:large",
    sitemap: { changefreq: "monthly", lastmod: "2026-07-15", priority: "0.8" },
    status: 200,
    title: "Peptide Therapy in Austin, TX — Telehealth | Strong Health",
  },
  "/fl/tampa/peptide-therapy/": {
    canonical_path: "/fl/tampa/peptide-therapy/",
    description:
      "Physician-supervised peptide therapy for Tampa patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
    h1: "Peptide Therapy in Tampa, FL.",
    jsonld: {},
    lang: "en",
    post_cutover: true,
    robots: "index, follow, max-image-preview:large",
    sitemap: { changefreq: "monthly", lastmod: "2026-07-15", priority: "0.8" },
    status: 200,
    title: "Peptide Therapy in Tampa, FL — Telehealth | Strong Health",
  },
};
for (const [path, entry] of Object.entries(POST_CUTOVER_PAGES)) {
  if (pages[path]) throw new Error(`post-cutover route ${path} already captured`);
  pages[path] = entry;
}

if (Object.keys(pages).length !== 53) {
  throw new Error(`expected 53 total pages, got ${Object.keys(pages).length}`);
}

// Every jsonld-differences path must belong to a known page.
for (const p of jsonldByPath.keys()) {
  if (!pages[p]) throw new Error(`jsonld diff for unknown path ${p}`);
}

function sortObject(obj) {
  const out = {};
  for (const k of Object.keys(obj).sort()) {
    const v = obj[k];
    out[k] =
      v && typeof v === "object" && !Array.isArray(v) ? sortObject(v) : v;
  }
  return out;
}

const fixture = {
  _generated_by: "scripts/generate-parity-fixture.mjs",
  _source: "stronghealth-migration-qa-2026-07-14 (captured from live production 2026-07-14)",
  forbidden_url_substrings: ["staging.stronghealth.com", "localhost", "replit"],
  origin_placeholder: "{origin}",
  overrides: OVERRIDES,
  pages: sortObject(pages),
  production_origin: pageParity.production_origin,
  unknown_route: {
    expected_redirect: "/peptides/",
    expected_status: 404,
    override: "unknown-route-real-404",
    path: "/zzz-does-not-exist/",
  },
  visible_text_bans: ["read read"],
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(fixture, null, 2) + "\n", "utf-8");
console.log(
  `generate-parity-fixture: wrote ${OUT_PATH} — ${Object.keys(pages).length} pages ` +
    `(47 captured + ${Object.keys(POST_CUTOVER_PAGES).length} post-cutover), ` +
    `${jsonldDiffs.diffs.length} JSON-LD field expectations across ${jsonldByPath.size} pages`,
);
