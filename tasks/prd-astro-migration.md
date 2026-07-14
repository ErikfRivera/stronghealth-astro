# PRD: Strong Health — Migration from Replit (React/Vite) to Astro Static Site

**Status:** Draft v1.0
**Date:** 2026-07-14
**Owner:** Erik (erik@one.pet)
**Source system:** Replit pnpm monorepo, app `artifacts/strong-health` (React 19 + Vite + Tailwind 4 + react-router 7, custom SSR prerender pipeline, Express `server.mjs`)
**Target system:** New dedicated GitHub repo (`strong-health-astro`) → Astro 5 static output → Vercel
**Production domain:** https://www.stronghealth.com

---

## 1. Introduction / Overview

Strong Health's marketing and content site (physician-supervised TRT, peptide therapy, and weight-loss clinic in South Florida) currently lives inside a Replit pnpm monorepo. The site is React SPA code that is prerendered to static HTML at build time by a custom pipeline (`vite build` client + SSR bundle + `scripts/prerender.mjs`) and served by a custom Express server for correct 404 status codes and cache headers.

This works, but it carries costs: every page ships the full React runtime and hydration JS even though the site is 100% content (no auth, no user state, no forms beyond outbound booking links); the custom prerender/sitemap/404 machinery is bespoke and fragile; and the project is coupled to Replit-specific plugins, deploy config, and workflow.

**The migration:** rebuild the site in Astro as a fully static site in a clean, dedicated GitHub repository, deployed on Vercel. Astro ships zero JavaScript by default, which directly serves the two stated goals: extremely fast load times and maximum search optimization. The migration must be **URL-for-URL and SEO-metadata-for-metadata lossless** — the site earns organic traffic today and nothing may regress (canonicals, JSON-LD, sitemap, 404 semantics, redirects).

## 2. Goals

- **Performance:** Lighthouse Performance ≥ 95 mobile on every page; Core Web Vitals green (LCP < 1.8s, CLS < 0.05, INP < 200ms); total JS shipped per content page < 15 KB (vs. full React runtime today).
- **SEO parity, then improvement:** every one of the 46 indexable routes keeps its exact URL (trailing slash), title, meta description, canonical, robots directives, and JSON-LD; sitemap.xml with per-route `lastmod`/`priority`/`changefreq` parity; real HTTP 404 (not soft 404); client-side wildcard redirects become server-side 301s.
- **Clean infrastructure:** dedicated GitHub repo with CI (build + link/SEO checks on every PR), auto-deploy previews and production deploys via Vercel Git integration.
- **Maintainability:** adding a new article page requires touching one content file + one data entry, with SEO checks enforced automatically (replacing `SEO_NEW_PAGE_CHECKLIST.md` manual steps where possible).
- **Zero Replit dependency:** no `@replit/*` plugins, no `.replit` config, no Replit deploy hooks.

## 3. Current-State Inventory (source of truth for parity)

### 3.1 Route inventory — 46 indexable pages + 404 sentinel

Derived from `scripts/prerender.mjs` `routes` array plus per-review routes from the shared `reviews` data module. The built `dist/public` contains 47 `index.html` files (46 pages + `/__404__/` → `404.html`).

