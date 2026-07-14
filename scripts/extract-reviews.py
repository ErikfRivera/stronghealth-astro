#!/usr/bin/env python3
"""
US-008 migration tool: generate the 5 review pages from rendered production
HTML. Layout metadata (title/seoTitle/blurb/badge/dates/readTime) comes from
src/data/reviews.ts at render time via getReview(path); the page body is the
extracted prose fragment. The visible FAQ section is spliced out of the
fragment and re-rendered from the same faqs array that feeds the FAQPage
JSON-LD (single source). Product schema fields (name/rating/count) are read
from the production Product JSON-LD.

Usage: venv/bin/python scripts/extract-reviews.py <dist_public_dir>
"""
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup
import importlib.util

spec = importlib.util.spec_from_file_location(
    "ea", Path(__file__).parent / "extract-articles.py")
ea = importlib.util.module_from_spec(spec)
_argv = sys.argv
sys.argv = ["x"]
spec.loader.exec_module(ea)
sys.argv = _argv

REPO = Path(__file__).resolve().parent.parent
FRAGMENTS = REPO / "src" / "content" / "fragments"
PAGES = REPO / "src" / "pages" / "reviews"

SLUGS = ["low-t-center", "andro-400", "nugenix-ultimate-testosterone",
         "elysium-basis-review", "revita"]


def extract_review(dist_dir: Path, slug: str) -> None:
    html = (dist_dir / "reviews" / slug / "index.html").read_text()
    soup = BeautifulSoup(html, "lxml")
    path = f"/reviews/{slug}/"

    schemas = [json.loads(s.string) for s in
               soup.find_all("script", type="application/ld+json")]
    faqs = next(s for s in schemas if s.get("@type") == "FAQPage")["mainEntity"]
    faq_items = [{"question": q["name"], "answer": q["acceptedAnswer"]["text"]}
                 for q in faqs]
    product = next((s for s in schemas if s.get("@type") == "Product"), None)
    article = next(s for s in schemas if s.get("@type") == "Article")

    prose = soup.find("div", class_="prose-strong-health")

    # Splice the visible FAQ section (section.my-12 whose h2 is the FAQ
    # heading) so it can be re-rendered from the shared faqs array.
    faq_section = None
    for sec in prose.find_all("section"):
        h2 = sec.find("h2")
        if h2 and "Frequently Asked Questions" in h2.get_text():
            faq_section = sec
            break
    assert faq_section is not None, f"{slug}: FAQ section not found in prose"
    faq_section.replace_with(soup.new_string("@@FAQ@@"))

    fragment_html = ea.clean_fragment(prose)
    seg0, seg1 = fragment_html.split("@@FAQ@@")
    (FRAGMENTS / f"reviews-{slug}.0.html").write_text(seg0)
    (FRAGMENTS / f"reviews-{slug}.1.html").write_text(seg1)

    # relatedLinks prop (rendered after prose by the layout)
    related = []
    rel_h = soup.find("h3", string="Related Articles")
    if rel_h:
        for a in rel_h.find_next_sibling("div").find_all("a"):
            related.append({"url": ea.normalize_href(a["href"]),
                            "label": a.get_text().lstrip("→ ").strip()})

    j = lambda v: json.dumps(v, ensure_ascii=False)

    sd = {"type": "product" if product else "competitor"}
    if product:
        sd["productName"] = product["name"]
        rating = product.get("review", {}).get("reviewRating", {}).get("ratingValue")
        if rating is not None:
            sd["productRating"] = rating
        agg = product.get("aggregateRating")
        if agg:
            sd["productReviewCount"] = agg.get("reviewCount")

    lines = [
        "---",
        f"// {path} — generated from rendered production HTML (source commit 9398453)",
        "// by scripts/extract-reviews.py. Metadata comes from src/data/reviews.ts;",
        "// the faqs array below feeds BOTH the visible FAQ section and the FAQPage",
        "// JSON-LD emitted by the layout.",
        'import ReviewArticleLayout from "../../layouts/ReviewArticleLayout.astro";',
        'import ReviewFAQSection from "../../components/review/ReviewFAQSection.astro";',
        'import { getReview } from "../../data/reviews";',
        f'import body0 from "../../content/fragments/reviews-{slug}.0.html?raw";',
        f'import body1 from "../../content/fragments/reviews-{slug}.1.html?raw";',
        "",
        f"const review = getReview({j(path)});",
        "",
        f"const faqs = {j(faq_items)};",
    ]
    if related:
        lines += ["", f"const relatedLinks = {j(related)};"]
    lines += [
        "",
        "const structuredData = {",
        f"  type: {j(sd['type'])} as const,",
        "  title: review.title,",
        "  description: review.blurb,",
        "  datePublished: review.datePublished,",
        "  dateModified: review.dateModified,",
        "  faqs,",
    ]
    if "productName" in sd:
        lines.append(f"  productName: {j(sd['productName'])},")
    if "productRating" in sd:
        lines.append(f"  productRating: {sd['productRating']},")
    if "productReviewCount" in sd:
        lines.append(f"  productReviewCount: {sd['productReviewCount']},")
    lines += [
        "};",
        "---",
        "",
        "<ReviewArticleLayout",
        "  title={review.title}",
        "  seoTitle={review.seoTitle}",
        "  subtitle={review.blurb}",
        "  badge={review.badge}",
        "  datePublished={review.datePublished}",
        "  dateModified={review.dateModified}",
        "  readTime={review.readTime}",
        "  structuredData={structuredData}",
        "  path={review.path}",
    ]
    if related:
        lines.append("  relatedLinks={relatedLinks}")
    lines += [
        ">",
        "  <Fragment set:html={body0} />",
        "  <ReviewFAQSection faqs={faqs} />",
        "  <Fragment set:html={body1} />",
        "</ReviewArticleLayout>",
        "",
    ]

    PAGES.mkdir(parents=True, exist_ok=True)
    (PAGES / f"{slug}.astro").write_text("\n".join(lines))
    print(f"  ✓ reviews/{slug} (faqs={len(faq_items)}, product={bool(product)}, "
          f"related={len(related)})")


if __name__ == "__main__":
    dist = Path(sys.argv[1])
    for slug in SLUGS:
        extract_review(dist, slug)
