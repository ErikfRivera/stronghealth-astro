// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.stronghealth.com",
  output: "static",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline bundled scripts into every page: the shared site
      // runtime (src/scripts/site-runtime.ts) must be emitted as ONE hashed,
      // cacheable file instead of being duplicated across all 47 HTML
      // payloads (Phase 8 payload budget).
      assetsInlineLimit: 0,
    },
  },
});
