# PRD: StrongHealth.com — 100% Peptide Repositioning, Molecule Layer & Internal-Link Rebuild

**Owner:** Erik Rivera
**Property:** [www.stronghealth.com](https://www.stronghealth.com)
**Stack:** Astro + Vercel (this repo: `strong-health-astro`)
**Status:** Updated after codebase audit — ready for implementation
**Last updated:** 2026-07-18

---

## 1. Introduction / Overview

StrongHealth.com is being repositioned from a mixed TRT / men's-health / supplement-review site into a **single-theme, physician-supervised peptide therapy authority site** with a multi-location footprint.

The site already has strong assets: clean 503A/503B compounding-pharmacy positioning, named-physician E-E-A-T (Dr. Angel Rivera, M.D.), PubMed-cited guides, a JTBD-organized `/peptides/` hub, and 8 location pages. But three structural problems are capping performance:

1. **Diluted site theme.** Residual TRT/testosterone signals in the footer tagline, sitewide default OG alt text, copyright ("Strong Health TRT"), the `organizationSchema()` description/OfferCatalog, and a set of TRT/regenerative/supplement service pages confuse Google about what the site is about.
2. **PageRank leaking to off-topic pages.** The supplement-review pages are the *only* page-1 rankers and are sitewide-linked from the footer (a whole "Reviews" column on every page), bleeding internal link equity away from peptide spokes.
3. **Goal-only taxonomy with no molecule layer.** The site targets *goals* (belly fat, sleep, libido) but has almost no pages targeting *molecule* searches (BPC-157, CJC-1295, etc.), where a large share of peptide search volume and long-tail intent lives.

The measured symptom: every high-value peptide page is stranded on page 3–5 despite good content.

| Page | Target keyword | Volume | Current position |
|---|---|---|---|
| /peptides-for-muscle-growth/ | peptides for muscle growth | 21,000 | 32 |
| /peptides-for-muscle-growth/ | peptides for muscle | 5,700 | 39 |
| /peptides-for-muscle-growth/ | peptides bodybuilding | 4,400 | 44 |
| /peptides-for-sleep/ | peptides for sleep | 1,700 | 40 |
| /peptides-for-sleep/ | dsip peptide benefits | 1,200 | 30 |
| /peptides-for-tendon-repair/ | peptides for tendon repair | 350 | **1** |

The tendon-repair page proving #1 is achievable (tight title match, fewer competing internal targets) is the template. This PRD closes the gap for the rest.

**Decisions locked for this PRD:**

- **Reviews:** KEEP the supplement-review pages (they hold the site's only page-1 rankings and ~50% of organic traffic). But **isolate** them so they stop leaking equity into the peptide theme.
- **TRT:** REMOVE all TRT *service* pages and residual TRT branding. Peptides become the sole service theme.
- **Molecule layer:** Full library — **17 molecule pages** at launch.
- **Locations:** Hold at the current 8 metros; **deepen** them rather than scale new cities.
- **Stack:** Astro + Vercel (this repo).

---

## 1.1 Codebase audit findings (what changed in this revision)

This revision was produced by auditing the draft against the repo. Deltas from the draft:

1. **The homepage is already peptide-primary.** `src/pages/index.astro` ships "Physician-Supervised Peptide Therapy | Strong Health" title/description and peptide hero copy (PR #14, merged). The 404 page already routes users to the peptide hub. US-002 is therefore about the *shared chrome and supporting pages*, not the homepage hero.
2. **There are 5 review pages, not 4.** `src/data/reviews.ts` registers Low T Center, Andro 400, Nugenix, Elysium Basis, and Revita. Low T Center is a *TRT-clinic* review — extra reason it must not sit in sitewide chrome.
3. **The legacy service inventory is larger than the draft's list.** Beyond the four TRT/weight-loss city pages, the repo also has `/services/` (a single "Men's Health Services" page, not multiple variants), `/fl/miami/prp-therapy/`, and `/fl/miami/stem-cell-therapy/`. The FL hub (`/fl/`) is titled "South Florida TRT & Men's Health Clinics." All are handled in US-001/US-010.
4. **The "9 clinics" copy is wrong on two axes.** `/peptides/` (`src/pages/peptides.astro` lines ~143, ~150, ~372, ~416) claims "9 South Florida clinics" / "nine clinic locations." Reality per the city configs: **2 South Florida clinic locations** (Miami Brickell; Delray Beach Atlantic Avenue) plus **6 telehealth metros** (Tampa, NYC, San Diego, Las Vegas, Atlanta, Austin) = 8 metros total, spanning 6 states — not South Florida. Note an internal contradiction to resolve: `/fl/` describes Delray as a physical clinic, while `cityPeptideConfig.ts` describes Delray patients as telehealth-served with in-person baselines at Brickell.
5. **TRT residue is wired into shared data/templates, not just page copy.** Confirmed locations: footer tagline + "Strong Health TRT" copyright + TRT-led Services column (`src/components/shared/Footer.astro`); sitewide `DEFAULT_OG_IMAGE_ALT` = "…men's health and TRT clinic…" (`src/components/seo/Seo.astro:25`); `organizationSchema()` description ("Physician-supervised testosterone replacement therapy…") and OfferCatalog with TRT as the lead service (`src/components/seo/schemas.ts`); nav Locations dropdown leads with "{City} TRT Therapy" (`src/components/shared/Nav.astro`); `/about/`, `/careers/`, `/blog/` ("Evidence-Based Men's Health Blog") copy.
6. **"Strong Health TRT, LLC" in `/terms-of-use/` appears to be the registered legal entity.** Renaming a legal entity is not a copy edit — carved out of US-002 as an owner/legal decision (see Open Questions).
7. **There is off-theme editorial the draft didn't address:** 5 sexual-health articles (baking-soda-for-ed, garlic-and-honey ED, porn-induced ED, 2 premature-ejaculation guides) and 5 "Men's Health Nutrients" articles. New US-010 covers rethemeing the blog shell and re-pointing these pages' internal links; the articles themselves are kept (they carry long-tail traffic).
8. **The repo has hard build/QA gates this work must pass or intentionally retire:** a byte-parity test suite against the old production build (`tests/parity/`, ~606 assertions over 47 routes) that a retheme *will* break by design; `scripts/check-seo.mjs` (title ≤ 60 chars including " | Strong Health", description 120–160, waiver system in `docs/waivers/`); `scripts/generate-sitemap.mjs` (postbuild); `scripts/check-redirects.mjs` + `tests/fixtures/redirect-manifest.json` (single-hop/no-loop validation). New US-011 owns updating these.
9. **House pattern for "links that can never drift":** Nav, Footer, hubs, and sitemap are generated from shared data modules (`src/data/articles.ts`, `reviews.ts`, `src/data/local/cityPeptideConfig.ts` etc.). The molecule layer must follow this pattern — a `molecules` data module drives the hub, nav, cross-links, and goal↔molecule mapping programmatically (Section 7).
10. **Schema builders exist but are incomplete for this PRD.** `schemas.ts` already has `medicalWebPageSchema`, `faqPageSchema`, `breadcrumbSchema`, `organizationSchema`, `collectionPageSchema`, and review builders. It has **no Physician or MedicalClinic builder** — US-008 adds them. New pages must NOT be added to `PROD_SLASHLESS_PATHS` (that set is a production-parity quirk frozen to legacy routes; new pages emit trailing-slash schema URLs).
11. **The "4.9 from 2,500+ verified patient reviews" claim** renders twice on the homepage (`index.astro` ~lines 234, 550) and currently has **no AggregateRating schema behind it**. Kept as an Open Question with the YMYL recommendation intact.

---

## 2. Goals

- Establish a single, unambiguous **peptide therapy** site theme readable by search engines and LLMs.
- Remove all TRT/regenerative service pages and TRT brand residue; 301 redirect cleanly with zero orphaned URLs or 404s.
- Contain the supplement-review pages so they retain their own rankings **without** diluting the peptide theme or leaking sitewide link equity.
- Ship a **17-page molecule library** interlinked with the existing goal guides (molecule ↔ goal cross-linking).
- Rebuild internal linking into a disciplined **hub → spoke → location** architecture with descriptive anchors, concentrating authority on commercial peptide pages.
- Deepen the 8 existing location pages with local schema, named physicians, maps, and molecule cross-links.
- Add complete structured data (MedicalWebPage, FAQPage, Physician, MedicalClinic, Review/AggregateRating).
- Move the priority goal-guide keywords from page 3–4 into page 1–2 within 2 quarters.

---

## 3. Information Architecture (Target State)

```
/                                    Homepage (peptide-primary — DONE, PR #14)
/peptides/                           Goal hub (exists — enhance; fix "9 clinics" copy)
/molecules/                          NEW molecule hub

  GOAL SPOKES (exist — enhance)
  /peptides-for-healing/
  /peptides-for-tendon-repair/
  /peptides-for-arthritis/
  /peptides-for-belly-fat/
  /peptides-for-muscle-growth/
  /peptides-for-weight-loss/
  /peptides-for-libido/
  /peptides-for-sleep/
  /peptides-for-anti-aging/
  /collagen-peptides/

  MOLECULE SPOKES (NEW — 17)
  /molecules/bpc-157/
  /molecules/tb-500/
  /molecules/cjc-1295/
  /molecules/ipamorelin/
  /molecules/sermorelin/
  /molecules/tesamorelin/
  /molecules/pt-141/
  /molecules/dsip/
  /molecules/aod-9604/
  /molecules/ghk-cu/
  /molecules/mots-c/
  /molecules/semaglutide/
  /molecules/tirzepatide/
  /molecules/ll-37/
  /molecules/epithalon/
  /molecules/kisspeptin/
  /molecules/selank/

  LOCATIONS (exist — deepen; hold at 8 metros)
  /fl/                               FL hub (retitle: peptide-primary)
  /fl/miami/peptide-therapy/         (physical clinic — Brickell)
  /fl/delray-beach/peptide-therapy/  (physical clinic — Atlantic Ave; see OQ-1)
  /fl/tampa/peptide-therapy/         (telehealth)
  /ny/new-york/peptide-therapy/      (telehealth)
  /ca/san-diego/peptide-therapy/     (telehealth)
  /nv/las-vegas/peptide-therapy/     (telehealth)
  /ga/atlanta/peptide-therapy/       (telehealth)
  /tx/austin/peptide-therapy/        (telehealth)

  REVIEWS (KEEP but ISOLATE — see US-003; 5 children)
  /reviews/  → low-t-center, andro-400, nugenix-ultimate-testosterone,
               elysium-basis-review, revita

  SUPPORTING (keep — retheme copy per US-010)
  /blog/, /about/, /careers/, /author/dr-angel-rivera/,
  /author/mahadev-mukherjee/, /editorial-guidelines/, legal
  Editorial articles: 8 peptide guides (above), 2 diet guides, 5 nutrient
  articles, 5 sexual-health articles, /dexa-scan/ article, /pollotarianism/,
  /detox-diet/, /semaglutide-diet/, /stillman-diet/
```

**Removed (301):**

| URL | Redirect to | Notes |
|---|---|---|
| `/services/` | `/peptides/` | single "Men's Health Services" page |
| `/fl/miami/trt-therapy/` | `/fl/miami/peptide-therapy/` | |
| `/fl/delray-beach/trt-therapy/` | `/fl/delray-beach/peptide-therapy/` | |
| `/fl/miami/weight-loss-clinic/` | `/fl/miami/peptide-therapy/` | GLP-1 intent survives on peptide page + `/peptides-for-weight-loss/` |
| `/fl/delray-beach/weight-loss-clinic/` | `/fl/delray-beach/peptide-therapy/` | |
| `/fl/miami/prp-therapy/` | `/fl/miami/peptide-therapy/` | recommended — see OQ-5 |
| `/fl/miami/stem-cell-therapy/` | `/fl/miami/peptide-therapy/` | recommended — see OQ-5 |
| `/fl/miami/dexascan/` | (keep, reframed) or `/fl/miami/peptide-therapy/` | OQ-2 |

Existing `vercel.json` redirects (old subpaths, retired FL cities, `/dexascans/` →
dexascans.com) stay; new rules must not create chains through them.

**Linking rules (enforced sitewide):**

- Hub → every spoke in its cluster.
- Every spoke → its hub + 2–3 sibling spokes, descriptive anchors ("peptides for muscle growth," never "read the guide").
- Every **goal** spoke → the **molecules** it uses; every **molecule** spoke → the **goals** it serves. (Bidirectional, generated from the `molecules` data module — Section 7.)
- Every **location** page → the relevant goal + molecule spokes.
- Blog/editorial posts (NAC, lysine, resveratrol, NADH, diets, sexual-health, dexa-scan) → link UP into molecule/goal spokes and hubs (e.g., ED/PE articles → PT-141 + `/peptides-for-libido/`; semaglutide-diet → `/molecules/semaglutide/`).
- **Reviews get NO sitewide footer links** and do not link into the peptide theme (see US-003).

---

## 4. User Stories

### US-001: Remove legacy service pages and 301 redirect

**Description:** As the site owner, I want all TRT/weight-loss/regenerative service pages removed and redirected so the site presents a single peptide theme with no dead ends.

**Acceptance Criteria:**
- [ ] Remove the 6 (or 8, pending OQ-2/OQ-5) page files listed in the "Removed (301)" table and their entries in `cityTrtConfig.ts` / `cityWeightLossConfig.ts` / `cityPrpConfig.ts` consumers (Nav, Footer, `/fl/` hub, `ArticleLocationsSection`, `defaultRelatedInternalLinks` in `cityLocalProof.ts`).
- [ ] Cross-check the removal list against an Ahrefs top-pages export before deploy (catch any URL variant with backlinks that needs its own rule).
- [ ] Each removed URL has a 301 in `vercel.json` per the table; no redirect chains (single hop) and no loops — including through the pre-existing rules.
- [ ] `tests/fixtures/redirect-manifest.json` updated; `node scripts/check-redirects.mjs` passes in static mode (and live mode post-deploy).
- [ ] Sitemap regenerates without removed URLs (`scripts/generate-sitemap.mjs` runs postbuild — verify output).
- [ ] Post-deploy crawl shows zero 404s and zero internal links to removed URLs.
- [ ] `pnpm build` passes (including check-seo).

### US-002: Purge residual TRT branding from shared chrome, data, and schema

**Description:** As the site owner, I want all TRT/testosterone brand residue removed from the templates and data modules every page inherits, so Google and LLMs read a single peptide identity.

**Acceptance Criteria:**
- [ ] `Footer.astro`: tagline ("Physician-supervised testosterone therapy…") replaced with peptide-primary copy; copyright "Strong Health TRT" → "Strong Health"; `serviceLinks` column rebuilt around peptide services (goal hub, molecule hub, labs/monitoring) — no `/services/` targets, and the external "Dexascans" link moves out of the Services column (single Locations-column mention at most, pending OQ-2).
- [ ] `Seo.astro`: `DEFAULT_OG_IMAGE_ALT` no longer references "men's health and TRT clinic"; peptide-primary replacement. (This default applies sitewide, not just the homepage.)
- [ ] `schemas.ts` `organizationSchema()`: description rewritten peptide-primary; OfferCatalog leads with Peptide Therapy and drops the TRT and Sexual Health service offers (Lab Testing may stay).
- [ ] `Nav.astro`: Locations dropdown city groups lead with "{City} Peptide Therapy"; no TRT/weight-loss links remain.
- [ ] `/fl/` hub retitled/rewritten peptide-primary ("South Florida TRT & Men's Health Clinics" → peptide equivalent); FAQ copy updated (currently leads with TRT as a core service).
- [ ] Grep of the built `dist/` output for `trt`, `testosterone therapy` (case-insensitive) returns only intentional, contextual mentions (e.g., "can be combined with TRT" inside guide copy, review-page content, and the legal entity name pending OQ-6) — no navigational/brand TRT.
- [ ] **Carve-out:** "Strong Health TRT, LLC" in `/terms-of-use/` is the registered entity name — do NOT change without owner/legal sign-off (OQ-6).
- [ ] `pnpm build` passes.

### US-003: Isolate the supplement-review section

**Description:** As the site owner, I want the 5 review pages (Low T Center, Andro 400, Nugenix, Elysium Basis, Revita) to keep ranking on their own while no longer diluting the peptide theme or leaking sitewide equity.

**Acceptance Criteria:**
- [ ] Remove the "Reviews" column from `Footer.astro` (it is generated from `reviews.ts` on every page) and any `/reviews/*` links from `Nav.astro`.
- [ ] Reviews are reachable only via a single `/reviews/` index link (one footer link or from About) — not sitewide-expanded.
- [ ] Review pages do NOT link into peptide spokes/hub with commercial anchors.
- [ ] Review pages retain internal links among themselves (hub-and-spoke within `/reviews/`, as `ReviewArticleLayout` already provides).
- [ ] No peptide spoke or location page links out to a review page.
- [ ] Review pages keep their existing Review/Product structured data (`buildReviewStructuredData`) — no schema regression.
- [ ] Verify in browser that all 5 review pages still render, still self-interlink, and are still indexable (no accidental noindex).
- [ ] `pnpm build` passes.

### US-004: Build the `/molecules/` hub page

**Description:** As a patient researching a specific peptide, I want a hub that lists every molecule so I can navigate to the one I care about.

**Acceptance Criteria:**
- [ ] `/molecules/` lists all 17 molecule pages, grouped (Healing/Repair, GH Secretagogues, Metabolic/GLP-1, Sexual Health, Sleep, Longevity, Cosmetic/Other), rendered from the `molecules` data module.
- [ ] Each molecule card shows name, aliases, primary use, and a descriptive-anchor link.
- [ ] Hub links up to `/peptides/` (goal hub) and to `/`; the two hubs cross-link bidirectionally.
- [ ] Breadcrumb: Home › Molecules.
- [ ] MedicalWebPage (or CollectionPage, matching `/peptides/`'s current pattern) + BreadcrumbList schema present.
- [ ] Global nav "Peptides" menu updated to expose both "Browse by Goal" (`/peptides/`) and "Browse by Molecule" (`/molecules/`).
- [ ] Title ≤ 60 chars including " | Strong Health"; description 120–160 (check-seo gate).
- [ ] Verify in browser (desktop 1440 + mobile 375, matching NYC-PRD convention).
- [ ] `pnpm build` passes.

### US-005: Build 17 molecule spoke pages (template)

**Description:** As a patient, I want a physician-reviewed page per molecule covering what it is, uses, dosing context, evidence, safety, and how StrongHealth prescribes it.

**Acceptance Criteria (per page):**
- [ ] URL `/molecules/[slug]/`; H1 = molecule name; title targets `[molecule]` head term + modifiers (within the 60-char gate).
- [ ] Sections: What it is / Mechanism / What it's used for / Evidence (PubMed-cited, via the existing `CitationList` component) / Dosing & administration context / Safety & side effects / How StrongHealth prescribes it (503A/503B, labs, monitoring) / FAQ.
- [ ] Meta description (120–160), canonical, OG all molecule-specific.
- [ ] Bidirectional links: molecule → each goal spoke that uses it; goal spokes link back (US-006). Generated from the `molecules` data module `goals[]` field — not hand-authored.
- [ ] Links to `/molecules/` hub + 2–3 sibling molecules with descriptive anchors.
- [ ] "Get [molecule] under physician supervision" CTA → existing `BOOKING_SMS_HREF` free-assessment action; links to relevant location pages (reuse `PeptideLocationsSection`).
- [ ] MedicalWebPage + FAQPage + Physician (Dr. Rivera as reviewer) + BreadcrumbList schema; FAQ visible text and FAQPage JSON-LD generated from the same array (house pattern).
- [ ] Trailing-slash schema URLs (do NOT extend `PROD_SLASHLESS_PATHS`).
- [ ] Medical-reviewer byline links to `/author/dr-angel-rivera/` (existing `AuthorByline`).
- [ ] Content is original, physician-reviewed tone, YMYL-safe (no dosing claims presented as prescriptions; framed as clinical context).
- [ ] Verify in browser.
- [ ] `pnpm build` passes.

**Molecule → goal mapping (single source of truth for the `goals[]` field):**

- BPC-157 → healing, tendon-repair, arthritis
- TB-500 → healing, tendon-repair, arthritis
- CJC-1295 → muscle-growth, anti-aging, sleep
- Ipamorelin → muscle-growth, sleep, anti-aging
- Sermorelin → anti-aging, muscle-growth
- Tesamorelin → belly-fat, weight-loss
- PT-141 → libido
- DSIP → sleep
- AOD-9604 → belly-fat, weight-loss
- GHK-Cu → anti-aging, healing, collagen
- MOTS-c → anti-aging, weight-loss
- Semaglutide → weight-loss, belly-fat
- Tirzepatide → weight-loss, belly-fat
- LL-37 → healing
- Epithalon → anti-aging
- Kisspeptin → libido, anti-aging
- Selank → sleep, anti-aging (anxiety/cognition context)

### US-006: Retro-fit goal spokes with molecule cross-links + on-page optimization

**Description:** As the site owner, I want the existing goal guides to link to the new molecule pages and to be tuned so their priority keywords move to page 1.

**Acceptance Criteria:**
- [ ] Each goal spoke links to every molecule it references, with descriptive anchors. Implementation note: goal-spoke bodies live as static HTML in `src/content/fragments/*.html` — either edit fragments in place or (preferred) inject a "Molecules used in this guide" module from the layout, driven by the `molecules` data module, so links can't drift.
- [ ] Each goal spoke links to `/peptides/` hub + 2–3 sibling goal spokes.
- [ ] Title/H1/intro on `/peptides-for-muscle-growth/` tightened toward "peptides for muscle growth" and its cluster (currently pos 32 for a 21k term).
- [ ] `/peptides-for-sleep/` tuned for "peptides for sleep" + "dsip peptide benefits" cluster (DSIP section links to `/molecules/dsip/`).
- [ ] Remove any links from goal spokes to review pages (per US-003).
- [ ] Verify in browser.
- [ ] `pnpm build` passes.

### US-007: Deepen the 8 location pages

**Description:** As a local patient, I want location pages that feel genuinely local and name a real physician, so I trust and convert.

**Acceptance Criteria:**
- [ ] Each location page names a licensed physician for that state (or a clearly attributed regional medical lead) — replaces the "Strong Health Medical Team" placeholder entries in `cityPeptideConfig.ts` `physicians[]` (the field already exists; Miami already names Dr. Rivera). Resolves the contradiction with the site's "named doctors" USP. (Names pending OQ-3.)
- [ ] MedicalClinic/LocalBusiness schema with NAP + geo on the physical FL clinic pages, including a map embed; telehealth metros keep MedicalWebPage-only (per the NYC-PRD precedent: no MedicalClinic where there's no clinic — that's the YMYL-safe pattern).
- [ ] Each location page links to the relevant **goal** spokes AND **molecule** spokes (extend the config's related-links to include molecules).
- [ ] Location copy standardized sitewide per the audited facts: **2 South Florida clinic locations + telehealth in 8 metros across 6 states.** Fix all four "9 clinics"/"nine clinic locations"/"9 South Florida clinics" instances in `peptides.astro`; sweep the rest of the site (nav, hub, footer, FAQ copy).
- [ ] Delray physical-vs-telehealth status made consistent between `/fl/` and `cityPeptideConfig.ts` (OQ-1), then reflected across nav, hub, and page body.
- [ ] Verify in browser.
- [ ] `pnpm build` passes.

### US-008: Sitewide structured data + trust signals

**Description:** As the site owner, I want complete schema so the site earns rich results and reinforces YMYL trust.

**Acceptance Criteria:**
- [ ] New builders in `schemas.ts`: `physicianSchema` (Dr. Angel Rivera, referenced from every medically-reviewed page) and `medicalClinicSchema` (physical locations). Reuse existing `faqPageSchema` / `medicalWebPageSchema` / `breadcrumbSchema` everywhere else.
- [ ] FAQPage schema on all pages with FAQs (homepage, hubs, locations, molecule pages) — visible text and JSON-LD from the same array.
- [ ] Review/AggregateRating schema backing the homepage "4.9 from 2,500+ verified patient reviews" claim (`index.astro` renders it twice), **or the claim is removed/adjusted if not substantiable — YMYL risk** (OQ-4). No AggregateRating currently exists for it.
- [ ] `organizationSchema()` (MedicalBusiness) updated per US-002 and kept on the homepage.
- [ ] All schema validates in Google Rich Results Test with zero errors.
- [ ] `pnpm build` passes.

### US-009: Redirect, sitemap & crawl QA

**Description:** As the site owner, I want a clean crawl and correct indexation signals after the restructure.

**Acceptance Criteria:**
- [ ] `sitemap.xml` includes all surviving + new URLs, excludes removed URLs (verify `generate-sitemap.mjs` output; extend it if `/molecules/` routes need registration).
- [ ] `robots.txt` correct; no accidental disallow of `/molecules/`. (Staging keeps its X-Robots-Tag noindex header from `vercel.json` — production must not.)
- [ ] Full crawl (Ahrefs Site Audit or Screaming Frog) shows: zero 404s, zero redirect chains/loops, zero orphan pages, every molecule page reachable within 2 clicks of the homepage.
- [ ] Internal-link report confirms each priority goal spoke gained inbound internal links vs. baseline (baseline: `docs/internal-linking-audit.md` + fresh pre-deploy snapshot).
- [ ] Submit updated sitemap in Google Search Console; request indexing for new hubs + molecule pages.
- [ ] `pnpm build` passes.

### US-010: Retheme supporting pages & blog (NEW)

**Description:** As the site owner, I want the supporting pages that carry men's-health/TRT framing rewritten peptide-primary, and the off-theme editorial re-pointed, without deleting traffic-bearing articles.

**Acceptance Criteria:**
- [ ] `/about/`: title/description/body no longer "physician-supervised TRT clinic"; peptide-primary rewrite preserving the E-E-A-T assets (named physicians, labs, compounding-pharmacy positioning).
- [ ] `/careers/`: "hormone therapy and men's health" framing → peptide-clinic framing.
- [ ] `/blog/`: retitled from "Evidence-Based Men's Health Blog" to a peptide-primary title; category chips reviewed ("Men's Health Nutrients" → e.g. "Nutrients & Supplements"; "Sexual Health" category label kept or folded, owner's call).
- [ ] The 5 sexual-health and 5 nutrient articles are KEPT and indexable (they hold long-tail traffic) but link UP into the peptide theme (ED/PE articles → `/molecules/pt-141/` + `/peptides-for-libido/`; NAD-adjacent articles → `/peptides-for-anti-aging/`; `/semaglutide-diet/` → `/molecules/semaglutide/`; `/dexa-scan/` article reframed toward peptide body-comp monitoring).
- [ ] Author pages (`/author/dr-angel-rivera/`, `/author/mahadev-mukherjee/`) sweep: bios/link-lists reflect peptide-primary positioning; no links to removed URLs.
- [ ] Verify in browser.
- [ ] `pnpm build` passes.

### US-011: Update build gates, parity suite & QA harness (NEW)

**Description:** As a developer, I want the repo's QA gates updated to match the new architecture so CI is green for the right reasons — not by deleting safety nets.

**Acceptance Criteria:**
- [ ] The production byte-parity suite (`tests/parity/`, 606 assertions / 47 routes) is formally retired or re-baselined: this PRD intentionally changes output sitewide, so parity-vs-old-production is no longer the spec. Replace with a re-generated fixture of the new build (`test:parity:fixture`) so future refactors still have a regression baseline. Document the decision in `CHANGES-FROM-PRODUCTION.md`.
- [ ] `scripts/check-seo.mjs` passes for all new/changed pages; any deliberate exceptions go through the existing waiver system (`docs/waivers/`), not gate edits.
- [ ] `tests/fixtures/redirect-manifest.json` covers every US-001 redirect; `check-redirects.mjs` passes static + live.
- [ ] Internal-link gate (per the NYC-PRD pattern) extended: no internal link may point to a removed URL or to `/reviews/*` from peptide-theme pages (FR-2 becomes machine-enforced).
- [ ] E2E smoke (`test:e2e`) covers: molecule hub renders all 17 cards; a sample molecule page renders all template sections; footer contains no TRT/review links.
- [ ] `pnpm check` (typecheck) and `pnpm build` pass.

---

## 5. Functional Requirements

- FR-1: All removed legacy service URLs return 301 (single hop) to the mapped peptide equivalent (table in Section 3).
- FR-2: No page in the peptide theme (home, hubs, goal spokes, molecule spokes, locations) links to a `/reviews/*` page — enforced by the link gate (US-011).
- FR-3: The 5 review pages remain indexable, self-interlinked, and are excluded from global nav/footer.
- FR-4: A `/molecules/` hub exists and links to all 17 molecule pages plus the `/peptides/` goal hub.
- FR-5: 17 molecule spoke pages exist, each with the full section template and bidirectional goal cross-links generated from the `molecules` data module.
- FR-6: Every goal spoke links to its molecules, its hub, and 2–3 sibling goal spokes with descriptive anchors.
- FR-7: Every location page links to relevant goal + molecule spokes and names a licensed physician; physical clinics carry MedicalClinic schema with NAP/geo (telehealth metros: MedicalWebPage only).
- FR-8: Global nav "Peptides" menu exposes both "Browse by Goal" and "Browse by Molecule."
- FR-9: Footer contains no TRT branding and no sitewide review links.
- FR-10: Location count ("2 clinics + 8 telehealth metros," pending OQ-1 wording) and telehealth/in-person status are consistent across nav, hubs, footer, and body copy.
- FR-11: FAQPage, Physician, MedicalWebPage, MedicalClinic, and Review/AggregateRating schema are implemented via `schemas.ts` builders and validate.
- FR-12: Sitemap and robots reflect the new architecture; no removed URLs remain in the sitemap.
- FR-13: All existing build gates (check-seo, check-redirects, typecheck) pass; the parity suite is re-baselined, not silently deleted.

---

## 6. Non-Goals (Out of Scope)

- **No new city/metro pages.** Hold at 8 metros; deepen only. Programmatic city expansion is a later phase.
- **No molecule × location combo pages** (e.g., "BPC-157 in Miami") in this phase — build the core molecule layer first.
- **No removal of review pages.** They stay; they're contained, not deleted.
- **No removal of the sexual-health / nutrient / diet articles.** They stay; they're re-pointed (US-010).
- **No booking/e-commerce flow changes** — CTAs continue to the existing SMS/assessment action (`BOOKING_SMS_HREF`).
- **No redesign** of the visual system; this is an architecture, content, and SEO release.
- **No legal-entity rename** (Terms of Use) without owner/legal sign-off (OQ-6).
- **No paid-media / off-page link building** work in this PRD (separate initiative).

---

## 7. Technical Considerations

- **Follow the repo's config-driven page pattern.** Local pages are one layout + a typed config module (`CityPeptidePage` + `cityPeptideConfig.ts`); nav/footer/hubs/sitemap all render from shared data modules so links "can never drift." Molecules do the same: a `src/data/molecules.ts` module (or Astro content collection) with `slug`, `name`, `aliases[]`, `group`, `goals[]`, plus a `MoleculePage` layout and a dynamic route (`src/pages/molecules/[slug].astro`). The `goals[]` field programmatically drives molecule→goal links, goal→molecule modules (US-006), hub grouping, and nav — the mapping table in US-005 is the single source of truth.
- **Goal-spoke bodies are static HTML fragments** (`src/content/fragments/*.html`) rendered by article layouts. Prefer layout-injected cross-link modules over hand-editing fragments, so US-006 links stay in sync with the data module.
- **Redirects:** managed in `vercel.json` (existing style, `trailingSlash: true`); enforce single-hop, no chains — validated by `scripts/check-redirects.mjs` against `tests/fixtures/redirect-manifest.json`.
- **SEO gates:** titles ≤ 60 chars including the " | Strong Health" suffix; descriptions 120–160 (`scripts/check-seo.mjs`, runs postbuild with `generate-sitemap.mjs`). Waivers via `docs/waivers/`.
- **Schema:** emit via existing `JsonLd.astro` + `schemas.ts` builders; add `physicianSchema` and `medicalClinicSchema`. New pages use trailing-slash schema URLs — `PROD_SLASHLESS_PATHS` is a frozen legacy-parity set; do not extend it.
- **Parity suite:** re-baseline, don't delete (US-011). Record all deliberate output changes in `CHANGES-FROM-PRODUCTION.md` (existing convention).
- **Reviews isolation** is a linking/nav change, not a noindex change — do not noindex review pages (they hold rankings).
- **YMYL/compliance:** molecule dosing content framed as clinical context, not prescriptive instructions; every molecule page physician-reviewed and cites primary sources (reuse `CitationList`). Keep LegitScript/HIPAA/FSA-HSA/FDA trust markers (homepage `trustBadges`).
- **Ahrefs baseline:** snapshot current positions/traffic for the priority keyword set + review pages before deploy (the Ahrefs MCP connection in this workspace can pull this) to measure movement and confirm review-traffic containment.

---

## 8. Success Metrics

- Priority goal-guide keywords move from page 3–4 to **page 1–2** within 2 quarters:
  - "peptides for muscle growth" (21k) from 32 → top 20, targeting top 10.
  - "peptides for sleep" (1.7k) from 40 → top 20.
  - "dsip peptide benefits" (1.2k) from 30 → top 10.
- ≥ 12 of 17 molecule pages indexed and ranking (top 50) within 90 days; ≥ 5 in top 20 within 2 quarters.
- Total peptide-theme organic traffic up meaningfully quarter-over-quarter (baseline set pre-launch); review-page traffic **held flat** (containment working, not cannibalized).
- Crawl health: zero 404s, zero orphan peptide pages, 100% of molecule pages within 2 clicks of home.
- Every priority spoke shows a net increase in inbound internal links vs. baseline (`docs/internal-linking-audit.md` + pre-deploy snapshot).

---

## 9. Open Questions

- **OQ-1 — Delray Beach status:** `/fl/` describes Delray as a physical clinic (Atlantic Avenue, Saturday hours); `cityPeptideConfig.ts` describes Delray peptide patients as telehealth-served with in-person baselines at Miami Brickell. Which is true today? The answer sets the standardized location copy (US-007/FR-10): "2 clinics + 8 metros" vs "1 clinic + 8 metros."
- **OQ-2 — `/fl/miami/dexascan/`:** keep as a body-composition support asset reframed toward peptide intent (recommended), or 301 to the Miami peptide page? Related: does the external dexascans.com sister-brand link keep a footer slot?
- **OQ-3 — Physician naming for telehealth states:** Dr. Rivera across all 8 metros, or state-specific licensed physicians to be named? (The `physicians[]` config field is ready either way; today it holds "Strong Health Medical Team" placeholders outside Miami.)
- **OQ-4 — "4.9 from 2,500+ verified patient reviews":** substantiable with real review data for AggregateRating schema, or should the count be adjusted/removed? (Currently rendered twice on the homepage with no backing schema.)
- **OQ-5 — PRP & stem-cell pages:** the draft PRD missed `/fl/miami/prp-therapy/` and `/fl/miami/stem-cell-therapy/`. Recommendation: 301 both to `/fl/miami/peptide-therapy/` (regenerative intent maps to healing peptides; keeping them preserves a second non-peptide service theme). Confirm they aren't revenue lines that must stay.
- **OQ-6 — Legal entity name:** Terms of Use identifies "Strong Health TRT, LLC." Keep the legal name in legal pages (fine for SEO — it's one page) or is a formal entity rename planned? Do not edit without sign-off.
- **OQ-7 — Semaglutide/Tirzepatide prescribing scope:** in-scope to *prescribe* (not just describe) in all 8 metros, or content-only in some states? (Affects molecule-page CTA wording and compliance.)
