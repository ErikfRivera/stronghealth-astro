# Browser console report — Phase 9 (2026-07-14)

Method: every one of the 47 routes loaded from the built site (chromium,
desktop + mobile projects), all console errors/warnings, page exceptions and
failed requests captured unfiltered, then classified. Production
(https://www.stronghealth.com) sampled on `/`, `/peptides-for-healing/`,
`/reviews/` for comparison.

## Classification

| Signal | This build (47 routes) | Live production | Class |
|---|---|---|---|
| `googleads.g.doubleclick.net/pagead/ads?client=ca-pub-7951814481749634…` → HTTP 403 console error | 1× per page | identical 1× per page | **Inherited third-party** (D8): same publisher ID, same request path, same 403 on prod. Excluded narrowly by the e2e gate (exact host + "Failed to load resource" only). Separate hardening item for the site owner. |
| `A preload for '…index….css' is found, but is not used because the request credentials mode does not match` | **absent** | present on every page | **Production regression not reproduced.** Our font preloads carry `crossorigin` (matching font-fetch credentials mode) and the stylesheet link has no mismatched preload. The e2e suite now fails if this warning ever appears. |
| `Minified React error #418` (hydration) pageerror | **absent** | present on every sampled page | **Production first-party bug eliminated** by the static Astro build (no hydration). |
| `Ignoring Event: localhost` warning from `analytics.ahrefs.com` | 1× per page (localhost only) | n/a | Environmental: Ahrefs ignores non-production hostnames. Warning, not error; not gated. |
| GA4 / AdSense ping `net::ERR_ABORTED` request failures | sporadic | sporadic | Environmental teardown noise (page closed mid-beacon); never surfaces as a console error. |
| First-party console errors / page JS exceptions | **0 across all 47 routes × 2 viewports** | React #418 (above) | — |

## Gate (tests/e2e/pages.spec.mjs)

- Allowlist tightened from substring matching (`"googleads"`, `"adsbygoogle"`,
  …) to **exact hostnames** and **only** for `Failed to load resource: …`
  messages — script runtime errors from third-party code, page exceptions and
  everything first-party fail the suite.
- New assertion: zero `preload … credentials mode does not match` warnings on
  any route (the production warning above must never be reintroduced).
- Result: 106/106 e2e checks green with the tightened gate.
