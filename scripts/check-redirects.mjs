// Remediation Phase 5: redirect manifest validation.
//
// Static mode (no args): validates tests/fixtures/redirect-manifest.json
// against vercel.json and dist/ — every manifest target must be a built
// route (or external), no redirect may chain to another redirect source or
// loop, and every manifest source must be covered by a vercel.json rule.
//
// Live mode (BASE_URL env or --base): additionally issues HTTP requests
// against a deployed host and asserts single-hop status + Location.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  readFileSync(join(root, "tests/fixtures/redirect-manifest.json"), "utf-8"),
);
const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf-8"));
const errors = [];

// path-to-regexp-lite for the (.*)/(.+) source patterns we use
function sourceToRegex(src) {
  // Our vercel.json only uses literal paths plus "(.+)" / "(.*)" groups.
  // Tokenize the groups first, escape everything else, then restore them.
  const pattern = src
    .split(/(\(\.\+\)|\(\.\*\))/)
    .map((part) =>
      part === "(.+)" || part === "(.*)"
        ? part
        : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("");
  return new RegExp(`^${pattern}$`);
}
const rules = vercel.redirects.map((r) => ({ ...r, re: sourceToRegex(r.source) }));

function matchRule(path) {
  return rules.find((r) => r.re.test(path));
}

// Resolve a rule's destination for a concrete path, substituting $1/$2
// capture references (e.g. /molecules/(.+) -> /peptides/$1).
function resolveDest(rule, path) {
  const m = path.match(rule.re);
  return rule.destination.replace(/\$(\d+)/g, (_, i) => (m && m[Number(i)]) || "");
}

const distRoute = (p) =>
  p === "/" || existsSync(join(root, "dist", p.slice(1), "index.html"));

for (const r of manifest.redirects) {
  const rule = matchRule(r.source);
  if (!rule) {
    errors.push(`no vercel.json rule covers manifest source ${r.source}`);
    continue;
  }
  // Destination expectations
  const dest = resolveDest(rule, r.source);
  if (dest.startsWith("http")) {
    if (r.target !== dest) errors.push(`${r.source}: external target ${dest} != manifest ${r.target}`);
  } else {
    if (r.target !== dest) errors.push(`${r.source}: target ${dest} != manifest ${r.target}`);
    if (!distRoute(dest)) errors.push(`${r.source}: destination ${dest} is not a built route`);
    if (matchRule(dest)) errors.push(`${r.source}: destination ${dest} matches another redirect (chain/loop)`);
  }
  if (!rule.permanent) errors.push(`${r.source}: rule is not permanent`);
}
for (const nf of manifest.notFound) {
  if (matchRule(nf.source)) errors.push(`${nf.source}: expected 404 but a redirect rule matches`);
  if (distRoute(nf.source)) errors.push(`${nf.source}: expected 404 but route exists in dist`);
}

// Live mode
const base = process.env.BASE_URL || process.argv.find((a) => a.startsWith("--base="))?.slice(7);
if (base) {
  const check = async (path, expStatus, expLocation) => {
    const res = await fetch(base + path, { redirect: "manual" });
    if (res.status !== expStatus) {
      errors.push(`live ${path}: status ${res.status} != ${expStatus}`);
      return;
    }
    if (expLocation) {
      // Vercel emits relative Location headers for same-host redirects.
      let loc = res.headers.get("location") || "";
      if (loc.startsWith("/")) loc = base + loc;
      const want = expLocation.startsWith("http") ? expLocation : base + expLocation;
      if (loc !== want) errors.push(`live ${path}: Location ${loc} != ${want}`);
    }
  };
  for (const r of manifest.redirects) await check(r.source, r.status, r.target);
  for (const n of manifest.normalization) await check(n.source, n.status, n.target);
  for (const nf of manifest.notFound) await check(nf.source, nf.status);
}

if (errors.length) {
  console.error(`check-redirects: ${errors.length} error(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(
  `check-redirects: ${manifest.redirects.length} redirects + ${manifest.notFound.length} 404 cases valid${base ? " (live: " + base + ")" : " (static)"} ✓`,
);
