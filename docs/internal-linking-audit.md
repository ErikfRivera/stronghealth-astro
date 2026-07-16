# Strong Health — Internal Linking Audit & Architecture

**Scope:** Audited from the live codebase (`src/pages`, `src/content/fragments`, `src/data`, shared `Nav`/`Footer`/`ArticleLocationsSection`), not a crawl export. "Contextual/related" = links inside body copy, the `relatedLinks` related-content module, or a local page's `relatedInternalLinks`. "Templated" = the sitewide `Nav` and `Footer` link modules that every page receives automatically.

Domain: `https://www.stronghealth.com` · `trailingSlash: always`

---

## 0. Page inventory (by type)

**Local / service pages (money pages)**
- Peptide therapy cities (8): `/fl/miami/`, `/fl/tampa/`, `/fl/delray-beach/`, `/nv/las-vegas/`, `/ny/new-york/`, `/ca/san-diego/`, `/ga/atlanta/`, `/tx/austin/` `.../peptide-therapy/`
- TRT (2): `/fl/miami/trt-therapy/`, `/fl/delray-beach/trt-therapy/`
- Weight-loss (2): `/fl/miami/weight-loss-clinic/`, `/fl/delray-beach/weight-loss-clinic/`
- DEXA (1): `/fl/miami/dexascan/`
- Hubs: `/fl/` (state), `/services/`

**Use-case pages ("Peptides for [outcome]")**
- Pillar: `/peptides/`
- Sub-hub: `/peptides-for-healing/`
- Spokes: `/peptides-for-muscle-growth/`, `/peptides-for-belly-fat/`, `/peptides-for-sleep/`, `/peptides-for-tendon-repair/`, `/peptides-for-arthritis/`, `/peptides-for-libido/`
- Support: `/collagen-peptides/`

**Editorial**
- Sexual health (5): `baking-soda-for-ed`, `garlic-and-honey-for-erectile-dysfunction`, `porn-induced-erectile-dysfunction`, `home-remedies-for-premature-ejaculation`, `premature-ejaculation-exercises`
- Nutrients (5): `foods-that-lower-testosterone`, `resveratrol-side-effects`, `nadh-benefits`, `lysine-benefit-men-health`, `nac-benefits-men`
- Diet (2): `stillman-diet`, `semaglutide-diet`
- Body comp (1): `dexa-scan`
- Reviews (5): `andro-400`, `elysium-basis-review`, `low-t-center`, `nugenix-ultimate-testosterone`, `revita`

---

## 1. Executive summary — current linking weaknesses

1. **Seven of eight peptide-therapy city pages are contextually orphaned.** Las Vegas, New York, San Diego, Atlanta, Austin, Tampa and Delray Beach peptide pages receive **zero** in-content/related inbound links — only the templated footer and the `/peptides/` city grid reach them. These are the primary local ranking targets, and they inherit no topical authority from the peptide content cluster.
2. **The use-case cluster never links *down* to a city page.** No `peptides-for-*` page links to any peptide-therapy city page. All of their outbound "local" links go to Miami/Delray **TRT or weight-loss** pages. Conversion-intent equity dead-ends before it reaches the geo money pages.
3. **Local→use-case linking is shallow and templated-identical.** Six cities each link to the *same two* pages (`/peptides-for-healing/`, `/peptides-for-belly-fat/`); Miami and Delray link to **no** use-case page. The signal is thin and non-varied.
4. **A cluster of nutrient articles is orphaned or dead-ended.** `lysine-benefit-men-health` and `nac-benefits-men` are orphans (no contextual inbound); those two plus `nadh-benefits` and `resveratrol-side-effects` are dead-ends whose only in-body outbound is `/services/`. Equity flows in and stops.
5. **Anchor text to the use-case pages is over-optimized.** Exact-match "peptides for muscle growth", "peptides for tendon repair", "peptides for healing hub page" repeat across many inbound links (well above a 40% exact-match ceiling), while the money city pages have no descriptive anchors at all.

---

## 2. Recommended architecture (hub-and-spoke)

Three interlocking clusters, with `/peptides/` as the pillar that binds the use-case and local layers.