| Cluster | Routes |
|---|---|
| Core | `/`, `/blog/`, `/services/`, `/about/`, `/careers/`, `/dexa-scan/` |
| Authors (E-E-A-T) | `/author/dr-angel-rivera/`, `/author/mahadev-mukherjee/` |
| Legal | `/editorial-guidelines/`, `/privacy-policy/`, `/hipaa-policy/`, `/terms-of-use/` |
| Sexual health articles | `/porn-induced-erectile-dysfunction/`, `/baking-soda-for-ed/`, `/garlic-and-honey-for-erectile-dysfunction/`, `/home-remedies-for-premature-ejaculation/`, `/premature-ejaculation-exercises/` |
| Nutrient articles | `/lysine-benefit-men-health/`, `/nac-benefits-men/`, `/nadh-benefits/`, `/resveratrol-side-effects/`, `/foods-that-lower-testosterone/` |
| Peptide cluster | `/peptides/`, `/peptides-for-healing/`, `/peptides-for-tendon-repair/`, `/peptides-for-libido/`, `/peptides-for-sleep/`, `/peptides-for-belly-fat/`, `/peptides-for-muscle-growth/`, `/peptides-for-arthritis/`, `/collagen-peptides/` |
| Diet cluster | `/semaglutide-diet/`, `/stillman-diet/` |
| Reviews | `/reviews/` + `/reviews/low-t-center/`, `/reviews/andro-400/`, `/reviews/nugenix-ultimate-testosterone/`, `/reviews/elysium-basis-review/`, `/reviews/revita/` |
| Local SEO (Florida) | `/fl/`, `/fl/miami/trt-therapy/`, `/fl/miami/weight-loss-clinic/`, `/fl/miami/peptide-therapy/`, `/fl/miami/dexascan/`, `/fl/delray-beach/trt-therapy/`, `/fl/delray-beach/weight-loss-clinic/`, `/fl/delray-beach/peptide-therapy/` |
| Sentinel | `/__404__/` → `404.html` (noindex,follow; excluded from sitemap; never linked) |

> **Verification rule:** the authoritative list must be re-extracted from `prerender.mjs` + `src/data/reviews.ts` at migration time, not from this table, in case pages were added since this PRD.

### 3.2 Redirects currently handled client-side in `App.tsx` (must become 301s)

- `/about/*`, `/services/*`, `/peptides/*`, `/dexascans/*`, `/collagen-peptides/*`, `/peptides-for-*/*`, `/semaglutide-diet/*`, `/stillman-diet/*` → their parent page
- Unbuilt city wildcards: `/fl/boca-raton/*`, `/fl/coral-gables/*`, `/fl/fort-lauderdale/*`, `/fl/hialeah/*`, `/fl/hollywood/*`, `/fl/homestead/*`, `/fl/pembroke-pines/*` → `/fl/` (confirm target during implementation; some may intentionally 404)
- Slashless → trailing-slash canonical normalization (currently server behavior)
- Catch-all `*` → 404 page with **real HTTP 404 status**

### 3.3 SEO features that must survive intact

- `PageSeo` behavior: `<title>` = page title + `" | Strong Health"` (root page exempt); meta description; canonical `https://www.stronghealth.com<path-with-trailing-slash>`; OG (`og:title/description/image/url/type`) and Twitter card tags; per-page `robots` (404 page is `noindex,follow`).
- JSON-LD schemas in use: `Organization`, `Article`, `FAQPage`, `MedicalWebPage`, `MedicalClinic`, `MedicalBusiness` (with aggregateRating, openingHours), `Product` (reviews), `CollectionPage`, `BreadcrumbList`, `AboutPage`.
- `sitemap.xml`: generated from the route list; per-route `<lastmod>` resolved from hand-curated `dateModified` (JSON-LD) first, else latest git commit of contributing source files, else build date; per-route `<priority>`/`<changefreq>` (home 1.0/weekly, hubs 0.9, blog/reviews 0.8, careers 0.5, legal 0.4/yearly, articles 0.8/monthly, reviews/authors 0.7); `/__404__/` excluded.
- `robots.txt`, `ads.txt`, `/opengraph.jpg`, `favicon.svg`, author images under `/authors/`.
- Real 404: unknown URLs must return `HTTP 404` with the prerendered 404 page body. Verify post-deploy: `curl -I https://www.stronghealth.com/this-does-not-exist/` → `404`.

### 3.4 Third-party scripts (in `index.html` today)

