export type ReviewStructuredDataType = "product" | "competitor";

export interface ReviewMeta {
  path: string;
  title: string;
  /** Optional shorter title used for the <title> tag so the final string + brand suffix stays ≤60 chars. Falls back to `title`. */
  seoTitle?: string;
  /** Short label used in compact UI (e.g. footer link columns). */
  shortTitle: string;
  blurb: string;
  badge: string;
  datePublished: string;
  dateModified: string;
  readTime: string;
  structuredDataType: ReviewStructuredDataType;
}

export const reviews: ReviewMeta[] = [
  {
    path: "/reviews/low-t-center/",
    title:
      "Low T Center vs. Strong Health: An Honest Comparison of TRT Providers",
    seoTitle: "Low T Center vs. Strong Health: TRT Review",
    shortTitle: "Low T Center",
    blurb:
      "A fair, evidence-based comparison of the Low T Center franchise model and Strong Health's physician-supervised approach to testosterone replacement therapy.",
    badge: "Competitor Comparison",
    datePublished: "2025-11-15",
    dateModified: "2026-03-15",
    readTime: "12 min read",
    structuredDataType: "competitor",
  },
  {
    path: "/reviews/andro-400/",
    title: "Andro 400 Review: Does This Testosterone Booster Actually Work?",
    seoTitle: "Andro 400 Review: Evidence, Risks & Cost",
    shortTitle: "Andro 400",
    blurb:
      "An evidence-based review of Andro 400's eurycoma longifolia formula: what the science says, what it can't do, and when physician TRT is the smarter path.",
    badge: "Supplement Review",
    datePublished: "2025-10-20",
    dateModified: "2026-03-10",
    readTime: "10 min read",
    structuredDataType: "product",
  },
  {
    path: "/reviews/nugenix-ultimate-testosterone/",
    title: "Nugenix Ultimate Testosterone Review: Hype vs. Evidence",
    seoTitle: "Nugenix Ultimate Review: Evidence & Risks",
    shortTitle: "Nugenix",
    blurb:
      "A critical review of Nugenix Ultimate Testosterone's Testofen formula: what the studies show, the real cost, and how it compares to physician-led TRT.",
    badge: "Supplement Review",
    datePublished: "2025-09-15",
    dateModified: "2026-03-12",
    readTime: "11 min read",
    structuredDataType: "product",
  },
  {
    path: "/reviews/elysium-basis-review/",
    title:
      "Elysium Basis Review: Can an NAD+ Supplement Replace Hormone Therapy?",
    seoTitle: "Elysium Basis Review: NAD+ vs. Hormones",
    shortTitle: "Elysium Basis",
    blurb:
      "An honest look at Elysium Basis: the science behind NAD+ and Nicotinamide Riboside, what it can and can't do for men, and where hormone therapy fits in.",
    badge: "Supplement Review",
    datePublished: "2025-08-10",
    dateModified: "2026-03-08",
    readTime: "10 min read",
    structuredDataType: "product",
  },
  {
    path: "/reviews/revita/",
    title:
      "Revita Hair Loss Shampoo Review: The Hormone-Hair Connection Most Products Ignore",
    seoTitle: "Revita Shampoo Review: The Hormone-Hair Link",
    shortTitle: "Revita",
    blurb:
      "Evidence-based review of DS Laboratories Revita: what its ingredients do for thinning hair, why hormones are the missing piece, and the smarter path for men.",
    badge: "Product Review",
    datePublished: "2025-07-25",
    dateModified: "2026-03-05",
    readTime: "9 min read",
    structuredDataType: "product",
  },
];

export function getReview(path: string): ReviewMeta {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  const found = reviews.find((r) => r.path === normalized);
  if (!found) {
    throw new Error(`Unknown review path: ${path}`);
  }
  return found;
}
