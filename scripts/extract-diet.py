#!/usr/bin/env python3
"""
US-007 migration tool: generate the two diet pages the same way as
extract-articles.py, but splice the interactive AccordionFoodList components
(whose food items production only rendered after a click, so they are MISSING
from the prerendered HTML) back in as Astro <AccordionFoodList> instances fed
by the food-group arrays lifted from the page's TSX source.

Usage: venv/bin/python scripts/extract-diet.py <dist_public_dir> <monorepo_src_dir>
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).parent))
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
PAGES = REPO / "src" / "pages"

# slug -> (tsx file, [(array_name, variant), ...] in DOM order)
DIET_PAGES = {
    "semaglutide-diet": ("pages/diet/SemaglutideDiet.tsx",
                         [("foodsToEat", "eat"), ("foodsToAvoid", "avoid")]),
    "stillman-diet": ("pages/diet/StillmanDiet.tsx",
                      [("foodsToEat", "eat"), ("foodsToAvoid", "avoid")]),
}


def extract_array_literal(tsx: str, name: str) -> object:
    """Pull `const <name>: T = [...]` out of the TSX and evaluate it via node."""
    m = re.search(rf"const {name}[^=]*=\s*(\[)", tsx)
    assert m, f"array {name} not found"
    start = m.start(1)
    depth = 0
    for i in range(start, len(tsx)):
        if tsx[i] == "[":
            depth += 1
        elif tsx[i] == "]":
            depth -= 1
            if depth == 0:
                literal = tsx[start:i + 1]
                break
    out = subprocess.run(
        ["node", "-e", f"console.log(JSON.stringify({literal}))"],
        capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def find_accordion_roots(prose):
    """Accordion roots: div.mb-6 whose direct child div.flex.flex-col.gap-2
    contains buttons with a '(N)' count span (AccordionFoodList markup)."""
    roots = []
    for div in prose.find_all("div", class_="mb-6"):
        inner = div.find("div", class_=lambda c: c and "gap-2" in c, recursive=False)
        if not inner:
            continue
        btn = inner.find("button")
        if btn and re.search(r"\(\d+\)", btn.get_text()):
            roots.append(div)
    return roots


def extract_diet(dist_dir: Path, src_dir: Path, slug: str) -> None:
    html = (dist_dir / slug / "index.html").read_text()
    soup = BeautifulSoup(html, "lxml")
    path = f"/{slug}/"
    tsx_file, accordions = DIET_PAGES[slug]
    tsx = (src_dir / tsx_file).read_text()

    prose = soup.find("div", class_="prose-strong-health")
    roots = find_accordion_roots(prose)
    assert len(roots) == len(accordions), \
        f"{slug}: found {len(roots)} accordions, expected {len(accordions)}"
    for i, root in enumerate(roots):
        marker = soup.new_string(f"@@ACCORDION_{i}@@")
        root.replace_with(marker)

    fragment_html = ea.clean_fragment(prose)
    segments = re.split(r"@@ACCORDION_\d+@@", fragment_html)
    assert len(segments) == len(accordions) + 1

    FRAGMENTS.mkdir(parents=True, exist_ok=True)
    seg_names = []
    for i, seg in enumerate(segments):
        name = f"{slug}.{i}.html"
        (FRAGMENTS / name).write_text(seg)
        seg_names.append(name)

    # ---- everything below mirrors extract-articles.py ----
    full_title = soup.title.string
    seo_title = full_title[: -len(ea.BRAND_SUFFIX)]
    seo_description = soup.find("meta", attrs={"name": "description"})["content"]
    schemas = [json.loads(s.string) for s in
               soup.find_all("script", type="application/ld+json")]
    article = next(s for s in schemas if s.get("@type") == "Article")
    faqs = None
    faq_graph_wrapped = False
    for s in schemas:
        if s.get("@type") == "FAQPage":
            faqs = s["mainEntity"]
        elif "@graph" in s:
            for g in s["@graph"]:
                if g.get("@type") == "FAQPage":
                    faqs = g["mainEntity"]
                    faq_graph_wrapped = True
    faq_items = [{"question": q["name"], "answer": q["acceptedAnswer"]["text"]}
                 for q in faqs]

    title = soup.find("h1").get_text()
    sub_p = soup.find("p", class_=lambda c: c and "text-[17px]" in c)
    subtitle = sub_p.get_text() if sub_p else None
    m = re.search(r"(\d+ min(?:ute)?s?) read", soup.get_text())
    read_time = m.group(1)

    toc_items = []
    toc_label = soup.find(string="Table of Contents")
    if toc_label:
        toc_nav = toc_label.find_parent().find_next_sibling("nav")
        if toc_nav:
            for a in toc_nav.find_all("a"):
                toc_items.append({"id": a["href"].lstrip("#"), "title": a.get_text()})

    citations = []
    refs = soup.find("section", id="references")
    for li in refs.find_all("li"):
        cid = int(li["id"].split("-")[1])
        a = li.find("a")
        if a:
            citations.append({"id": cid, "text": a.get_text(), "url": a["href"]})
        else:
            citations.append({"id": cid, "text": li.get_text()})

    related = []
    rel_h = soup.find("h3", string="Related Articles")
    if rel_h:
        for a in rel_h.find_next_sibling("div").find_all("a"):
            related.append({"url": ea.normalize_href(a["href"]),
                            "label": a.get_text().lstrip("→ ").strip()})

    cta_heading = cta_text = cta_button = None
    for sec in soup.find_all("section"):
        h2 = sec.find("h2")
        if h2 and sec.find("a", href=lambda h: h and h.startswith("sms:")):
            cta_heading = h2.get_text()
            cta_text = sec.find("p").get_text()
            cta_button = sec.find("a", href=lambda h: h and h.startswith("sms:")).get_text()
            break

    j = lambda v: json.dumps(v, ensure_ascii=False)
    lines = [
        "---",
        f"// {path} — generated from rendered production HTML (source commit 9398453)",
        "// by scripts/extract-diet.py. AccordionFoodList food groups are lifted from",
        "// the TSX source because production HTML omitted closed-accordion items.",
        'import BlogArticleLayout from "../layouts/BlogArticleLayout.astro";',
        'import AccordionFoodList from "../components/diet/AccordionFoodList.astro";',
        'import { faqPageSchema } from "../components/seo/schemas";',
        'import { ARTICLE_AUTHORSHIP } from "../data/articleAuthors";',
    ]
    for i, name in enumerate(seg_names):
        lines.append(f'import body{i} from "../content/fragments/{name}?raw";')
    lines += [
        "",
        f"const path = {j(path)};",
        "const { author, reviewer } = ARTICLE_AUTHORSHIP[path]!;",
        "",
        f"const faqs = {j(faq_items)};",
        "",
        f"const citations = {j(citations)};",
    ]
    for arr_name, _variant in dict.fromkeys(accordions):
        data = extract_array_literal(tsx, arr_name)
        lines.append("")
        lines.append(f"const {arr_name} = {j(data)};")
    if toc_items:
        lines += ["", f"const tocItems = {j(toc_items)};"]
    if related:
        lines += ["", f"const relatedLinks = {j(related)};"]
    lines.append("")
    if faq_graph_wrapped:
        lines += [
            "// Production wrapped this page's FAQPage schema in an @graph envelope.",
            "const { [\"@context\"]: _ctx, ...faqNoCtx } = faqPageSchema(faqs) as Record<string, unknown>;",
            'const structuredData = { "@context": "https://schema.org", "@graph": [faqNoCtx] };',
        ]
    else:
        lines.append("const structuredData = faqPageSchema(faqs);")
    lines += ["---", ""]

    attrs = [f"  title={j(title)}", f"  seoTitle={j(seo_title)}"]
    if subtitle:
        attrs.append(f"  subtitle={j(subtitle)}")
    attrs += [f"  seoDescription={j(seo_description)}", "  path={path}",
              "  author={author}", "  reviewer={reviewer}",
              f"  datePublishedISO={j(article['datePublished'])}"]
    if article.get("dateModified"):
        attrs.append(f"  dateModifiedISO={j(article['dateModified'])}")
    attrs.append(f"  readTime={j(read_time)}")
    if toc_items:
        attrs.append("  tocItems={tocItems}")
    attrs += ["  faqs={faqs}", "  citations={citations}"]
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
    for i in range(len(seg_names)):
        lines.append(f"  <Fragment set:html={{body{i}}} />")
        if i < len(accordions):
            arr_name, variant = accordions[i]
            lines.append(f'  <AccordionFoodList groups={{{arr_name}}} variant="{variant}" />')
    lines.append("</BlogArticleLayout>")
    lines.append("")

    (PAGES / f"{slug}.astro").write_text("\n".join(lines))
    print(f"  ✓ {slug} (segments={len(seg_names)}, accordions={len(accordions)}, "
          f"faqs={len(faq_items)}, citations={len(citations)})")


if __name__ == "__main__":
    dist = Path(sys.argv[1])
    src = Path(sys.argv[2])
    for slug in DIET_PAGES:
        extract_diet(dist, src, slug)
