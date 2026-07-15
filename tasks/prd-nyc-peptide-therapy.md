# PRD: New York City Peptide Therapy Landing Page

**Status:** Approved (owner selected all recommended options, 2026-07-14)
**Repo:** strong-health-astro · **Route:** `/ny/new-york/peptide-therapy/`

## 1. Introduction

Add a New York City peptide-therapy landing page mirroring the config-driven Miami/Delray pages (`CityPeptidePage.astro` + `cityPeptideConfig.ts`). NYC is a **telehealth service-area page like Delray Beach**: no physical clinic, no MedicalClinic schema/NAP, telehealth-first copy adapted from Delray with NYC boroughs/neighborhoods and NY-licensing language. This is the first non-Florida local page, so the local-page system must become state-aware without breaking the 47 existing routes or the parity/SEO gates.

## 2. Goals

- Rank for NYC peptide-therapy queries with a page structurally identical to the proven FL local pages.
- Zero regressions: all existing 47 routes keep byte-identical output (parity suite stays green).
- The local-page system supports a second state cleanly (config-driven, no forked layout).

## 3. User Stories

### US-N1: Make the local-page system state-aware
**Description:** As a developer, I want city configs to carry their state so URLs, breadcrumbs, and cross-links stop hardcoding `/fl/`.

**Acceptance Criteria:**
- [x] `CityPeptideConfig` gains `statePrefix: "fl" | "ny"` (default `"fl"`) and `stateName` (e.g. "New York"); existing FL configs unchanged in output
- [x] `CityPeptidePage.astro` derives path `/{statePrefix}/{slug}/peptide-therapy/`, breadcrumb trail (state crumb has NO link when no state hub page exists — schema.org ListItem without `item`, pattern already supported by `breadcrumbSchema`), and NearbyPeptideCities links from config
- [x] `defaultRelatedInternalLinks` (cityLocalProof.ts) only emits TRT/weight-loss sibling links for cities that exist in those configs; NYC gets peptides-hub + `/peptides/`-cluster links instead
- [x] All 47 existing pages byte-identical: `pnpm build && pnpm run test:parity:build` → 606/606
- [x] `pnpm check` passes

### US-N2: NYC config + page
**Description:** As a NYC visitor, I want a peptide-therapy page with local relevance so I can start telehealth care.

**Acceptance Criteria:**
- [x] `NEW_YORK_PEPTIDE_CONFIG` in `cityPeptideConfig.ts`: telehealth service-area (`physicalClinic: false`), copy adapted from Delray with NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island) + neighborhoods served, NY physician-licensing language, FAQs adapted (no Brickell references; labs via local draw sites/telehealth)
- [x] `src/pages/ny/new-york/peptide-therapy.astro` wrapper passes the config (mirrors Delray wrapper)
- [x] SEO: title raw ≤44 chars (final ≤60 incl. " | Strong Health"), description 120–160, canonical `https://www.stronghealth.com/ny/new-york/peptide-therapy/`
- [x] JSON-LD: MedicalWebPage + FAQPage + BreadcrumbList only (NO MedicalClinic — service-area, per Delray precedent); FAQs shared between visible accordion and schema
- [x] No `/ny/` hub page is created; no internal link may point to `/ny/` (link gate enforces)
- [x] `pnpm build` clean (check-seo + generate-sitemap pass); typecheck passes
- [x] Verify in browser using dev-browser skill (desktop 1440 + mobile 375)

### US-N3: Linkage (nav + footer + peptides hub)
**Description:** As a user, I want to find the NYC page from site navigation.

**Acceptance Criteria:**
- [x] Nav Locations dropdown + mobile drawer: "New York" group with single "New York Peptide Therapy" link (no TRT/WL links — gated exactly like the existing weightLossSlugs/peptideSlugs pattern)
- [x] Footer "Florida Locations" column renamed "Locations"; NYC peptide link added
- [x] `/peptides/` hub city grid includes "New York, NY" card linking to the new page
- [x] `/fl/` hub remains Florida-only
- [x] LocationsGridSection (homepage/blog) unchanged (physical clinics only)

### US-N4: Sitemap, gates, and test-harness extension
**Description:** As a search engine and CI, I want the new route registered everywhere the 47 routes are.

**Acceptance Criteria:**
- [x] `generate-sitemap.mjs`: HISTORICAL_LASTMOD entry for the route = launch date (2026-07-14); priority 0.8/monthly (default rule)
- [x] Parity fixture extended: new route added with expected status/title/description/canonical/robots/h1/sitemap meta via the fixture generator's overrides mechanism (reason: "post-cutover addition, no production counterpart"); route-count assertions become 48
- [x] E2E route list + one desktop/mobile screenshot baseline added
- [x] Full harness green: parity build suite, e2e, visual
- [x] check-redirects manifest untouched (no NYC redirects exist)

## 4. Functional Requirements

