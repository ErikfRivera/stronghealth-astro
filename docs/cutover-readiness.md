# Cutover readiness — Strong Health Astro migration

**Status: READY** (documented deviations D4/D8 only — see worklog D-table)
**Release candidate commit:** f838310 · **Staging deployment:** https://strong-health-astro-pai1tsuyx-erikrivera.vercel.app (aliased to https://staging.stronghealth.com)
**Date:** 2026-07-14 · **Cutover owner / rollback decision-maker:** Erik

## Verification results (this exact commit, live staging vs live production)
- Live parity suite: **647/647 pass** (status/title/description/canonical/robots/lang/H1/JSON-LD fields/sitemap for all 47 routes)
- Build parity suite: 606/606 · E2E: 106 pass · Visual: 55/55 baselines
- Redirect manifest: 22 redirects + 3 real-404 cases valid live
- HTTP audit: 47 routes, 0 unexpected diffs, 0 broken internal links (reports/parity-live-final.md)
- Sitemap: 47 URLs, historical lastmods (§10.3), priority/changefreq 47/47
- HTML payload median: 59,319 B (budget 60,635) — docs/payload-report.md
- Console: zero first-party errors ×47 routes ×2 viewports — docs/console-report.md
- Article visual diff: 0.0072% (D7 budget 0.25%) — QA's 2.38% was a mid-animation capture artifact (docs/waivers/phase7-article-visual/)

## Approved deviations (owner-recorded)
- D2 read-read typo fixed (13 articles) · D1 real 404s for unknown URLs
- D4 DEXA SMS CTA kept (exists in production as JS button), number normalized to +19546635563 — verify on one iOS + one Android device before/at cutover
- D8 AdSense 403 inherited from production — separate hardening item

## Cutover steps
1. Freeze content on Replit. 2. Add www.stronghealth.com + apex→www redirect to Vercel project strong-health-astro (team erikrivera). 3. Lower DNS TTL ≥1h ahead; switch www CNAME to Vercel; apex per Vercel instructions. 4. Post-cutover smoke: `BASE_URL=https://www.stronghealth.com node scripts/check-redirects.mjs` + `node scripts/audit-parity.mjs <replit-snapshot-or-fixture> https://www.stronghealth.com` + spot-check GA4 generate_lead + resubmit sitemap in GSC. 5. Monitor GSC coverage, GA4 realtime, Vercel 404 rate.

## Rollback
Re-point www DNS back to Replit (kept warm 14 days, unchanged). No data migration involved; rollback is DNS-only. Do not fix forward if canonicals/routing are wrong — revert DNS first.

## CUTOVER EXECUTED — 2026-07-14
DNS moved to Vercel by owner; www.stronghealth.com + apex attached to project (apex 308→www, TLS valid). Post-cutover smoke: 47/47 routes 200 with correct canonicals; GA4/AdSense/Ahrefs tags present; ads.txt+robots.txt 200; unknown URL → 404; 22 redirects + 3 404 cases valid live; no X-Robots-Tag on www. Note: staging.stronghealth.com currently 301s to www (Vercel domain config) — the staging noindex header rule is now inert but harmless. Remaining owner items: resubmit sitemap in GSC, watch GA4 realtime/GSC coverage, verify DEXA SMS CTA on iOS+Android, keep Replit warm 14 days, AdSense 403 hardening (D8).
