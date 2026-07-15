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
- [ ] `CityPeptideConfig` gains `statePrefix: "fl" | "ny"` (default `"fl"`) and `stateName` (e.g. "New York"); existing FL configs unchanged in output
- [ ] `CityPeptidePage.astro` derives path `/{statePrefix}/{slug}/peptide-therapy/`, breadcrumb trail (state crumb has NO link when no state hub page exists — schema.org ListItem without `item`, pattern already supported by `breadcrumbSchema`), and NearbyPeptideCities links from config
- [ ] `defaultRelatedInternalLinks` (cityLocalProof.ts) only emits TRT/weight-loss sibling links for cities that exist in those configs; NYC gets peptides-hub + `/peptides/`-cluster links instead
- [ ] All 47 existing pages byte-identical: `pnpm build && pnpm run test:parity:build` → 606/606
- [ ] `pnpm check` passes

### US-N2: NYC config + page
**Description:** As a NYC visitor, I want a peptide-therapy page with local relevance so I can start telehealth care.

**Acceptance Criteria:**
- [ ] `NEW_YORK_PEPTIDE_CONFIG` in `cityPeptideConfig.ts`: telehealth service-area (`physicalClinic: false`), copy adapted from Delray with NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island) + neighborhoods served, NY physician-licensing language, FAQs adapted (no Brickell references; labs via local draw sites/telehealth)
- [ ] `src/pages/ny/new-york/peptide-therapy.astro` wrapper passes the config (mirrors Delray wrapper)
- [ ] SEO: title raw ≤44 chars (final ≤60 incl. " | Strong Health"), description 120–160, canonical `https://www.stronghealth.com/ny/new-york/peptide-therapy/`
- [ ] JSON-LD: MedicalWebPage + FAQPage + BreadcrumbList only (NO MedicalClinic — service-area, per Delray precedent); FAQs shared between visible accordion and schema
- [ ] No `/ny/` hub page is created; no internal link may point to `/ny/` (link gate enforces)
- [ ] `pnpm build` clean (check-seo + generate-sitemap pass); typecheck passes
- [ ] Verify in browser using dev-browser skill (desktop 1440 + mobile 375)

### US-N3: Linkage (nav + footer + peptides hub)
**Description:** As a user, I want to find the NYC page from site navigation.

**Acceptance Criteria:**
- [ ] Nav Locations dropdown + mobile drawer: "New York" group with single "New York Peptide Therapy" link (no TRT/WL links — gated exactly like the existing weightLossSlugs/peptideSlugs pattern)
- [ ] Footer "Florida Locations" column renamed "Locations"; NYC peptide link added
- [ ] `/peptides/` hub city grid includes "New York, NY" card linking to the new page
- [ ] `/fl/` hub remains Florida-only
- [ ] LocationsGridSection (homepage/blog) unchanged (physical clinics only)

### US-N4: Sitemap, gates, and test-harness extension
**Description:** As a search engine and CI, I want the new route registered everywhere the 47 routes are.

**Acceptance Criteria:**
- [ ] `generate-sitemap.mjs`: HISTORICAL_LASTMOD entry for the route = launch date (2026-07-14); priority 0.8/monthly (default rule)
- [ ] Parity fixture extended: new route added with expected status/title/description/canonical/robots/h1/sitemap meta via the fixture generator's overrides mechanism (reason: "post-cutover addition, no production counterpart"); route-count assertions become 48
- [ ] E2E route list + one desktop/mobile screenshot baseline added
- [ ] Full harness green: parity build suite, e2e, visual
- [ ] check-redirects manifest untouched (no NYC redirects exist)

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