- FR-1: Page at exactly `/ny/new-york/peptide-therapy/` (trailing slash), HTTP 200
- FR-2: Rendered via the SAME `CityPeptidePage.astro` layout (no fork)
- FR-3: `physicalClinic: false` suppresses MedicalClinic schema, clinic-details section, and independent-reviews card (Delray behavior)
- FR-4: All head tags via Seo component; budgets enforced (no waiver — write compliant copy)
- FR-5: Booking CTAs use site-wide `BOOKING_SMS_HREF` (+19546635563) with `data-track-lead`
- FR-6: Zero client JS beyond the shared site-runtime module
- FR-7: `/ny/new-york/` and `/ny/` return 404 (no hub pages); documented as intentional

## 5. Non-Goals

- No NYC TRT or weight-loss pages, no `/ny/` state hub, no other NY cities
- No physical-clinic claims, address, map embed, or aggregate ratings for NYC
- No changes to FL page content or copy
- No production-parity comparison for this page (it has no production counterpart — fixture override documents this)

## 6. Technical Considerations

- Delray's config is the copy/structure template; Miami's only for physical-clinic sections (not applicable)
- The parity harness asserts EXACT sitemap membership — US-N4 must land in the same commit series as US-N2 or CI fails
- NY legal nuance: copy must say physician-supervised telehealth "for New York patients" and avoid implying an NYC storefront

## 7. Success Metrics

- Build + full harness green with 48 routes
- Lighthouse mobile ≥95 on the new page
- Page indexed in GSC within 2 weeks of sitemap resubmission

## 8. Open Questions

- ~~URL / clinic model / linkage / copy source~~ — resolved by owner (all recommended options)
- Draw-site lab partner name for NYC copy? (Using generic "local lab draw sites" until provided)

## NYC page — implementation record (2026-07-14)

Implemented in 4 commits: US-N1 `feat: state-aware local page system`, US-N2 `feat: NYC peptide therapy page`, US-N3 `feat: link NYC page from nav/footer/peptides hub`, US-N4 `test: extend gates and fixtures to 48 routes`.

Commands run + results:

- `pnpm check` — 0 errors, 0 warnings (after every story).
- `pnpm build` — 48 pages; `generate-sitemap: 48 URLs, 18 distinct lastmod dates ✓`; `check-seo: 49 page(s) + sitemap clean ✓`.
- Byte-identity (US-N1/US-N2): `find dist -name '*.html' | xargs shasum` diffed against the pre-change baseline — **zero diffs** for all 47 existing pages (US-N1 exact; US-N2 adds only `dist/ny/new-york/peptide-therapy/index.html`). US-N3 diffs on existing pages verified to be exactly the nav "New York" group (desktop dropdown + mobile drawer), the footer "Florida Locations"→"Locations" rename + NYC link, and the /peptides/ hub "New York, NY" card.
- `pnpm run test:parity:build` — **617/617 pass** (was 606; fixture now 48 routes via the `post-cutover-nyc-peptide-therapy` override: "post-cutover addition, no production counterpart").
- `pnpm run test:e2e` — **108 passed**, 2 skipped (route list follows the fixture → NYC included).
- `playwright test --grep @visual --update-snapshots` then `pnpm run test:visual` — **57/57 pass**. New NYC desktop+mobile baselines added; 6 mobile baselines rewritten (footer additions exceeded mobile tolerance); desktop baselines unchanged (footer delta within the 0.25% gate, same keep-passing-baselines policy as remediation Phase 8). Samples eyeballed: home mobile, /fl/ mobile, NYC desktop.
- Browser verification (US-N2): Playwright vs `astro preview` — HTTP 200, h1 `Peptide Therapy in New York, NY.`, 9 FAQ accordions, hero/final CTAs `sms:+19546635563` with `data-track-lead`, local-proof "Serving New York by appointment" section, five boroughs rendered. Screenshots: `docs/waivers/nyc-launch/nyc-peptide-desktop-1440x1000.png`, `docs/waivers/nyc-launch/nyc-peptide-mobile-375x812.png`.

Built page facts: title `Peptide Therapy in New York, NY — Telehealth | Strong Health` (60 chars final / 44 raw); description 151 chars; canonical `https://www.stronghealth.com/ny/new-york/peptide-therapy/`; JSON-LD = MedicalWebPage + FAQPage + BreadcrumbList only (no MedicalClinic); breadcrumb "New York" crumb has no `item` URL and renders as plain text; no internal link to `/ny/` or `/ny/new-york/` anywhere in dist; 0 "Brickell" occurrences on the page.

Deviations from the PRD story split (with rationale):
1. The `HISTORICAL_LASTMOD` registry entry (a US-N4 acceptance item) landed in the **US-N2 commit** — `generate-sitemap.mjs` hard-fails any route without a registry entry or JSON-LD `dateModified`, so US-N2's own "pnpm build clean" criterion is unsatisfiable without it.
2. US-N1 added optional layout-string overrides (`howItWorksTag`, `howItWorksHeadingIntro/Gold`, `physiciansSubtitleSuffix`, `relatedServicesHeadingIntro`) beyond the PRD-named `statePrefix`/`stateName`. Defaults reproduce the previous hardcoded strings byte-for-byte; NYC uses them to avoid "our New York clinic" storefront phrasing (PRD §6 NY legal nuance) without forking the layout.
3. `tests/parity/live.test.mjs`: post-cutover fixture pages skip only the reference-origin cross-check (production has no NYC page to compare against until the next deploy); all candidate assertions still run.
