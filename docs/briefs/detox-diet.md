# Content Brief — "Detox Diet"

**Route:** `/detox-diet/`
**Cluster:** Diet & Nutrition (blog hub)
**Author / Reviewer:** Mahadev Mukherjee / Dr. Angel Rivera, M.D. (matches the diet cluster)
**Status:** DRAFT — needs clinical sign-off before publish (net-new clinical content).

---

## 1. Target keyword & opportunity

| Metric | Value |
|---|---|
| Primary keyword | **detox diet** |
| US volume | 5,100 /mo |
| Global volume | 19,000 /mo |
| Keyword Difficulty | 51 |
| CPC | $0.06 |
| Parent topic | *how to detox your body* (14,000 /mo) |
| Traffic potential (of #1 page) | ~8,100 /mo |
| Dominant intent | **Informational** (no commercial/transactional flags) |
| SERP features | AI Overview (+ sitelinks), image thumbnails, People-Also-Ask block |

Source: Ahrefs Keywords Explorer + SERP Overview, US, pulled 2026-07-18.

**Why build it:** Strong Health already owns a Diet & Nutrition cluster (`/stillman-diet/`,
`/semaglutide-diet/`) with an evidence-first, "here's what modern medicine actually says"
voice. "Detox diet" is the highest-volume unclaimed head term that fits that voice exactly,
and its parent topic (*how to detox your body*, 14k) plus the surrounding cluster (*detox
cleanse* 18k, *detox drinks* 26k, *body detox* 4.6k) give the page a large secondary-keyword
canopy. Production currently 404s on `/detox-diet/`.

## 2. SERP analysis — what ranks and why

The first organic page is a **NIH/NCCIH** explainer; the rest of page one is dominated by
medical authorities — **WebMD, MD Anderson, Healthline, the British Dietetic Association,
Mass General, eatright.org (Academy of Nutrition & Dietetics)**. Every one of them takes the
**same skeptical, myth-correcting angle**: your organs already detoxify you, commercial
"detox" claims are unsupported, and the parts that help (whole foods, less alcohol/added
sugar, hydration, sleep) are just ordinary good nutrition.

**Implications for our page:**

- **Match search intent = debunk, then redirect.** The query looks like it wants a plan, but
  Google is rewarding honest, authority-grade explainers, not 7-day juice regimens. We win by
  being the clearest, best-structured version of the honest answer — and by doing the one
  thing the ranking pages don't: connecting "there's no magic cleanse" to "here's the
  physician-supervised path that does move metabolic health."
- **E-E-A-T is the moat.** Named MD reviewer, real citations (NIH, peer-reviewed reviews),
  medical disclaimer, editorial-standards link — all already standard in our layout.
- **Win the AI Overview & PAA.** A tight TL;DR and a direct-answer FAQ block are the units
  most likely to be quoted. Lead every section with the answer.
- **Don't oversell.** No "flush toxins," no "reset your liver," no before/after weight claims.
  Those phrasings are exactly what the authority pages warn against and would undercut trust.

## 3. Angle & thesis

> Your liver, kidneys, gut, lungs, and skin run a continuous, sophisticated detoxification
> system 24/7. No commercial "detox diet," juice cleanse, tea, or supplement has been shown to
> remove toxins your body can't already clear — and some cause real harm. But the *honest*
> version of a detox diet (whole foods, more fiber and water, far less alcohol, added sugar,
> and ultra-processed food) genuinely helps, because it stops overloading the organs that do
> the work. For real, lasting metabolic goals, physician-supervised care beats any cleanse.

## 4. Search-intent-driven outline (TOC)

Section IDs are the anchor slugs used in the page.

1. `tldr` — **TL;DR** (green callout; the AI-Overview-ready answer)
2. `what-is` — **What Is a Detox Diet?** *(what is a detox diet — 1,700)*
3. `how-body-detoxes` — **How Your Body Actually Detoxifies** *(how to detox your body — 14,000; liver/kidney/gut)*
4. `do-they-work` — **Do Detox Diets Work? What the Evidence Says**
5. `scorecard` — **Detox Diet Scorecard** (reuses the scorecard component pattern)
6. `foods-that-help` — **Foods That Genuinely Support Your Detox Organs** *(detox foods — 1,500)* → `AccordionFoodList` (eat)
7. `foods-to-cut` — **What to Cut, Not What to Add** *(sugar detox 1,000; alcohol)* → `AccordionFoodList` (avoid)
8. `reset-plan` — **A Realistic 7-Day Reset (Not a Cleanse)** *(detox diet plan for a week 1,600; 7 day detox diet 150)*
9. `drinks-cleanses` — **Detox Drinks, Teas & Cleanses: A Reality Check** *(detox drinks 26,000; detox cleanse 18,000)*
10. `risks` — **Risks & Red Flags** (juice-cleanse oxalate nephropathy; supplement liver injury)
11. `weight-loss` — **Detox and Weight Loss: What Actually Moves the Needle** (funnel to clinic)
12. `faq` — **FAQ** (layout-rendered)
13. `bottom-line` — **The Bottom Line**
14. `references` — **References** (layout-rendered)

## 5. Secondary keywords to fold in naturally

`how to detox your body` · `what is a detox diet` · `detox diet plan` / `detox diet plan for a
week` / `7 day detox diet` · `detox cleanse` · `body detox` / `full body detox` · `detox
drinks` · `detox foods` · `natural detox` · `liver detox diet` · `sugar detox diet` · `3 day
detox diet`. Use in H2/H3s and body copy only where they read naturally — no stuffing.

## 6. People-Also-Ask → FAQ schema

Answer directly, one to three sentences, quotable:

- Do detox diets actually remove toxins from your body?
- What is the best way to detox your body naturally?
- How can I detox my body in 3 days / a week?
- Are detox cleanses and juice cleanses safe?
- Does a detox diet help you lose weight?
- What foods help your liver and kidneys detox?
- Is a sugar detox a real thing?

## 7. Metadata

- **H1 (visible):** Detox Diets: What the Evidence Actually Says About Cleansing Your Body
- **SEO title (≤60 incl. brand):** `Detox Diet: What Works, What Doesn't` → 52 chars w/ ` | Strong Health`
- **Meta description (120–160):** "Do detox diets actually remove toxins? A physician-reviewed
  look at how your body really detoxifies, which foods help, and what the evidence shows works."
- **Sitemap:** priority 0.8, changefreq monthly, lastmod = launch date (post-cutover route).

## 8. Compliance / guardrails

- No claims that any diet, drink, tea, or supplement "removes/flushes toxins" or "cleanses"
  an organ — frame as *supporting* organs that already work.
- No specific weight-loss numbers attributed to detoxing.
- Medical-weight-loss / GLP-1 mentions stay physician-supervised, no dosing.
- Every clinical claim carries a citation to a primary or authority source.
- Keep the standard medical disclaimer + DRAFT-review banner until a clinician signs off.

## 9. Internal linking

- **Inbound:** add to the Diet & Nutrition list on `/blog/` (via `articles.ts`); reciprocal
  related-links from `/stillman-diet/` and `/semaglutide-diet/`.
- **Outbound (related):** `/semaglutide-diet/`, `/stillman-diet/`, `/peptides-for-weight-loss/`,
  `/peptides-for-belly-fat/`, `/foods-that-lower-testosterone/`, `/fl/miami/weight-loss-clinic/`.
- **CTA:** physician-supervised weight-loss assessment (booking SMS).

## 10. Primary sources

1. NCCIH (NIH). "Detoxes" and "Cleanses": What You Need To Know.
2. Klein AV, Kiat H. Detoxification diets for toxin elimination and weight management: a critical review. *J Hum Nutr Diet.* 2015.
3. Obert J, et al. Popular Weight Loss Strategies: a Review of Four Weight Loss Techniques. *Curr Gastroenterol Rep.* 2017.
4. Almazroo OA, Miah MK, Venkataramanan R. Drug Metabolism in the Liver. *Clin Liver Dis.* 2017.
5. Getting JE, et al. Oxalate nephropathy due to "juicing." *Am J Med.* 2013.
6. Reynolds A, et al. Carbohydrate quality and human health: systematic reviews and meta-analyses. *Lancet.* 2019.
7. Ronis MJJ, Pedersen KB, Watt J. Adverse effects of nutraceuticals and dietary supplements. *Annu Rev Pharmacol Toxicol.* 2018.
8. Dietary Guidelines for Americans, 2020–2025.
9. Wilding JPH, et al. Once-weekly semaglutide in adults with overweight or obesity (STEP 1). *N Engl J Med.* 2021.