```
                         ┌───────────────────┐
                         │   Homepage  /      │
                         └─────────┬─────────┘
                (nav)              │              (nav)
        ┌──────────────────┬───────┴────────┬──────────────────┐
        ▼                  ▼                 ▼                  ▼
  ┌───────────┐     ┌────────────┐    ┌───────────┐     ┌────────────┐
  │ /peptides/│◄────│  /fl/      │    │ /reviews/ │     │ /services/ │
  │  PILLAR   │     │ state hub  │    │  hub      │     │  hub       │
  └─────┬─────┘     └─────┬──────┘    └───────────┘     └────────────┘
        │  spokes         │ spokes
        ▼                 ▼
  USE-CASE CLUSTER   LOCAL CLUSTER (peptide-therapy cities)
  healing (sub-hub)  miami · tampa · delray · las-vegas ·
   ├ muscle-growth   new-york · san-diego · atlanta · austin
   ├ tendon-repair          ▲                    │
   ├ arthritis              │                    │
   ├ belly-fat        (2) local→use-case   (1) use-case→local
   ├ sleep            geo-relevant spokes   contextual "in [city]"
   ├ libido                 │                    ▼
   └ collagen (support)     └──────► reciprocal, SELECTIVE ◄──
        ▲
        │ (3) editorial → 1 use-case + 1 local (contextual)
  EDITORIAL CLUSTERS
   sexual-health · nutrients · diet · reviews · dexa
```

