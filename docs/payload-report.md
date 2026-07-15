# HTML payload report — Phase 8 (2026-07-14)

Budget: median uncompressed HTML across the 47 built pages ≤ **60,635 bytes**
(production median 55,123 B + 10 %).

| Metric (47 pages) | Before | After | Δ |
|---|---:|---:|---:|
| Median | 68,218 B | **59,319 B** | −8,899 B (−13.0 %) |
| Total | 3,620,972 B | 3,205,438 B | −415,534 B (avg −8,841 B/page) |
| Min / Max | 42,169 / 151,820 | 33,274 / 142,862 | |

**Budget met: 59,319 ≤ 60,635.**

## What was removed (true duplication only)

1. **Per-link Tailwind utility strings in the primary nav** (desktop dropdown
   + mobile drawer, ~30 links + 8 summaries repeated on every page). The long
   identical `class="…"` strings were replaced by shared component classes
   (`nav-drop*`, `mnav-*`) defined once in `src/styles/global.css`, each rule
   mirroring the exact utilities it replaced. ≈ 6.4 KB/page.
   - Tradeoff decision: the mobile drawer stays **fully server-rendered**
     (same DOM, same aria attributes) rather than being moved to a
     `<template>`-clone — slimming the class attributes achieved the budget
     without changing runtime semantics, and nav links stay crawlable in
     both the desktop dropdown *and* the drawer. Verified pixel-identical
     (0.0000 % diff, max channel delta 0) with the drawer open, and with
     Locations→Miami groups expanded.
2. **Repeated inline `<script>` blocks** (mobile-nav toggle, FadeIn observer,
   GA4 lead tracking, LeadConnector chat loader — identical on every page,
   ≈ 3.4 KB/page). Consolidated into `src/scripts/site-runtime.ts`, loaded
   from BaseLayout as **one hashed, cacheable external module** (2,497 B,
   fetched once site-wide). `vite.build.assetsInlineLimit: 0` keeps bundled
   scripts external. The 172 B gtag bootstrap stays inline in `<head>`
   (ordering-sensitive). Behavior unchanged; every section guards on its
   elements.
3. **Duplicated JSON-LD / style attributes**: audited — zero duplicated
   JSON-LD blocks on any page; the only repeated `style` attributes are two
   48 B category-chip colors ×8 on `/blog/` and `/peptides/` (not worth a
   pass). No action.

Invariants kept: all SEO/schema/content server-rendered; nav links crawlable
in static HTML; aria correctness (drawer `role="dialog"`, `aria-modal`,
`aria-expanded`/`aria-hidden` flow) unchanged; e2e mobile-menu test green;
no client framework added.

## Per-route sizes (uncompressed `dist/**/index.html` bytes)

| Route | Before (B) | After (B) | Δ |
|---|---:|---:|---:|
| `/` | 151,820 | 142,862 | -8,958 |
| `/fl/miami/weight-loss-clinic/` | 134,620 | 125,671 | -8,949 |
| `/semaglutide-diet/` | 133,859 | 124,960 | -8,899 |
| `/fl/miami/trt-therapy/` | 127,162 | 118,221 | -8,941 |
| `/stillman-diet/` | 127,014 | 118,115 | -8,899 |
| `/fl/delray-beach/weight-loss-clinic/` | 126,882 | 117,934 | -8,948 |
| `/fl/delray-beach/trt-therapy/` | 112,296 | 103,360 | -8,936 |
| `/fl/miami/peptide-therapy/` | 110,569 | 101,630 | -8,939 |
| `/fl/miami/dexascan/` | 101,028 | 92,094 | -8,934 |
| `/fl/delray-beach/peptide-therapy/` | 100,884 | 91,948 | -8,936 |
| `/blog/` | 97,734 | 88,168 | -9,566 |
| `/peptides-for-healing/` | 84,396 | 75,496 | -8,900 |
| `/dexa-scan/` | 83,986 | 75,078 | -8,908 |
| `/collagen-peptides/` | 78,405 | 69,505 | -8,900 |
| `/peptides-for-muscle-growth/` | 77,641 | 68,741 | -8,900 |
| `/peptides-for-tendon-repair/` | 76,244 | 67,344 | -8,900 |
| `/peptides-for-arthritis/` | 75,087 | 66,187 | -8,900 |
| `/premature-ejaculation-exercises/` | 74,674 | 65,775 | -8,899 |
| `/peptides/` | 73,783 | 64,865 | -8,918 |
| `/peptides-for-belly-fat/` | 72,472 | 63,572 | -8,900 |
| `/peptides-for-libido/` | 72,071 | 63,171 | -8,900 |
| `/home-remedies-for-premature-ejaculation/` | 71,409 | 62,510 | -8,899 |
| `/foods-that-lower-testosterone/` | 68,647 | 59,749 | -8,898 |
| `/porn-induced-erectile-dysfunction/` | 68,218 | 59,319 | -8,899 |
| `/peptides-for-sleep/` | 67,960 | 59,060 | -8,900 |
| `/fl/` | 65,135 | 56,221 | -8,914 |
| `/reviews/revita/` | 64,290 | 56,152 | -8,138 |
| `/baking-soda-for-ed/` | 64,914 | 56,015 | -8,899 |
| `/reviews/nugenix-ultimate-testosterone/` | 63,685 | 55,547 | -8,138 |
| `/garlic-and-honey-for-erectile-dysfunction/` | 64,402 | 55,503 | -8,899 |
| `/reviews/andro-400/` | 63,317 | 55,179 | -8,138 |
| `/reviews/elysium-basis-review/` | 63,201 | 55,063 | -8,138 |
| `/reviews/low-t-center/` | 61,825 | 53,687 | -8,138 |
| `/nadh-benefits/` | 62,304 | 53,406 | -8,898 |
| `/resveratrol-side-effects/` | 60,154 | 51,256 | -8,898 |
| `/nac-benefits-men/` | 60,091 | 51,193 | -8,898 |
| `/lysine-benefit-men-health/` | 57,946 | 49,048 | -8,898 |
| `/services/` | 55,758 | 46,846 | -8,912 |
| `/author/dr-angel-rivera/` | 55,711 | 46,807 | -8,904 |
| `/careers/` | 55,024 | 46,113 | -8,911 |
| `/about/` | 50,464 | 41,555 | -8,909 |
| `/privacy-policy/` | 50,000 | 41,104 | -8,896 |
| `/hipaa-policy/` | 49,267 | 40,371 | -8,896 |
| `/editorial-guidelines/` | 48,507 | 39,611 | -8,896 |
| `/terms-of-use/` | 48,432 | 39,536 | -8,896 |
| `/author/mahadev-mukherjee/` | 45,515 | 36,616 | -8,899 |
| `/reviews/` | 42,169 | 33,274 | -8,895 |
## Outliers / residual

22 individual routes remain above the *median* budget figure (the budget is a
median target, not per-route): the six biggest — `/` (142,862), the two
weight-loss city pages (~125/118 K), `/semaglutide-diet/` (124,960),
`/fl/miami/trt-therapy/` (118,221), `/stillman-diet/` (118,115) — are big
because of genuine page content (long-form copy, FAQ schema, city sections),
which the PRD forbids trimming. No owner waiver needed: the budget is met.