- GA4 `G-ESG16019L2` (+ `trackLeadEvent()` firing `generate_lead` on all CTA clicks)
- Ahrefs analytics (`data-key="mUsqdURGMvgEYUov5WFjXw"`)
- Google AdSense (`ca-pub-7951814481749634`) + `public/ads.txt`
- Chat widget loader (`src/lib/loadChatWidget.ts`), booking link helper (`src/lib/booking.ts`)

### 3.5 Design system / assets

- Design tokens: bg `#0D0F12`, gold `#C9A84C`, text `#F5F5F0`, muted `#7A8599`; DM Sans (self-hosted, subset woff2 in `public/fonts/`, latin + latin-ext, 400/700/900 + italics)
- Tailwind CSS 4 (via `@tailwindcss/vite`), arbitrary values, no shadcn/radix; Lucide icons; `.prose-strong-health` article prose styles in `index.css`
- Interactive behaviors: scroll fade-in (IntersectionObserver), FAQ accordions, table of contents, accordion food lists, macro donut chart, mobile nav, announcement bar

### 3.6 Known SEO defects to fix during migration (from `SEO_AUDIT.md`)

- Double-brand titles on `/blog/`, `/reviews/`, `/peptides/` (page passes a title already ending in `| Strong Health`)
- Over-budget titles/descriptions on several hub and article pages (final title must be ≤ 60 chars including brand; description 120–160)
- `/careers/` missing `JobPosting` schema; several old-layout articles missing `MedicalWebPage`
- Slashless `path` props on some pages (canonical should always be the trailing-slash URL)

## 4. User Stories

### Phase 0 — Repo & pipeline foundation

### US-001: Scaffold Astro project in new repo
**Description:** As a developer, I want a clean Astro 5 project so all further work has a home with CI from day one.

**Acceptance Criteria:**
- [x] `pnpm create astro` (minimal template), TypeScript strict, `output: 'static'`
- [x] `site: 'https://www.stronghealth.com'` and `trailingSlash: 'always'` in `astro.config.mjs`
- [x] Tailwind 4 via `@tailwindcss/vite`; design tokens defined as CSS theme variables
- [x] DM Sans subset woff2 files copied to `public/fonts/` with `preload` links for the 2 critical weights
- [x] `robots.txt`, `ads.txt`, `favicon.svg`, `opengraph.jpg`, `/authors/*` images copied to `public/`
- [x] GitHub Actions workflow: install → `astro check` → `astro build` on every PR
- [x] `pnpm build` produces `dist/` locally with zero errors

### US-002: Base layout + SEO component
**Description:** As a developer, I want a single `BaseLayout.astro` + `Seo.astro` so every page gets correct head tags from one code path.

**Acceptance Criteria:**
- [ ] `Seo.astro` props: `title`, `description`, `path`, `ogImage?`, `robots?`, `type?`; renders title with single `" | Strong Health"` suffix (root exempt), canonical from `Astro.site` + trailing-slash path, OG + Twitter tags
- [ ] Build fails (CI script) if any page's final title > 60 chars or description outside 120–160 — codifying `SEO_NEW_PAGE_CHECKLIST.md`
- [ ] GA4, Ahrefs, AdSense scripts included in layout head exactly as today (same IDs)
- [ ] `JsonLd.astro` helper renders arbitrary schema objects as `<script type="application/ld+json">`
- [ ] `astro check` passes

### US-003: Shared UI components ported to Astro
**Description:** As a developer, I want Nav, Footer, AnnouncementBar, Btn, Tag, FadeIn, CTABlock, FAQSection, CitationList, MedicalDisclaimer, TableOfContents, AuthorByline ported as zero-JS Astro components.

**Acceptance Criteria:**
- [ ] All listed components render identically to production (visual spot-check)
- [ ] FAQ accordion and accordion food lists use native `<details>/<summary>` (no JS) — FAQ answers present in initial HTML for SEO
- [ ] FadeIn uses a single small IntersectionObserver script (`<script>` in Astro, loaded once) or CSS-only animation; no framework hydration
- [ ] Mobile nav toggle implemented with a ≤ 1 KB inline script or checkbox pattern
- [ ] CTA buttons fire `generate_lead` GA4 event (port `gtag.ts` → small shared script)
- [ ] Zero React/`client:*` directives in these components

