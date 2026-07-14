// US-014: automated parity audit. Crawls every URL in the OLD site's sitemap
// on two bases (production build vs the new Astro build / Vercel preview) and
// diffs per URL: HTTP status, <title>, meta description, canonical, robots,
// JSON-LD @types, H1, and word count (±5% tolerance).
//
// Usage: node scripts/audit-parity.mjs <prodBase> <newBase> [reportPath]
//   e.g. node scripts/audit-parity.mjs http://localhost:8899 http://localhost:4321 reports/parity.md
//
// Known-good differences (documented in CHANGES-FROM-PRODUCTION.md) are
// whitelisted below; anything else is a defect and exits 1.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [prodBase, newBase, reportPath = "reports/parity-report.md"] = process.argv.slice(2);
if (!prodBase || !newBase) {
  console.error("usage: node scripts/audit-parity.mjs <prodBase> <newBase> [reportPath]");
  process.exit(2);
}

const SITE_URL = "https://www.stronghealth.com";

// Expected diffs, keyed by route -> field -> explanation.
const EXPECTED = {
  "/fl/delray-beach/trt-therapy/": {
    title: "US-013 trim: 64 -> 60 chars (logged #10)",
    description: "US-013 trim: 167 -> 150 chars (logged #10)",
  },
  "/fl/delray-beach/weight-loss-clinic/": {
    description: "US-013 trim: 191 -> 155 chars (logged #10)",
  },
  "/fl/delray-beach/peptide-therapy/": {
    description: "US-013 trim: 193 -> 156 chars (logged #10)",
  },
};
// Word-count growth is expected site-wide (FAQ answers + accordion items now
// in initial HTML, static mobile drawer) — growth is fine, shrinkage beyond
// 5% is a defect.

function extract(html) {
  const get = (re) => {
    const m = html.match(re);
    return m ? m[1] : null;
  };
  const decode = (s) =>
    s === null
      ? null
      : s
          .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
          .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
  const types = [];
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  )) {
    try {
      const d = JSON.parse(m[1]);
      if (d["@graph"]) types.push(...d["@graph"].map((g) => g["@type"]));
      else types.push(d["@type"]);
    } catch {
      types.push("INVALID_JSON");
    }
  }
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ");
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    title: decode(get(/<title[^>]*>([^<]*)<\/title>/)),
    description: decode(get(/<meta\s+name="description"\s+content="([^"]*)"/)),
    canonical: get(/<link\s+rel="canonical"\s+href="([^"]*)"/),
    robots: get(/<meta\s+name="robots"\s+content="([^"]*)"/),
    h1: decode(
      (get(/<h1[^>]*>([\s\S]*?)<\/h1>/) || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
    ),
    jsonLdTypes: types.sort().join(","),
    words,
  };
}

async function fetchPage(base, route) {
  const res = await fetch(base + route, { redirect: "manual" });
  const html = res.status === 200 ? await res.text() : "";
  return { status: res.status, ...(html ? extract(html) : {}) };
}

const sitemapXml = await (await fetch(prodBase + "/sitemap.xml")).text();
const routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace(SITE_URL, ""),
);

const rows = [];
let unexpected = 0;
for (const route of routes) {
  const [p, n] = await Promise.all([fetchPage(prodBase, route), fetchPage(newBase, route)]);
  const diffs = [];
  const expect = EXPECTED[route] || {};

  const cmp = (field, pv, nv) => {
    if (pv === nv) return;
    if (expect[field]) diffs.push({ field, note: `EXPECTED — ${expect[field]}` });
    else {
      diffs.push({ field, note: `prod=${JSON.stringify(pv)} new=${JSON.stringify(nv)}` });
      unexpected++;
    }
  };

  cmp("status", p.status, n.status);
  if (p.status === 200 && n.status === 200) {
    cmp("title", p.title, n.title);
    cmp("description", p.description, n.description);
    // canonical: production sometimes emitted self-closing link (same value) — compare values
    cmp("canonical", p.canonical, n.canonical);
    cmp("robots", p.robots, n.robots);
    // h1 compared whitespace-insensitively: text either side of a <br/> may
    // gain/lose a cosmetic space in the port; rendering is identical.
    cmp("h1", (p.h1 || "").replace(/\s+/g, ""), (n.h1 || "").replace(/\s+/g, ""));
    cmp("jsonLdTypes", p.jsonLdTypes, n.jsonLdTypes);
    // word count: growth OK (documented), shrinkage > 5% is a defect
    if (n.words < p.words * 0.95) {
      diffs.push({ field: "words", note: `SHRANK ${p.words} -> ${n.words}` });
      unexpected++;
    } else if (n.words > p.words * 1.05) {
      diffs.push({
        field: "words",
        note: `EXPECTED — grew ${p.words} -> ${n.words} (FAQ answers/drawer in static HTML)`,
      });
    }
  }
  rows.push({ route, diffs });
}

// Internal link crawl on the NEW base: every href="/..." on every page resolves 200.
const seen = new Set();
let brokenLinks = 0;
const linkLines = [];
for (const route of routes) {
  const html = await (await fetch(newBase + route)).text();
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    let href = m[1].split("#")[0].split("?")[0];
    if (!href || href.startsWith("//") || seen.has(href)) continue;
    seen.add(href);
    const res = await fetch(newBase + href, { redirect: "manual" });
    if (res.status >= 400) {
      brokenLinks++;
      linkLines.push(`- BROKEN ${href} (${res.status}) first seen on ${route}`);
    }
  }
}

const lines = [
  "# Parity audit report",
  "",
  `- Production base: ${prodBase}`,
  `- New base: ${newBase}`,
  `- Date: ${new Date().toISOString()}`,
  `- Routes audited: ${routes.length}`,
  `- Unexpected diffs: ${unexpected}`,
  `- Broken internal links on new base: ${brokenLinks}`,
  "",
  "| Route | Result |",
  "|---|---|",
];
for (const r of rows) {
  const cell =
    r.diffs.length === 0
      ? "✅ identical"
      : r.diffs.map((d) => `**${d.field}**: ${d.note}`).join("<br>");
  lines.push(`| ${r.route} | ${cell} |`);
}
if (linkLines.length) {
  lines.push("", "## Broken links", ...linkLines);
}
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, lines.join("\n") + "\n");
console.log(
  `audit-parity: ${routes.length} routes, ${unexpected} unexpected diffs, ${brokenLinks} broken links -> ${reportPath}`,
);
process.exit(unexpected + brokenLinks > 0 ? 1 : 0);
