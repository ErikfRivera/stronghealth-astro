# Phase 7 — article-template visual parity evidence (no waiver required)

Measurement (2026-07-14): production https://www.stronghealth.com/peptides-for-healing/
vs local preview of this tree, chromium 1440×1000, deviceScaleFactor 1,
`document.fonts.ready` + 2.5 s settle (production's mount-time reveal
transitions are 1000 ms), transitions frozen before capture.

| Route (desktop 1440px) | pixels >30/255 | pixels >10/255 | MAE |
|---|---:|---:|---:|
| /peptides-for-healing/ | **0.0072 %** | 0.0099 % | 0.006 |
| /peptides-for-arthritis/ | 0.0077 % | 0.0117 % | 0.006 |
| /collagen-peptides/ | 0.0086 % | 0.0140 % | 0.007 |
| /nac-benefits-men/ | 0.0092 % | 0.0163 % | 0.008 |

All values are far below the D7 acceptance threshold (≤0.25 %), so **no
waiver is needed**; these images are kept as evidence. The residual pixels
are exclusively (a) the intentional D2 correction — production renders the
duplicated `15 min read read`, this build renders `15 min read` — and (b)
sub-pixel noise on the published-date line (bands y572–577 / y619–627 only).

Root cause of the QA-reported 2.38 %: the QA capture compared the two sites
mid-animation. Production's React `FadeIn` animates even in-viewport
elements on mount (opacity 0→1, translate-y 8→0, 1000 ms), while the Astro
port reveals in-viewport content instantly; screenshots taken before the
production transition finished show the whole article column shifted 1–5 px
→ text-edge diffs. At rest the pages are layout-identical: identical
computed styles (font-family/size/weight, line-height, letter-spacing,
font-smoothing) on h1/h2/p/li/a/byline/CTA, identical `@font-face` rules,
byte-identical woff2 files (sha256), identical preloads, and identical
scrollWidth×scrollHeight on all six sampled article routes.

Files: `prod-…png` (production), `local-…png` (this build),
`diff-…png` (production frame with >30/255 pixels highlighted red).