### Phase 1 — Page migration (content parity)

### US-004: Homepage
**Description:** As a visitor, I want the homepage identical in content and design, but loading near-instantly.

**Acceptance Criteria:**
- [ ] All sections of `HomePage.tsx` ported; visual parity at 375px/768px/1440px
- [ ] Title/description/canonical/JSON-LD (`Organization`) byte-equivalent in meaning to production
- [ ] Lighthouse mobile Performance ≥ 95; JS transferred < 15 KB
- [ ] Verify in browser using dev-browser skill

### US-005: Article layouts (Blog + Review + Policy)
**Description:** As a developer, I want `BlogArticleLayout.astro`, `ReviewArticleLayout.astro`, `PolicyPageLayout.astro` replicating the three content layout systems, including their content primitives (ArticleH2/H3/P/UL/OL, Callout, CiteRef, StepBox, VerdictBox, ComparisonTable, etc.).

**Acceptance Criteria:**
- [ ] Each primitive exists as an Astro component with the same rendered markup/classes
- [ ] Layout renders byline, TOC, medical disclaimer, FAQ, citations, related links, CTA sections from frontmatter/props
- [ ] Article/FAQPage/MedicalWebPage/Breadcrumb JSON-LD emitted from one structured data source per page (no drift between visible FAQ and FAQPage schema — generated from same array)
- [ ] `.prose-strong-health` styles ported

### US-006: Migrate all 20 article pages (sexual health ×5, nutrients ×5, peptides ×9, dexa-scan)
**Description:** As a reader, I want every article preserved word-for-word with identical URLs and schema.

**Acceptance Criteria:**
- [ ] Content ported into Astro pages (or MDX with layout) — text content diff vs. production HTML shows no meaningful differences
- [ ] Every page: same URL, title (fixing over-length only where SEO_AUDIT flags it — see US-013), description, canonical, JSON-LD types
- [ ] Internal links preserved (same hrefs)
- [ ] Citations render with same numbering/links

### US-007: Migrate diet cluster + diet components
**Description:** As a reader, I want `/semaglutide-diet/` and `/stillman-diet/` with their specialized components (EvidenceQualityBadge, VisualScorecard, MacroProfileCard, DietComparisonTable, AccordionFoodList, SampleMealPlan, ContextualCTA).

**Acceptance Criteria:**
- [ ] Donut chart (MacroProfileCard) rendered as static SVG at build time — no client JS
- [ ] All 7 diet components visually match production
- [ ] FAQPage/MedicalWebPage/Article schema parity

### US-008: Migrate reviews hub + 5 review pages
**Description:** As a reader, I want the reviews cluster with verdicts, comparison tables, and Product schema intact.

**Acceptance Criteria:**
- [ ] `/reviews/` hub lists reviews from the same shared data module pattern (`src/data/reviews.ts`) so hub, footer, and sitemap can't drift
- [ ] 5 review pages with Product/Article/FAQPage schema parity

### US-009: Migrate local SEO pages (`/fl/` + Miami ×4 + Delray ×3)
**Description:** As a local searcher, I want city landing pages preserved (hero, symptoms, USPs, map, physicians, testimonials, neighborhoods, FAQ) with MedicalClinic schema.

**Acceptance Criteria:**
- [ ] City pages built from shared config files (`cityTrtConfig.ts`, etc.) ported as typed data → one `.astro` template per page type, mirroring today's CityTRTPage/CityWeightLossPage/CityPeptidePage pattern
- [ ] MedicalClinic/MedicalWebPage/FAQPage/Breadcrumb JSON-LD parity (NAP data identical — from `miamiClinic.ts`)
- [ ] Clinic map embed loads lazily (facade or `loading=lazy`) so it doesn't hurt LCP

