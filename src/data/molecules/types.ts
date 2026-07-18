// Molecule library types (peptide repositioning, US-004/US-005).
//
// Every molecule page renders from one MoleculeConfig via
// src/layouts/MoleculePage.astro + src/pages/molecules/[slug].astro. The
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
  | "collagen";

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
}
