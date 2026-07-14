# Strong Health — Astro Migration

Migration of [www.stronghealth.com](https://www.stronghealth.com) from a Replit-hosted React/Vite monorepo app to a dedicated Astro 5 static site deployed on Vercel.

## Status

📋 **Planning** — see the full PRD: [`tasks/prd-astro-migration.md`](tasks/prd-astro-migration.md)

## Why

- **Speed:** Astro ships zero JS by default; the current site ships the full React runtime on every content page.
- **SEO:** URL-for-URL, schema-for-schema lossless migration, plus fixes for known defects (over-length titles, double-brand suffixes, missing JobPosting/MedicalWebPage schema) and an upgrade from client-side wildcard redirects to server-side 301s.
- **Clean infra:** dedicated repo, CI-enforced SEO checks, Vercel preview + production deploys — no Replit coupling.

## Source

Migrated from the `artifacts/strong-health` package of the Replit monorepo (`ErikfRivera/Strong-Health-Home`), source commit `9398453`.

## Key invariants (do not break)

1. All 46 indexable URLs keep their exact trailing-slash paths.
2. Unknown URLs return a real HTTP 404 (`curl -I https://www.stronghealth.com/this-does-not-exist/`).
3. `sitemap.xml` is generated at build time — never hand-edited.
4. All head tags flow through the `Seo` component; JSON-LD and visible content share one data source.

## Next steps

Work through the PRD user stories in order (US-001 → US-015). Phase 0 scaffolds the Astro project in this repo.