### US-010: Core pages (blog index, services, about, careers, authors, legal)
**Description:** As a visitor, I want all remaining pages migrated.

**Acceptance Criteria:**
- [ ] `/blog/` lists articles from a single `articles.ts`-equivalent data source
- [ ] `/services/` 11-card hub; `/about/` with MedicalBusiness schema; authors pages with byline linkage
- [ ] 4 legal pages via PolicyPageLayout
- [ ] All pass the CI SEO length checks

### Phase 2 — SEO infrastructure

### US-011: Sitemap with lastmod parity
**Description:** As a search engine, I want `sitemap.xml` functionally identical to today's.

**Acceptance Criteria:**
- [ ] Custom sitemap generation (Astro integration or postbuild script) emitting per-route `<lastmod>`, `<priority>`, `<changefreq>` per the rules in §3.3
- [ ] `lastmod` = hand-curated `dateModified` when present, else latest git commit of the page's source file(s), else build date
- [ ] 404 and any noindex routes excluded
- [ ] XML validates; diff vs. production sitemap shows only expected differences

### US-012: Redirects + 404 on Vercel
**Description:** As a search engine and user, I want old wildcard paths to 301 and unknown URLs to return real 404s.

**Acceptance Criteria:**
- [ ] `vercel.json` `redirects` (permanent: true) for every §3.2 mapping; trailing-slash normalization via Astro/Vercel config (no redirect chains: slashless → canonical in ONE hop)
- [ ] Astro `src/pages/404.astro` builds `404.html`; Vercel serves it with HTTP 404 (default static behavior — verify)
- [ ] `curl -I` checks: known page → 200; slashless → single 308/301 to trailing slash; `/services/anything` → 301 to `/services/`; garbage URL → 404
- [ ] 404 page is `noindex,follow`, not in sitemap, no internal links to it

### US-013: Fix known SEO defects
**Description:** As the site owner, I want the SEO_AUDIT.md failures fixed in the new build, not carried over.

**Acceptance Criteria:**
- [ ] No double-brand titles anywhere (Seo.astro makes it structurally impossible)
- [ ] All final titles ≤ 60 chars; all descriptions 120–160 (CI-enforced)
- [ ] `JobPosting` schema on `/careers/` (if roles are listed); `MedicalWebPage` added to flagged articles
- [ ] All canonicals trailing-slash
- [ ] Title changes logged in a `CHANGES-FROM-PRODUCTION.md` so ranking shifts can be traced

### Phase 3 — Verification & cutover

### US-014: Automated parity audit
**Description:** As the site owner, I want proof nothing regressed before DNS cutover.

**Acceptance Criteria:**
- [ ] Script crawls production sitemap URLs on both prod and Vercel preview; diffs per URL: HTTP status, title, description, canonical, robots, JSON-LD types, H1, word count (±5%)
- [ ] Report checked into repo; all diffs either "expected (US-013 fix)" or resolved
- [ ] Internal link crawl: zero broken internal links on preview
- [ ] Lighthouse CI run on 8 representative pages (home, hub, article, review, local, legal, blog, 404): all ≥ 95 mobile performance

### US-015: Vercel production cutover
**Description:** As the site owner, I want www.stronghealth.com served by Vercel with zero downtime.

**Acceptance Criteria:**
- [ ] Vercel project linked to GitHub repo; production branch = `main`; preview deploys on PRs
- [ ] Domain `www.stronghealth.com` (+ apex redirect to www) added to Vercel; DNS switched; TLS active
- [ ] Cache headers: hashed assets immutable 1-year; HTML must-revalidate (Vercel defaults acceptable — verify)
- [ ] Post-cutover smoke: 200s on all 46 URLs, 404 check, sitemap fetchable, GSC sitemap resubmitted
- [ ] GA4 receiving events; `generate_lead` fires on CTA click
- [ ] Replit deployment kept alive but idle for 2 weeks as rollback, then decommissioned

