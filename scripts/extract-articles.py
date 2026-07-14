#!/usr/bin/env python3
"""
US-006/US-007 migration tool: generate Astro article pages from the RENDERED
production HTML (Strong-Health monorepo dist/public @ commit 9398453), per the
PRD rule that article text is ported from production output, not re-typed
from JSX.

For each route slug this script:
  - extracts the `.prose-strong-health` body -> src/content/fragments/<slug>.html
      * FadeIn SSR classes (opacity-0 md:translate-y-8) are rewritten to the
        Astro FadeIn contract (sh-fade opacity-100 md:translate-y-0 +
        data-fade-delay) so content is visible without JS and re-animates via
        the shared IntersectionObserver.
      * internal hrefs are normalized to trailing-slash form (single-hop
        canonical policy; logged in CHANGES-FROM-PRODUCTION.md).
  - extracts SEO strings, byline dates, TOC, FAQs (from the FAQPage JSON-LD),
    citations, related links and CTA copy -> src/pages/<slug>.astro frontmatter
    driving BlogArticleLayout.astro.

Usage: venv/bin/python scripts/extract-articles.py <dist_public_dir> <slug>...
"""
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Tag

REPO = Path(__file__).resolve().parent.parent
FRAGMENTS = REPO / "src" / "content" / "fragments"
PAGES = REPO / "src" / "pages"

BRAND_SUFFIX = " | Strong Health"
FADE_CLASSES = {"transition-all", "duration-1000", "ease-out"}

INTERNAL_HREF_RE = re.compile(r"^/[^/]")


def normalize_href(href: str) -> str:
    """Add a trailing slash to extension-less internal hrefs (keep query/hash)."""
    if not INTERNAL_HREF_RE.match(href):
        return href
    m = re.match(r"^([^?#]*)([?#].*)?$", href)
    path, tail = m.group(1), m.group(2) or ""
    if path.endswith("/") or "." in path.rsplit("/", 1)[-1]:
        return href
    return path + "/" + tail


def clean_fragment(prose: Tag) -> str:
    # Rewrite SSR FadeIn wrappers to the static-visible Astro contract.
    for div in prose.find_all("div", class_=True):
        classes = set(div.get("class", []))
        if FADE_CLASSES <= classes and "opacity-0" in classes:
            new_classes = [c for c in div["class"] if c not in
                           ("transition-all", "duration-1000", "ease-out",
                            "opacity-0", "md:translate-y-8")]
            div["class"] = ["sh-fade", "opacity-100", "md:translate-y-0"] + new_classes
            style = div.get("style", "")
            delay = re.search(r"transition-delay:\s*(\d+)ms", style)
            if delay and delay.group(1) != "0":
                div["data-fade-delay"] = delay.group(1)
            style = re.sub(r"transition-delay:\s*[^;]+;?", "", style).strip()
            if style:
                div["style"] = style
            else:
                del div["style"]
    for a in prose.find_all("a", href=True):
        a["href"] = normalize_href(a["href"])
    return prose.decode_contents()


