# Migration remediation work log

PRD: Strong Health Astro Migration Remediation (2026-07-14).
QA artifacts: `/Users/erik/Documents/Codex/2026-07-14/c/outputs/stronghealth-migration-qa-2026-07-14/`
Reference: https://www.stronghealth.com · Candidate: https://staging.stronghealth.com

## Decisions (D1–D8)

| # | Decision | Choice |
|---|---|---|
| D1 | Unknown URLs | **Default kept**: real 404 + custom page (already staging behavior). Legacy redirect manifest = the App.tsx wildcard set already in vercel.json; no catch-all. |
| D2 | Reading-time labels | **Default kept**: single `read` on the 13 articles + regression test. |
| D3 | Review-card dates | **Default**: restore production-displayed dates (Mar 14/11/9/7/4). Root cause: production formatted without an explicit timezone on a US-timezone build machine (UTC-parsed midnight shifts back a day); staging formatted in UTC. Fix renders review-index dates in `America/New_York` from the same ISO data — no editorial dates invented. |
| D4 | Miami DEXA SMS CTA | **Deviation with rationale**: the CTA is NOT staging-added — production renders the same visible "Book" buttons as JS `onClick` handlers targeting `sms:9546635563` (verified live: the buttons exist; only the site-wide assessment CTA appears as an anchor). Removing it would delete a production conversion path. We keep the buttons as anchors (zero-JS invariant) and normalize the number to `sms:+19546635563` with the original Dexascan body, per the PRD's approved-retention form. Device verification listed as a Phase 10 item. |
| D5 | SEO/structured data | **Default**: live production is source of truth. Restore Delray title/descriptions verbatim (supersedes the earlier US-013 trims), `priceRange: "$"` ×5, Delray schema name/description, and production slashless URL formatting on the exact fields in `jsonld-differences.json` (route-level override map). check-seo gate gets an explicit per-page production-parity waiver list instead of a global budget relaxation. |
| D6 | Sitemap dates | **Default**: hard historical `lastmod` registry for the 21 affected routes (PRD §10.3); other 26 keep JSON-LD dateModified extraction; build fails on missing/registry-less dates and on all-same-date resets. |
| D7 | Visual tolerance | **Default**: ≤0.25% pixels >30/255; 0.25–0.50% text-edge-only requires waiver w/ images. |
| D8 | AdSense 403 | **Default**: shared prod+staging, same publisher ID/request path → inherited production issue, excluded narrowly (`pagead2.googlesyndication.com` 403 only) from the console gate; documented as separate hardening item. |

Key discovery: **live production runs newer content than the migration reference commit 9398453** (priceRange `$` vs `$$`, Delray 64-char title live, review source dates). All remediation fixtures therefore come from the 2026-07-14 QA capture of live production, not from the frozen reference build.

## Repository map (Phase 0)

| Responsibility | Actual module/file | Existing tests | Planned change |
|---|---|---|---|
| Site origin + slash policy | `astro.config.mjs` (`site`, `trailingSlash: "always"`), `vercel.json` (`trailingSlash: true`) | `scripts/check-seo.mjs` canonical check | none (verified) |
| Shared SEO/head | `src/components/seo/Seo.astro` via `src/layouts/BaseLayout.astro` | check-seo title/desc/canonical/robots gates | per-page parity waiver list |
| JSON-LD generation | `src/components/seo/schemas.ts` + `src/components/seo/JsonLd.astro`; inline MedicalClinic builders in `src/layouts/local/City*.astro` | types-only compare in `scripts/audit-parity.mjs` | priceRange, Delray texts, schemaPath override map |
| Sitemap generation | `scripts/generate-sitemap.mjs` (postbuild; no @astrojs/sitemap) | sitemap↔build consistency in check-seo | historical lastmod registry + all-same-date guard |
| Page content data | `src/pages/*.astro` frontmatter + `src/content/fragments/*.html` + `src/data/*` | text-diff (ad hoc) | none |
| Review index data | `src/data/reviews.ts`; card date formatting in `src/pages/reviews/index.astro` | none | format dates in America/New_York |
| SMS CTA | `src/lib/booking.ts` (site-wide, already `+1…`); page-local constants in `src/pages/fl/miami/dexascan.astro` | none | normalize DEXA number, SMS URI unit test |
| 404 + redirects | `src/pages/404.astro`; `vercel.json` redirects | live curl matrix (ad hoc) | manifest-driven E2E tests |
| Fonts/article styles | `src/styles/global.css` (@font-face + prose), preloads in `BaseLayout.astro` | none | Phase 7 diagnosis |
| Browser parity tests | none (audit-parity.mjs is HTTP-only) | — | Playwright E2E + screenshots (Phase 1) |

Toolchain: pnpm (pnpm-lock.yaml), Astro 5.18.2, Tailwind 4.3.2, no @astrojs/sitemap (custom script), no test framework yet, hosting = Vercel (git auto-deploy from main; staging.stronghealth.com attached; production domain not yet attached). CI = .github/workflows/ci.yml (install → check → build with SEO gates).

Baseline commands (pre-change): `pnpm check` ✅ 0 errors · `pnpm build` ✅ 48 pages + sitemap clean · no pre-existing failures.

## Phase log

### Phase 0 — discovery
- Files changed: this work log.
- Evidence: repo map above; live-prod confirmations (priceRange `$`, Delray title 64 chars live, DEXA buttons JS-driven in prod).
- Commit: (this commit)