## 5. Functional Requirements

- FR-1: All 46 indexable URLs must resolve with HTTP 200 at identical paths (trailing slash) on the new site.
- FR-2: Every page must render complete content in initial HTML (no client-side rendering of content).
- FR-3: `Seo` component must be the only mechanism for head tags; direct `<title>`/meta in pages is forbidden (lint rule or convention documented in README).
- FR-4: JSON-LD must be generated from typed data structures shared with visible content (FAQs, authors, clinic NAP, review verdicts) — single source of truth.
- FR-5: The build must fail if: any title > 60 chars, description outside 120–160, missing canonical, page not in sitemap (unless explicitly excluded), or broken internal link.
- FR-6: All §3.2 redirects must be permanent (301/308) server-side redirects defined in `vercel.json`.
- FR-7: Unknown URLs must return HTTP 404 with the branded 404 page.
- FR-8: `sitemap.xml` must be regenerated on every build following §3.3 rules.
- FR-9: GA4, Ahrefs, and AdSense must load with the same IDs; analytics scripts must not block rendering (async/deferred, as today).
- FR-10: Fonts must be self-hosted subset woff2 with preload for above-the-fold weights; no external font requests.
- FR-11: Zero React runtime in production output; any interactivity implemented with native HTML/CSS or vanilla scripts ≤ 15 KB total per page.
- FR-12: Images must use `astro:assets` (or equivalent) with explicit dimensions, responsive `srcset`, lazy loading below the fold, and modern formats (AVIF/WebP with fallback).
- FR-13: Repo must contain: `README.md` (setup, add-a-page guide), CI workflow, `vercel.json`, this PRD, and the parity audit script.
- FR-14: Old monorepo content is the canonical source during migration; the repo must record the source commit SHA (`9398453`) migrated from.

## 6. Non-Goals (Out of Scope)

- No redesign — visual output should be indistinguishable from production (except documented SEO fixes).
- No CMS integration (content stays in-repo as Astro/MDX/data files).
- No migration of the monorepo's `api-server`, database (`lib/db`), OpenAPI codegen, or `scripts` package — the static site has no backend today; none is created.
- No new content pages, no content rewrites (title/description trims per US-013 are the only text changes).
- No i18n, no dark/light theming, no A/B testing infrastructure.
- No changes to GA4 property, AdSense account, or Ahrefs setup.

## 7. Technical Considerations

- **Astro config:** `output: 'static'`, `trailingSlash: 'always'`, `site` set — Astro then emits `/path/index.html`, matching current URL structure exactly.
- **Content strategy:** long articles → MDX with typed frontmatter (title, description, dateModified, author, faqs[], citations[]); heavily componentized pages (home, local, diet) → `.astro` pages. Shared data (`articles.ts`, `reviews.ts`, `miamiClinic.ts`, `articleAuthors.ts`, city configs) ports nearly as-is to `src/data/`.
- **Why not React islands:** nothing on the site needs client state. FAQ accordions, food lists → `<details>`; TOC → build-time generated; donut chart → build-time SVG; fade-ins → one shared IntersectionObserver script. This is the core performance win.
- **Sitemap lastmod:** requires full git history at build time — Vercel does shallow clones (`VERCEL_DEEP_CLONE=true` env var or fetch-unshallow step needed). Fallback chain (dateModified → git → build date) already tolerates this; decide and document.
- **Trailing slash on Vercel:** set `"trailingSlash": true` in `vercel.json` so slashless requests 308 in one hop and never serve duplicate content.
- **404 status:** Vercel serves `404.html` with a real 404 status for static builds — this removes the entire reason `server.mjs` exists. Verify explicitly in US-012 anyway.
- **AdSense/GA4 vs. performance:** these third-party scripts are the biggest remaining perf cost. Keep them async (as today); do NOT move to Partytown in v1 (AdSense compatibility risk). Measure with and without.
- **Fonts:** current `subset-fonts.mjs` step becomes unnecessary if the already-subset woff2 files are committed; keep the script in-repo only if future subsetting is expected.
- **Replit git history:** new repo starts fresh (clean history). The old repo remains at `github.com/ErikfRivera/Strong-Health-Home` and Replit for reference. Record source SHA in first commit message.
- **Risk — content fidelity:** 20+ long medical articles hand-ported from JSX. Mitigate with the US-014 word-count/H1/heading diff and by porting text via the *rendered production HTML* (crawl) rather than re-typing from JSX.

