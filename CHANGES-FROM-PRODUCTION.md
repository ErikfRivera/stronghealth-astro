# Deliberate differences from production (Replit build @ 9398453)

Every intentional deviation from the production site, so post-cutover ranking
shifts can be traced. Anything NOT listed here should be byte-equivalent in
meaning; the US-014 parity audit flags everything else as a defect.

## Site-wide

1. **FAQ answers now present in initial HTML.** The old React accordion only
   rendered answers after a click, so crawlers saw questions without answers
   (the answers existed only in the FAQPage JSON-LD). The new
   `<details>/<summary>` accordions ship every answer in the static HTML.
   Visible text and FAQPage JSON-LD are generated from the same array.
2. **Mobile nav drawer markup is in the static HTML.** Production rendered it
   only after React hydration (portal). Adds ~150 words of nav labels per page;
   matches the post-hydration DOM users actually saw.
3. **Article body no longer ships invisible.** Production prerendered FadeIn
   sections with `opacity-0` (content invisible until React hydrated — a JS-off
   and crawler-rendering risk). Sections now render visible and animate via a
   small progressive-enhancement IntersectionObserver.
4. **Internal links normalized to trailing-slash** (e.g. `/services` →
   `/services/`), removing a 308 redirect hop per click. Canonicals were always
   trailing-slash; only in-page hrefs changed.
5. ~~Schema URL trailing-slash normalization~~ **REVERTED by the 2026-07-14
   remediation (D5)**: schema self-URL fields match live production formatting
   exactly (slashless on 32 routes, per `PROD_SLASHLESS_PATHS` in
   `src/components/seo/schemas.ts`). Canonicals remain trailing-slash.
6. **JSON-LD placement:** unchanged (body), same types per page.

## Per-page

7. **"X min read read" duplication fixed** on the 13 article pages whose
   source passed a readTime already containing "read" (e.g. lysine, NAC, NADH,
   resveratrol, foods-that-lower-testosterone, all 8 old-layout peptide pages).
   Now renders "X min read" once.

8. **Diet-page food accordions ship every item in the initial HTML.** Production
   (React AccordionFoodList) rendered only category headers until clicked; the
   `<details>` port includes all food items statically. Food-group data lifted
   verbatim from the page source.

