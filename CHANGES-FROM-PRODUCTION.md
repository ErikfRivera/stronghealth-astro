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
5. **Schema URL fields (`mainEntityOfPage`, breadcrumb tail items,
   `MedicalWebPage.url`) now use the trailing-slash canonical URL** instead of
   the slashless variant some pages emitted (SEO_AUDIT finding #9).
6. **JSON-LD placement:** unchanged (body), same types per page.

## Per-page

7. **"X min read read" duplication fixed** on the 13 article pages whose
   source passed a readTime already containing "read" (e.g. lysine, NAC, NADH,
   resveratrol, foods-that-lower-testosterone, all 8 old-layout peptide pages).
   Now renders "X min read" once.

_Title/description texts are unchanged from production (production had already
been trimmed to budget after the April SEO audit; the build now enforces the
budgets: title ≤ 60 chars incl. brand, description 120–160)._
