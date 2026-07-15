// Dependency-free HTML extraction helpers for the parity suites.
// Astro's static output is regular, well-formed HTML, so targeted regex
// extraction is reliable here (no need to pull in a DOM parser).

const NAMED_ENTITIES = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  copy: "©",
  reg: "®",
  trade: "™",
  times: "×",
  rarr: "→",
  bull: "•",
  middot: "·",
};

export function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] ?? m);
}

export function normalizeWs(s) {
  return s.replace(/\s+/g, " ").trim();
}

function textify(inner) {
  return normalizeWs(decodeEntities(inner.replace(/<[^>]+>/g, " ")));
}

export function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? textify(m[1]) : null;
}

// Extract an attribute value, respecting the actual quote character used
// (a double-quoted value may legitimately contain apostrophes and vice versa).
function attrValue(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decodeEntities(m[2] ?? m[3]) : null;
}

// Find a <meta ...> tag by attribute (handles either attribute order).
function extractMetaContent(html, attr, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const attrRe = new RegExp(`\\b${attr}\\s*=\\s*["']${value}["']`, "i");
    if (!attrRe.test(tag)) continue;
    const content = attrValue(tag, "content");
    if (content !== null) return content;
  }
  return null;
}

export function extractDescription(html) {
  return extractMetaContent(html, "name", "description");
}

export function extractRobots(html) {
  return extractMetaContent(html, "name", "robots");
}

export function extractCanonical(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/\brel\s*=\s*["']canonical["']/i.test(tag)) continue;
    const href = attrValue(tag, "href");
    if (href !== null) return href;
  }
  return null;
}

export function extractLang(html) {
  const m = html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']*)["']/i);
  return m ? m[1] : null;
}

export function extractH1s(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => textify(m[1]));
}

// All ld+json scripts in document order: [{ raw, parsed | parseError }].
export function extractLdJsonScripts(html) {
  const out = [];
  const re =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    const raw = m[1].trim();
    try {
      out.push({ raw, parsed: JSON.parse(raw) });
    } catch (e) {
      out.push({ raw, parseError: e.message });
    }
  }
  return out;
}

// Approximation of rendered text: drop script/style/head, strip tags, decode.
export function visibleText(html) {
  const body = html.replace(/^[\s\S]*?<body\b[^>]*>/i, "");
  const cleaned = body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
  return normalizeWs(decodeEntities(cleaned));
}

// Every root-relative href ("/...") in the document, hash/query stripped.
export function extractRootRelativeHrefs(html) {
  const hrefs = new Set();
  for (const m of html.matchAll(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/gi)) {
    const href = decodeEntities(m[1] ?? m[2]);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split("#")[0].split("?")[0];
    if (clean) hrefs.add(clean);
  }
  return [...hrefs];
}