9. **City-page FAQ answers ship in the initial HTML** (same details/summary
   conversion as site-wide change #1).
10. ~~Delray Beach SEO trims~~ **REVERTED by the 2026-07-14 remediation
    (D5)**: live production strings restored verbatim; check-seo carries
    documented per-page waivers. Original trim record: (production strings exceeded budget; SEO_AUDIT
    finding #4/#5 — the only title/description text changes in the migration):
    - `/fl/delray-beach/trt-therapy/` title: "Delray Beach, FL TRT — Telehealth
      + Miami Clinic" → "Delray Beach TRT — Telehealth + Miami Clinic"
      (final 64 → 60 chars); description 167 → 150 chars (dropped trailing
      "Board-certified.").
    - `/fl/delray-beach/weight-loss-clinic/` description 191 → 155 chars
      (dropped "Snowbird-friendly. Book today.").
    - `/fl/delray-beach/peptide-therapy/` description 193 → 156 chars
      (tightened clinic phrasing, dropped "Tesamorelin" from the list).

11. ~~Sitemap lastmod bump~~ **RESOLVED by the 2026-07-14 remediation (D6)**:
    the 21 URLs now carry their historical production dates from an explicit
    registry in `scripts/generate-sitemap.mjs`. Original note: (home, hubs, local pages,
    legal, authors, careers, services): production derived these from the old
    repo's git history; the new repo's history starts at the migration, and
    these pages did materially change (see #1–#3). All 26 URLs with hand-
    curated JSON-LD `dateModified` keep their exact production lastmod;
    priority/changefreq match production 47/47.

12. **Homepage rethemed from TRT to peptide therapy (2026-07-18).** The
    homepage now leads with physician-supervised peptide therapy instead of
    TRT. Same section structure and design system; new copy and data:
    - Title: "Testosterone Therapy in South Florida | Strong Health" →
      "Physician-Supervised Peptide Therapy | Strong Health"; description
      rewritten to match (both within the SEO budgets).
    - H1: "Testosterone Replacement Therapy. Not supplements. Not guesswork."
      → "Peptide Therapy. Not gray-market vials. Not guesswork."
    - The testosterone-decline chart section was replaced by a six-card
      goal grid linking the `/peptides-for-*` guide pages.
    - Comparison table recast as Strong Health vs. med spas/IV lounges vs.
      online "research" vials; biomarker grid recast around peptide-relevant
      labs (IGF-1, glucose/HbA1c, hormones); FAQ replaced with peptide FAQs.
    - Pricing tiers ($149/$199/$299 TRT plans) replaced with a
      protocol-pricing explainer (free assessment, month-to-month, all-in).
    - New "Peptide Therapy Locations" section links all 8 city
      peptide-therapy pages (driven by `cityPeptideConfig.ts`).
    The parity fixture's `/` entry was updated to the new strings. TRT still
    appears in the org JSON-LD service catalog and everywhere else on the
    site; only the homepage's focus changed.

_All other title/description texts are unchanged from production (production
had already been trimmed to budget after the April SEO audit; the build now
enforces the budgets: title ≤ 60 chars incl. brand, description 120–160)._

---

## 2026-07-18 — Full peptide repositioning (PRD: prd-peptide-repositioning.md)

This release completes the pivot the homepage retheme started: Strong Health
is now a single-theme **physician-supervised peptide therapy** site. The
changes below are deliberate and sitewide, so the frozen 2026-07-14 production
byte-parity capture is no longer the spec (see "Parity suite re-baseline").

### Removed pages (301, single-hop → nearest peptide equivalent)
- `/services/` → `/peptides/`
- `/fl/miami/trt-therapy/`, `/fl/delray-beach/trt-therapy/` → each city's `/peptide-therapy/`
- `/fl/miami/weight-loss-clinic/`, `/fl/delray-beach/weight-loss-clinic/` → each city's `/peptide-therapy/`
- Layouts `CityTRTPage.astro` / `CityWeightLossPage.astro` and data modules
  `cityTrtConfig.ts` / `cityWeightLossConfig.ts` deleted; `LocationsGridSection.astro`
  removed (duplicated `PeptideLocationsSection`).
- Redirects added to `vercel.json`; `tests/fixtures/redirect-manifest.json` updated;
  `check-redirects` passes single-hop/no-loop.
- PRP, stem-cell, and Miami DEXA pages KEPT (owner decision) but de-emphasized.

### TRT brand residue removed
- Footer (shared + article/review mini-footers): tagline, "Strong Health TRT"
  copyright → "Strong Health", TRT-led Services column → peptide services.
- `Seo.astro` `DEFAULT_OG_IMAGE_ALT` (sitewide default) → peptide-primary.
- `organizationSchema()` description + OfferCatalog → peptide-primary; TRT and
  Sexual Health service offers dropped.
- `Nav.astro`: Locations dropdown leads with peptide-therapy; Peptides menu now
  exposes "Browse by Goal" (`/peptides/`) and "Browse by Molecule" (`/molecules/`);
  Dexascans and Reviews dropdowns removed.
- `/fl/` hub retitled/rewritten peptide-primary; `/about/`, `/careers/`, `/blog/`,
  author bio rethemed. "Men's Health Nutrients" article category → "Nutrients & Supplements".
- KEPT deliberately: "Strong Health TRT, LLC" in `/terms-of-use/` (registered
  legal entity, OQ-6); contextual "combined with TRT" mentions in guide/review copy.

### Reviews isolated (US-003)
- `/reviews/*` removed from global footer and nav; reachable only via a single
  link from `/about/`. Review pages keep their own structured data, self-interlink,
  and stay indexable. No peptide-theme page links into a review page.

### Molecule layer added (US-004/US-005)
- New `/molecules/` hub + 17 molecule spokes (`/peptides/[slug]/`), driven by
  `src/data/molecules/` (config-per-molecule + shared `MoleculePage.astro`).
  Molecule spokes originally shipped at `/molecules/[slug]/` and were moved
  under `/peptides/[slug]/` (peptides subfolder migration); `vercel.json`
  301s `/molecules/(.+)` → `/peptides/$1`, and the old `/peptides/(.+)` →
  `/peptides/` catch-all was removed to make room for the new routes.
- Each molecule's `goals[]` field generates bidirectional goal↔molecule links:
  molecule pages link their goal spokes; goal spokes render a "Molecules in this
  guide" module (`GoalMoleculesSection.astro`) from the reverse mapping.
- Each molecule page: MedicalWebPage + FAQPage + Physician + BreadcrumbList schema,
  PubMed/DailyMed citations, YMYL-safe dosing context, physician-reviewer byline.
- New schema builders `physicianSchema` / `medicalClinicSchema` in `schemas.ts`.

### Location deepening (US-007)
- Non-Miami metros now name Dr. Angel Rivera as supervising physician (OQ-3),
  replacing the anonymous "Strong Health Medical Team" primary entry.
- Location pages cross-link molecule spokes; physical Miami clinic gains a visible
  Google Maps embed (MedicalClinic schema with NAP+geo already emitted, gated to
  physical clinics — Delray is telehealth per OQ-1).
- "9 clinics" / "nine clinic locations" copy corrected sitewide to the real
  footprint: 1 physical clinic (Miami Brickell) + telehealth across 8 metros.

### Trust signals (US-008)
- AggregateRating (4.9 / 2,500) added to the homepage MedicalBusiness schema,
  backing the on-page claim (OQ-4: keep + add schema).

### Parity suite re-baseline (US-011)
- The build parity suite (`tests/parity/build.test.mjs`) and live suite now
  regress against `tests/fixtures/build-baseline.json` — a self-snapshot of the
  current build produced by `scripts/generate-parity-baseline.mjs`
  (`pnpm test:parity:baseline`) — instead of the retired 2026-07-14 production
  capture, whose byte-parity spec no longer applies after an intentional retheme.
  The snapshot preserves the valuable regressions (title/description/canonical/H1,
  every-JSON-LD-parses, forbidden-host, "read read" ban, sitemap path-set/lastmod,
  internal-link integrity) but drops the production-DOM-order JSON-LD field
  assertions tied to the old capture. Regenerate after any intentional sitewide
  change. A pre-existing "N min read read" duplication on the anti-aging and
  weight-loss spokes was fixed (readTime prop double-suffix).