def extract(dist_dir: Path, slug: str) -> None:
    html = (dist_dir / slug / "index.html").read_text()
    soup = BeautifulSoup(html, "lxml")
    path = f"/{slug}/"

    # --- head strings ---
    full_title = soup.title.string
    assert full_title and full_title.endswith(BRAND_SUFFIX), full_title
    seo_title = full_title[: -len(BRAND_SUFFIX)]
    seo_description = soup.find("meta", attrs={"name": "description"})["content"]

    # --- JSON-LD ---
    schemas = [json.loads(s.string) for s in
               soup.find_all("script", type="application/ld+json")]
    article = next(s for s in schemas if s.get("@type") == "Article")
    faq_graph_wrapped = False
    faqs = None
    for s in schemas:
        if s.get("@type") == "FAQPage":
            faqs = s["mainEntity"]
        elif "@graph" in s:
            for g in s["@graph"]:
                if g.get("@type") == "FAQPage":
                    faqs = g["mainEntity"]
                    faq_graph_wrapped = True
    assert faqs, f"{slug}: no FAQPage schema found"
    faq_items = [
        {"question": q["name"], "answer": q["acceptedAnswer"]["text"]}
        for q in faqs
    ]

    # --- H1 / subtitle ---
    h1 = soup.find("h1")
    title = h1.get_text()
    subtitle = None
    sub_p = soup.find("p", class_=lambda c: c and "text-[17px]" in c)
    if sub_p:
        subtitle = sub_p.get_text()

    # --- readTime ---
    m = re.search(r"(\d+ min(?:ute)?s?) read", soup.get_text())
    read_time = m.group(1) if m else None
    assert read_time, f"{slug}: readTime not found"

    # --- breadcrumb variant ---
    breadcrumb = None
    trail = soup.find("div", class_=lambda c: c and "text-[13px]" in c and "mb-6" in c)
    if trail:
        links = [a.get_text() for a in trail.find_all("a")]
        if "Peptides" in links:
            breadcrumb = trail.find_all("span")[-1].get_text()

    # --- TOC ---
    toc_items = []
    toc_label = soup.find(string="Table of Contents")
    if toc_label:
        toc_nav = toc_label.find_parent().find_next_sibling("nav")
        if toc_nav:
            for a in toc_nav.find_all("a"):
                toc_items.append({"id": a["href"].lstrip("#"), "title": a.get_text()})

    # --- prose fragment ---
    prose = soup.find("div", class_="prose-strong-health")
    fragment_html = clean_fragment(prose)

    # --- citations ---
    citations = []
    refs = soup.find("section", id="references")
    for li in refs.find_all("li"):
        cid = int(li["id"].split("-")[1])
        a = li.find("a")
        if a:
            citations.append({"id": cid, "text": a.get_text(), "url": a["href"]})
        else:
            citations.append({"id": cid, "text": li.get_text()})

    # --- related links ---
    related = []
    rel_h = soup.find("h3", string="Related Articles")
    if rel_h:
        for a in rel_h.find_next_sibling("div").find_all("a"):
            related.append({
                "url": normalize_href(a["href"]),
                "label": a.get_text().lstrip("→ ").strip(),
            })

    # --- CTA section (after locations, before references) ---
    cta_heading = cta_text = cta_button = None
    for sec in soup.find_all("section"):
        h2 = sec.find("h2")
        if h2 and sec.find("a", href=lambda h: h and h.startswith("sms:")):
            cta_heading = h2.get_text()
            cta_text = sec.find("p").get_text()
            cta_button = sec.find("a", href=lambda h: h and h.startswith("sms:")).get_text()
            break

    dates = {
        "published": article["datePublished"],
        "modified": article.get("dateModified"),
    }

    # --- write fragment ---
    FRAGMENTS.mkdir(parents=True, exist_ok=True)
    (FRAGMENTS / f"{slug}.html").write_text(fragment_html)

    # --- write page ---
    j = lambda v: json.dumps(v, ensure_ascii=False)
    lines = [
        "---",
        f"// {path} — generated from rendered production HTML (source commit 9398453)",
        "// by scripts/extract-articles.py. Body text lives in the imported fragment;",
        "// FAQs/citations below feed BOTH the visible sections and the JSON-LD.",
        'import BlogArticleLayout from "../layouts/BlogArticleLayout.astro";',
        'import { faqPageSchema } from "../components/seo/schemas";',
        'import { ARTICLE_AUTHORSHIP } from "../data/articleAuthors";',
        f'import body from "../content/fragments/{slug}.html?raw";',
        "",
        f"const path = {j(path)};",
        f"const {{ author, reviewer }} = ARTICLE_AUTHORSHIP[path]!;",
        "",
        f"const faqs = {j(faq_items)};",
        "",
        f"const citations = {j(citations)};",
    ]
    if toc_items:
        lines.append("")
        lines.append(f"const tocItems = {j(toc_items)};")
    if related:
        lines.append("")
        lines.append(f"const relatedLinks = {j(related)};")
    lines.append("")
    if faq_graph_wrapped:
        lines += [
            "// Production wrapped this page's FAQPage schema in an @graph envelope.",
            "const { [\"@context\"]: _ctx, ...faqNoCtx } = faqPageSchema(faqs) as Record<string, unknown>;",
            'const structuredData = { "@context": "https://schema.org", "@graph": [faqNoCtx] };',
        ]
    else:
        lines.append("const structuredData = faqPageSchema(faqs);")
    lines.append("---")
    lines.append("")

    attrs = [
        f"  title={j(title)}",
        f"  seoTitle={j(seo_title)}",
    ]
    if subtitle:
        attrs.append(f"  subtitle={j(subtitle)}")
    attrs += [
        f"  seoDescription={j(seo_description)}",
        "  path={path}",
    ]
    if breadcrumb:
        attrs.append(f"  breadcrumb={j(breadcrumb)}")
    attrs += [
        "  author={author}",
        "  reviewer={reviewer}",
        f"  datePublishedISO={j(dates['published'])}",
    ]
    if dates["modified"]:
        attrs.append(f"  dateModifiedISO={j(dates['modified'])}")
    attrs.append(f"  readTime={j(read_time)}")
    if toc_items:
        attrs.append("  tocItems={tocItems}")
    attrs += [
        "  faqs={faqs}",
        "  citations={citations}",
    ]
    if related:
        attrs.append("  relatedLinks={relatedLinks}")
    attrs.append("  structuredData={structuredData}")
    if cta_heading:
        attrs.append(f"  ctaHeading={j(cta_heading)}")
    if cta_text:
        attrs.append(f"  ctaText={j(cta_text)}")
    if cta_button:
        attrs.append(f"  ctaButtonText={j(cta_button)}")

    lines.append("<BlogArticleLayout")
    lines.extend(attrs)
    lines.append(">")
    lines.append("  <Fragment set:html={body} />")
    lines.append("</BlogArticleLayout>")
    lines.append("")

    (PAGES / f"{slug}.astro").write_text("\n".join(lines))
    print(f"  ✓ {slug} (faqs={len(faq_items)}, citations={len(citations)}, "
          f"toc={len(toc_items)}, related={len(related)}, graph={faq_graph_wrapped})")


if __name__ == "__main__":
    dist = Path(sys.argv[1])
    for slug in sys.argv[2:]:
        extract(dist, slug)
