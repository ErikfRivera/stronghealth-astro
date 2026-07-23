// Molecule library types (peptide repositioning, US-004/US-005).
//
// Every molecule page renders from one MoleculeConfig via
// src/layouts/MoleculePage.astro + src/pages/peptides/[slug].astro. The
// `goals` array is the single source of truth for goal↔molecule cross-links:
// the molecule page links each goal spoke, and the goal spokes render their
// "molecules in this guide" module from the same data (US-006) — so the
// bidirectional linking can never drift.

export type MoleculeGroup =
  | "Healing & Repair"
  | "GH Secretagogues"
  | "Metabolic & GLP-1"
  | "Sexual Health"
  | "Sleep"
  | "Longevity"
  | "Cosmetic & Other";

/** Goal-spoke slugs — keys into GOAL_PAGES (goals.ts). */
export type GoalSlug =
  | "healing"
  | "tendon-repair"
  | "arthritis"
  | "belly-fat"
  | "muscle-growth"
  | "weight-loss"
  | "libido"
  | "sleep"
  | "anti-aging"
  | "collagen"
  | "testosterone"
  | "skin"
  | "acne"
  | "hair"
  | "recovery"
  | "brain"
  | "gut-health"
  | "energy"
  | "tanning";

export interface MoleculeFAQ {
  question: string;
  answer: string;
}

export interface MoleculeCitation {
  id: number;
  text: string;
  url?: string;
}

export interface MoleculeUseCase {
  heading: string;
  desc: string;
}

export interface MoleculeConfig {
  slug: string;
  /** Display name and H1, e.g. "BPC-157". */
  name: string;
  aliases: string[];
  group: MoleculeGroup;
  /** Goal spokes this molecule serves — drives bidirectional cross-links. */
  goals: GoalSlug[];
  /** Raw <title> (layout appends " | Strong Health"; keep ≤44 chars). */
  seoTitle: string;
  /** Meta description, 120–160 chars (check-seo gate). */
  metaDescription: string;
  /** Hero subtitle — one or two sentences. */
  tagline: string;
  /** One-line primary use shown on the /molecules/ hub card. */
  primaryUse: string;
  datePublishedISO: string;
  dateModifiedISO: string;
  /** What it is — paragraphs. */
  whatItIs: string[];
  /** Mechanism of action — paragraphs. */
  mechanism: string[];
  /** What it's used for — clinical use-case cards. */
  usedFor: MoleculeUseCase[];
  /** Evidence — paragraphs; cite with [n] markers matching `citations`. */
  evidence: string[];
  /** Dosing & administration context — paragraphs. Clinical context, never
   * prescriptive instructions (YMYL). */
  dosingContext: string[];
  /** Safety & side effects — paragraphs. */
  safety: string[];
  /** Common side effects — short bullet list. */
  commonSideEffects: string[];
  /** Contraindications / who should not use — short bullet list. */
  contraindications: string[];
  /** How Strong Health prescribes it — paragraphs (503A/503B, labs,
   * monitoring). */
  howWePrescribe: string[];
  faqs: MoleculeFAQ[];
  citations: MoleculeCitation[];
  /** Optional regulatory status callout (e.g. FDA-approved medications vs.
   * compounded-peptide clinical context). */
  regulatoryNote?: string;
  /** When true, this molecule is documented for education/SEO but Strong
   * Health does NOT prescribe or provide it (e.g. unregulated Melanotan II).
   * The page swaps its "how we prescribe" CTA for an honest "we don't offer
   * this" callout instead of a booking push. */
  weDoNotOffer?: boolean;
  /** Body copy for the weDoNotOffer callout. Defaults to the skin/pigment
   * wording used by Melanotan II. Only read when `weDoNotOffer` is true. */
  doNotOfferBody?: string;
  /** Label for the weDoNotOffer callout's booking button. Defaults to the
   * skin/safety wording. Only read when `weDoNotOffer` is true. */
  doNotOfferCtaLabel?: string;
  /** Trailing guide links for the weDoNotOffer callout. Defaults to the
   * skin/tanning/library set. Only read when `weDoNotOffer` is true. */
  doNotOfferLinks?: { label: string; href: string }[];
}
