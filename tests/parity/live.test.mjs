// Phase 1 parity regression suite — LIVE HTTP variant.
//
// Runs the same fixture assertions as build.test.mjs, but over HTTP against a
// deployed candidate, plus a light cross-check against a reference origin:
//
//   REFERENCE_BASE_URL=https://www.stronghealth.com \
//   CANDIDATE_BASE_URL=https://staging.stronghealth.com \
//   pnpm run test:parity:live
//
// Both env vars must be set or the whole suite is skipped. SITE_ORIGIN
// (default https://www.stronghealth.com) is the origin expected inside
// canonical URLs and JSON-LD regardless of which host is being fetched.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  runPageAssertions,
  runSitemapAssertions,
} from "./lib/page-assertions.mjs";
import {
  extractDescription,
  extractH1s,
  extractTitle,
  normalizeWs,
} from "./lib/html.mjs";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = JSON.parse(
  readFileSync(join(root, "tests/fixtures/build-baseline.json"), "utf-8"),
);

const REFERENCE = (process.env.REFERENCE_BASE_URL || "").replace(/\/$/, "");
const CANDIDATE = (process.env.CANDIDATE_BASE_URL || "").replace(/\/$/, "");
const ORIGIN = process.env.SITE_ORIGIN || "https://www.stronghealth.com";
const enabled = Boolean(REFERENCE && CANDIDATE);
const skip = enabled
  ? false
  : "set REFERENCE_BASE_URL and CANDIDATE_BASE_URL to run the live parity suite";

async function fetchPage(base, path) {
  const res = await fetch(base + path, {
    redirect: "manual",
    headers: { "user-agent": "stronghealth-parity-harness/1.0" },
  });
  return { status: res.status, html: await res.text() };
}

for (const [path, entry] of Object.entries(fixture.pages)) {
  test(`live page ${path}`, { skip }, async (t) => {
    const cand = await fetchPage(CANDIDATE, path);
    assert.equal(cand.status, entry.status, `candidate HTTP status for ${path}`);
    await runPageAssertions(t, {
      html: cand.html,
      path,
      entry,
      origin: ORIGIN,
      fixture,
    });

    // Cross-check core SEO surface directly against the live reference.
    // Post-cutover routes (fixture override "post-cutover-nyc-peptide-therapy")
    // have no counterpart on the reference origin — skip only that cross-check.
    await t.test(
      `${path} candidate matches live reference`,
      { skip: entry.post_cutover ? "post-cutover route: no reference counterpart" : false },
      async () => {
        const ref = await fetchPage(REFERENCE, path);
        assert.equal(cand.status, ref.status, "status differs from reference");
        assert.equal(
          normalizeWs(extractTitle(cand.html) ?? ""),
          normalizeWs(extractTitle(ref.html) ?? ""),
          "title differs from reference",
        );
        assert.equal(
          normalizeWs(extractDescription(cand.html) ?? ""),
          normalizeWs(extractDescription(ref.html) ?? ""),
          "description differs from reference",
        );
        assert.deepEqual(
          extractH1s(cand.html),
          extractH1s(ref.html),
          "h1s differ from reference",
        );
      },
    );
  });
}

test("live sitemap.xml", { skip }, async (t) => {
  const res = await fetch(`${CANDIDATE}/sitemap.xml`);
  assert.equal(res.status, 200);
  const xml = await res.text();
  await runSitemapAssertions(t, { xml, fixture, origin: ORIGIN });
});

// Approved correction "unknown-route-real-404": candidate must return a real
// HTTP 404 (production's soft-404 behavior is intentionally NOT encoded), and
// the 404 document must redirect the browser to /peptides/. The redirect is
// client-side (meta-refresh + JS), so a manual fetch sees the 404 status and
// the redirect target embedded in the body rather than a Location header.
test("live unknown route returns real 404 that redirects to /peptides/", { skip }, async () => {
  const { path, expected_status, expected_redirect } = fixture.unknown_route;
  const res = await fetch(CANDIDATE + path, { redirect: "manual" });
  assert.equal(res.status, expected_status);
  assert.match(await res.text(), new RegExp(`url=${expected_redirect}`));
});