**Intended flow of authority**
- **Editorial → use-case + local (funnel down).** Every article routes equity to its single most-relevant use-case page and, where geographically/commercially sensible, one local page. Articles are the topical-authority feeders.
- **Use-case ↔ use-case (mesh, selective).** Genuine outcome adjacencies only (see §5). This is already strong; the fix is *pruning and de-optimizing anchors*, not adding.
- **Use-case → local (down, NEW).** Each use-case spoke links to 1–2 city pages where that outcome is a real local offer, passing conversion intent + geo relevance to the money pages.
- **Local → use-case (up, EXPAND).** Each city page links to 2–3 *outcome-varied* use-case spokes (not the same two everywhere), inheriting topical depth.
- **Pillar `/peptides/` ↔ everything peptide.** Hub links down to all spokes and the city grid (already does); every spoke links back up (fix: 3 spokes don't).

**Who should NOT link to whom (avoid dilution)**
- Sexual-health/nutrient editorial should **not** link into the peptide use-case mesh unless the body genuinely discusses peptides (most don't) — keep those clusters topically clean.
- City pages should **not** link to *every* use-case page (link-stuffing) — 2–3 relevant spokes max.
- Use-case pages should **not** cross-link to unrelated outcomes (e.g. libido ↔ tendon-repair) — see the exclusion matrix in §5.
- Reviews should **not** be forced into the peptide cluster; they form their own comparison mesh and route up to `/services/` + one body-comp asset.

**Click depth:** Homepage → hub (`/peptides/`, `/fl/`) → money page = **2 clicks**. Maintained ≤3 everywhere via nav + hub grids.

---

## 3. Link rules per page type

| Rule | Local / city page | Use-case page | Editorial article |
|---|---|---|---|
| **Min contextual internal links** | 3 | 4 | 2 |
| **Max contextual internal links** | 6 | 8 | 5 |
| **Must link to** | 2–3 use-case spokes (outcome-relevant); sibling local services; `/peptides/` | `/peptides/` (up); 2–4 sibling use-cases; **1–2 city pages** (down); 1 supporting article | 1 use-case **or** 1 local hub; 1–2 sibling articles |
| **Placement** | Body copy ("what we treat") + `relatedInternalLinks` module | Body copy + `relatedLinks` module | Body copy (mid-article) + `relatedLinks` module |
| **Templated vs contextual** | Contextual for use-case links; templated for footer/nav | Contextual (manual, per relationship) | Contextual |
| **Anchor rule** | Inbound anchors carry **geo-modifier**; vary across sources | Anchors carry **outcome-modifier**; ≤40% exact match | Natural-language, descriptive |

Footer stays as-is for coverage/crawlability but is **not** counted toward the minimums above — a link in the sitewide footer is not a topical vote.

---

## 4. Use-case cross-link matrix (§5 — which pairs link, which don't)

Current mesh is dense; several links are topically weak and dilute signal. Recommended state:

| Pair | Link? | Reason |
|---|---|---|
| healing ↔ tendon-repair | ✅ keep | Same peptides (BPC-157/TB-500); direct clinical overlap |
| healing ↔ arthritis | ✅ keep | Joint recovery is a subset of healing |
| healing ↔ muscle-growth | ✅ keep | BPC-157 + GH secretagogues co-prescribed for recovery |
| tendon-repair ↔ arthritis | ✅ keep | Connective-tissue/joint continuum |
| tendon-repair ↔ collagen | ✅ keep | Structural support for tendons/ligaments |
| arthritis ↔ collagen | ✅ keep | Cartilage/joint structural support |
| muscle-growth ↔ belly-fat | ✅ keep | Body-composition pair (GH secretagogues) |
| belly-fat ↔ sleep | ✅ keep | GH release during sleep drives fat metabolism — genuine |
| muscle-growth ↔ sleep | ✅ keep | Recovery/GH pulse during sleep |
| healing ↔ sleep | ✅ keep | Recovery umbrella |
| healing ↔ belly-fat | ⚠️ prune | Weak; healing sub-hub already over-links. Drop from body, keep in hub only |
| healing ↔ libido | ❌ remove | Different mechanism (PT-141 vs BPC-157); dilutes healing |
| libido ↔ muscle-growth | ❌ remove | No genuine clinical link; currently present, remove |
| libido ↔ belly-fat | ❌ remove | No genuine link |
| libido → (ED/TRT editorial + TRT city) | ✅ add/keep | Libido's real neighbors are sexual-health & TRT, not the body-comp mesh |
| tendon-repair ↔ sleep | ⚠️ optional | Only via recovery; low priority |

**Net:** libido is currently mis-wired into the body-composition mesh. Re-route it toward its true neighbors (ED articles + TRT). Healing is over-linked as a sub-hub — prune the two weakest edges.

---

## 5. Use-case ↔ local connection (§6)

**Down (use-case → city), NEW — the highest-impact fix.** Add one contextual body link per use-case page to the city page(s) where that outcome is a live local offer. Mechanism: **contextual body link** (templated modules already cover Miami/Delray; the gap is geo-varied contextual equity to the starved cities).

| Use-case page | Links down to | Anchor text | New sentence (if copy doesn't support it) |
|---|---|---|---|
| muscle-growth | `/nv/las-vegas/peptide-therapy/` | peptide therapy in Las Vegas | "Patients starting a GH-secretagogue protocol for lean mass can begin with a physician consult through **peptide therapy in Las Vegas**." |
| belly-fat | `/fl/miami/weight-loss-clinic/` *(keep)* + `/tx/austin/peptide-therapy/` | medically supervised peptide therapy in Austin | "For a supervised visceral-fat protocol, our **medically supervised peptide therapy in Austin** pairs Tesamorelin with lab monitoring." |
| healing | `/ga/atlanta/peptide-therapy/` | BPC-157 peptide therapy in Atlanta | "Athletes managing soft-tissue injuries can start **BPC-157 peptide therapy in Atlanta** under physician supervision." |
| tendon-repair | `/ny/new-york/peptide-therapy/` | peptide therapy for recovery in New York | "New York patients recovering from tendon injuries can access **peptide therapy for recovery in New York**." |
| sleep | `/ca/san-diego/peptide-therapy/` | peptide therapy in San Diego | "A physician-designed sleep-and-recovery protocol is available through **peptide therapy in San Diego**." |
| arthritis | `/fl/tampa/peptide-therapy/` | peptide therapy for joint health in Tampa | "Tampa patients managing joint inflammation can consult on **peptide therapy for joint health in Tampa**." |
| libido | `/fl/miami/trt-therapy/` *(keep)* | TRT and peptide therapy in Miami | (existing copy supports it) |
| collagen | `/fl/delray-beach/peptide-therapy/` | peptide therapy in Delray Beach | "Structural-support protocols are available locally via **peptide therapy in Delray Beach**." |

This gives **every** starved city page exactly one strong, geo-anchored, topically-relevant contextual inbound link from the peptide cluster — distributed so no single use-case page link-stuffs.

**Up (city → use-case), EXPAND.** Replace the identical `healing`+`belly-fat` pair on all six cities with **outcome-varied** pairs so each city inherits different topical depth and anchors vary site-wide. Mechanism: `relatedInternalLinks` module (already rendered by `CityPeptidePage`). Miami and Delray must be given use-case links (currently none).

| City page | Add use-case links (2–3) | Anchor variety |
|---|---|---|
| Miami | healing, belly-fat, libido | "peptides for recovery", "peptides for visceral fat", "peptides for libido" |
| Delray Beach | healing, collagen | "peptides for tissue repair", "collagen peptides guide" |
| Las Vegas | muscle-growth, healing | "peptides for muscle growth", "BPC-157 for recovery" |
| New York | tendon-repair, sleep | "peptides for tendon repair", "peptides for sleep" |
| San Diego | sleep, muscle-growth | "peptides for better sleep", "GH peptides for lean mass" |
| Atlanta | healing, arthritis | "peptides for healing", "peptides for joint inflammation" |
| Austin | belly-fat, muscle-growth | "peptides for belly fat", "peptides for body composition" |
| Tampa | arthritis, healing | "peptides for arthritis", "recovery peptide protocols" |

---

## 6. Editorial routing (§7) — 1 use-case + 1 local per article

| Article | → Use-case (anchor) | → Local (anchor) | Notes |
|---|---|---|---|
| foods-that-lower-testosterone | — (stays in TRT/nutrient lane) | `/fl/miami/trt-therapy/` — "testosterone therapy in Miami" | Currently dead-ends at `/services/`; give it a real local target |
| resveratrol-side-effects | — | `/fl/miami/trt-therapy/` — "physician-supervised TRT in Miami" | **Dead-end fix** |
| nadh-benefits | — | `/services/` (keep) + `/fl/miami/trt-therapy/` — "hormone therapy in Miami" | **Dead-end fix** |
| lysine-benefit-men-health | — | `/fl/miami/trt-therapy/` — "men's health clinic in Miami" | **Orphan+dead-end fix**; also add inbound from nac-benefits-men |
| nac-benefits-men | — | `/fl/miami/trt-therapy/` — "testosterone therapy in Miami" | **Orphan+dead-end fix** |
| semaglutide-diet | `/peptides-for-belly-fat/` (keep) | `/fl/miami/weight-loss-clinic/` (keep) | Already routed — good model |
| stillman-diet | `/peptides-for-belly-fat/` (keep) | `/fl/delray-beach/weight-loss-clinic/` (keep) | Good |
| dexa-scan | `/peptides-for-belly-fat/` — "peptides for visceral fat" | `/fl/miami/dexascan/` (keep) | Add the use-case link |
| baking-soda-for-ed | `/peptides-for-libido/` — "peptides for libido" | `/fl/miami/trt-therapy/` (keep) | Route ED cluster into libido use-case |
| garlic-and-honey-for-ed | `/peptides-for-libido/` — "peptide options for sexual health" | `/fl/miami/trt-therapy/` (keep) | |
| porn-induced-ed | `/peptides-for-libido/` — "peptides for low libido" | `/fl/miami/trt-therapy/` (keep) | |
| home-remedies-pe | — | `/fl/miami/trt-therapy/` (keep) | Keep sexual-health lane |
| premature-ejaculation-exercises | — | `/fl/miami/trt-therapy/` — "sexual health clinic in Miami" | Currently only links siblings + homepage |
| reviews/* | — | `/services/` (keep) + `/dexa-scan/` (keep) | Keep review mesh separate |

---

## 7. Full link map — recommended changes (prioritized)

Only **new/changed** links are listed; existing good links (use-case mesh, review mesh, footer) are kept as-is unless flagged in §4.

| Source URL | Target URL | Anchor Text | Type | Placement | Rationale | Priority |
|---|---|---|---|---|---|---|
| /peptides-for-muscle-growth/ | /nv/las-vegas/peptide-therapy/ | peptide therapy in Las Vegas | contextual | body | De-orphan LV money page; geo anchor | High |
| /peptides-for-belly-fat/ | /tx/austin/peptide-therapy/ | medically supervised peptide therapy in Austin | contextual | body | De-orphan Austin | High |
| /peptides-for-healing/ | /ga/atlanta/peptide-therapy/ | BPC-157 peptide therapy in Atlanta | contextual | body | De-orphan Atlanta | High |
| /peptides-for-tendon-repair/ | /ny/new-york/peptide-therapy/ | peptide therapy for recovery in New York | contextual | body | De-orphan NYC | High |
| /peptides-for-sleep/ | /ca/san-diego/peptide-therapy/ | peptide therapy in San Diego | contextual | body | De-orphan San Diego | High |
| /peptides-for-arthritis/ | /fl/tampa/peptide-therapy/ | peptide therapy for joint health in Tampa | contextual | body | De-orphan Tampa | High |
| /collagen-peptides/ | /fl/delray-beach/peptide-therapy/ | peptide therapy in Delray Beach | contextual | body | De-orphan Delray peptide | High |
| /fl/miami/peptide-therapy/ (config) | /peptides-for-healing/, /peptides-for-belly-fat/, /peptides-for-libido/ | see §5 | templated (relatedInternalLinks) | related module | Miami currently links no use-case | High |
| /fl/delray-beach/peptide-therapy/ (config) | /peptides-for-healing/, /collagen-peptides/ | see §5 | templated | related module | Delray links no use-case | High |
| /nv,/ny,/ca,/ga,/tx,/fl-tampa city configs | varied use-case pairs | see §5 table | templated | related module | Replace identical healing+belly-fat with varied pairs | Med |
| /lysine-benefit-men-health/ | /fl/miami/trt-therapy/ | men's health clinic in Miami | contextual | body | Orphan+dead-end fix | High |
| /nac-benefits-men/ | /fl/miami/trt-therapy/ | testosterone therapy in Miami | contextual | body | Orphan+dead-end fix | High |
| /nac-benefits-men/ | /lysine-benefit-men-health/ | lysine and men's health | contextual | body | Give lysine an inbound link | Med |
| /resveratrol-side-effects/ | /fl/miami/trt-therapy/ | physician-supervised TRT in Miami | contextual | body | Dead-end fix | Med |
| /nadh-benefits/ | /fl/miami/trt-therapy/ | hormone therapy in Miami | contextual | body | Dead-end fix | Med |
| /foods-that-lower-testosterone/ | /fl/miami/trt-therapy/ | testosterone therapy in Miami | contextual | body | Add local target | Med |
| /dexa-scan/ | /peptides-for-belly-fat/ | peptides for visceral fat | contextual | body | Route body-comp article to use-case | Med |
| /baking-soda-for-ed/ | /peptides-for-libido/ | peptides for libido | contextual | body | Feed libido use-case | Med |
| /garlic-and-honey-for-erectile-dysfunction/ | /peptides-for-libido/ | peptide options for sexual health | contextual | body | Feed libido use-case | Med |
| /porn-induced-erectile-dysfunction/ | /peptides-for-libido/ | peptides for low libido | contextual | body | Feed libido use-case | Med |
| /premature-ejaculation-exercises/ | /fl/miami/trt-therapy/ | sexual health clinic in Miami | contextual | body | Add local target | Low |
| /peptides-for-healing/ | /peptides-for-libido/ | (REMOVE) | — | body | Prune weak mesh edge (§4) | Med |
| /peptides-for-libido/ | /peptides-for-muscle-growth/, /peptides-for-belly-fat/ | (REMOVE) | — | body | Re-route libido out of body-comp mesh (§4) | Med |
| /peptides-for-sleep/, /peptides-for-tendon-repair/, /peptides-for-healing/ | /peptides/ | peptides hub (varied) | contextual | related module | 3 spokes miss the up-link to pillar | Med |

---

## 8. Anchor-text plan & over-optimization flags

**Target: `/peptides-for-muscle-growth/`** — currently ~6 inbound anchors, most exact "peptides for muscle growth" (100% exact = **over-optimized, flag**). Recommended mix:
- Exact (≤40%): "peptides for muscle growth" (×2 max)
- Partial: "GH peptides for lean mass", "peptides for body composition"
- Natural: "supporting muscle growth safely", "how GH secretagogues build muscle"

**Target: `/peptides-for-healing/`** — currently receives "peptides for healing hub", "peptides for healing hub page", "peptides for healing hub" repeatedly (**over-optimized + unnatural — flag**). Replace with: "peptides for recovery", "BPC-157 and TB-500 for healing", "full-body recovery protocols", "our recovery peptide guide".

**Target: peptide city pages** — no anchors today; build fresh with **geo-modifiers, ≤40% exact**: e.g. for Las Vegas — "peptide therapy in Las Vegas" (exact), "Las Vegas peptide clinic" (partial), "start a protocol with our Las Vegas physicians" (natural).

**Flagged as risky (fix):** "peptides for healing hub page" (×3), "peptides for tendon repair" as exact across 4 sources, "peptides for muscle growth" exact across 5 sources. Cap any single exact-match anchor at 40% of a target's inbound set.

---

## 9. Content gap list (link would be forced — build the page instead)

1. **No "Peptides for Anti-Aging / Longevity" page** — the brief names anti-aging as a core outcome; site has none. `resveratrol`, `nadh`, `elysium-basis` (NAD+) currently have nowhere topical to funnel. **Build it**; it becomes the use-case home for the longevity/NAD+ editorial.
2. **No "Peptides for Weight Loss" use-case page** distinct from belly-fat — `semaglutide-diet`, `stillman-diet`, weight-loss city pages all over-load `/peptides-for-belly-fat/`. A dedicated weight-loss use-case page would balance the mesh.
3. **No non-Miami local service pages beyond peptide-therapy** — Las Vegas/NYC/etc. have only a peptide page, so use-case→local geo links can't diversify by service. Gap, not a forced link.
4. **`/services/` is a catch-all sink** (11 inbound from fragments) but a thin hub — it absorbs dead-end links without redistributing. Either build it into a real service hub with onward links or stop routing editorial there.
5. **No editorial supports `/peptides-for-libido/`** natively (PT-141/bremelanotide content) — the ED articles are the closest but discuss home remedies, not peptides. A "PT-141 for libido" article would make the libido→ED links genuinely reciprocal.

---

## 10. Implementation priority order

**Phase 1 — De-orphan the money pages (High).** Add the 7 contextual use-case→city links (§5 down-table). Single highest ROI: every peptide city page gains a strong geo-anchored topical inbound. Touch: 7 fragment files.

**Phase 2 — Fix Miami/Delray + vary city→use-case (High/Med).** Add use-case `relatedInternalLinks` to Miami and Delray configs; replace the identical healing+belly-fat pair on the other six with varied pairs (§5 up-table). Touch: `cityPeptideConfig.ts`.

**Phase 3 — Rescue orphan/dead-end nutrients (High/Med).** Add local + sibling links to lysine, nac, nadh, resveratrol, foods-that-lower-testosterone (§6). Touch: 5 fragment files.

**Phase 4 — Prune & de-optimize the use-case mesh (Med).** Remove the libido mis-wiring and the two weak healing edges; add the 3 missing spoke→`/peptides/` up-links; rewrite over-optimized anchors (§4, §8). Touch: use-case fragments + `relatedLinks` arrays.

**Phase 5 — Editorial→use-case routing (Med/Low).** ED cluster → libido; dexa → belly-fat; PE-exercises → local (§6).

**Phase 6 — Content gaps (backlog).** Build anti-aging/longevity + dedicated weight-loss use-case pages (§9), then wire the NAD+/resveratrol/diet editorial into them.

---

*All link recommendations above are contextual and user-serving: each sits in body copy that already discusses the target topic, or ships with the new sentence provided. No footer dumps, no reciprocal-everywhere linking, no link stuffing.*