## 8. Success Metrics

- 100% of the 46 URLs return 200 with parity-audit-clean metadata before cutover (US-014 report).
- Lighthouse mobile Performance ≥ 95 and green CWV on all audited templates (vs. current baseline — capture baseline before migration).
- JS transferred per content page < 15 KB (currently ≥ React runtime + page chunk).
- No drop > 5% in organic impressions/clicks (GSC) in the 4 weeks post-cutover, after which the migration is declared stable.
- New article page can be added and deployed in < 30 minutes following the README guide.

## 9. Open Questions

1. **City wildcard redirects** (`/fl/boca-raton/*` etc.): 301 to `/fl/` or intentionally 404? Today they render pages via wildcards — confirm actual behavior per city before writing `vercel.json`.
2. **Apex domain:** does `stronghealth.com` (no www) currently redirect to www? Replicate exactly on Vercel.
3. **Chat widget:** keep the current third-party chat widget, and should it load on idle/interaction to protect INP?
4. **Careers JobPosting:** are there live openings to structure, or should `/careers/` stay schema-light?
5. **Blog index growth:** any near-term plan for content collections/pagination that should shape the MDX structure now?
6. **`/fl/miami/dexascan/` vs `/dexascans/*` redirect:** confirm the canonical dexa URL set — App.tsx routes both `/dexa-scan` and a `/dexascans/*` wildcard.

---

## Appendix A — Proposed repo structure

```
strong-health-astro/
├── astro.config.mjs          # static output, trailingSlash always, site URL
├── vercel.json               # redirects (§3.2), trailingSlash, headers
├── package.json              # pnpm, Astro 5, Tailwind 4
├── tasks/
│   └── prd-astro-migration.md
├── scripts/
│   ├── audit-parity.mjs      # US-014 crawler/differ
│   └── check-seo.mjs         # CI title/description/canonical/link checks
├── public/
│   ├── fonts/ robots.txt ads.txt favicon.svg opengraph.jpg authors/
├── src/
│   ├── layouts/              # BaseLayout, BlogArticleLayout, ReviewArticleLayout, PolicyPageLayout
│   ├── components/
│   │   ├── seo/              # Seo.astro, JsonLd.astro, schema builders
│   │   ├── shared/           # Nav, Footer, Btn, FAQSection, ...
│   │   └── diet/             # scorecards, macro card, meal plan, ...
│   ├── data/                 # articles.ts, reviews.ts, authors.ts, miamiClinic.ts, city configs
│   ├── content/              # MDX article bodies (typed frontmatter)
│   ├── pages/                # mirrors URL structure; 404.astro
│   └── styles/               # global.css (tokens, prose-strong-health)
└── .github/workflows/ci.yml  # check + build + SEO checks + link check
```

## Appendix B — Cutover checklist (condensed)

1. Freeze content changes on Replit.
2. Final parity audit (US-014) against latest production.
3. Add domain to Vercel project; lower DNS TTL 24h ahead.
4. Switch DNS `www` CNAME → Vercel; apex per Vercel instructions.
5. Smoke test (FR checks); resubmit sitemap in Google Search Console; use URL Inspection on 3 key pages.
6. Watch GSC coverage + CWV, GA4 realtime, Vercel logs for 404 spikes.
7. Keep Replit deploy as rollback for 14 days.
