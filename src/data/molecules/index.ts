// Molecule library registry (US-004/US-005). Adding a molecule = add its
// config file and one line here; the hub, nav, dynamic routes, sibling links,
// and goal→molecule cross-links all derive from this array.
import type { GoalSlug, MoleculeConfig, MoleculeGroup } from "./types";
import { BPC_157 } from "./bpc-157";
import { TB_500 } from "./tb-500";
import { CJC_1295 } from "./cjc-1295";
import { IPAMORELIN } from "./ipamorelin";
import { SERMORELIN } from "./sermorelin";
import { TESAMORELIN } from "./tesamorelin";
import { PT_141 } from "./pt-141";
import { DSIP } from "./dsip";
import { AOD_9604 } from "./aod-9604";
import { GHK_CU } from "./ghk-cu";
import { MOTS_C } from "./mots-c";
import { SEMAGLUTIDE } from "./semaglutide";
import { TIRZEPATIDE } from "./tirzepatide";
import { LL_37 } from "./ll-37";
import { EPITHALON } from "./epithalon";
import { KISSPEPTIN } from "./kisspeptin";
import { SELANK } from "./selank";

export const MOLECULES: MoleculeConfig[] = [
  BPC_157,
  TB_500,
  CJC_1295,
  IPAMORELIN,
  SERMORELIN,
  TESAMORELIN,
  PT_141,
  DSIP,
  AOD_9604,
  GHK_CU,
  MOTS_C,
  SEMAGLUTIDE,
  TIRZEPATIDE,
  LL_37,
  EPITHALON,
  KISSPEPTIN,
  SELANK,
];

/** Display order for the /molecules/ hub groups. */
export const MOLECULE_GROUP_ORDER: MoleculeGroup[] = [
  "Healing & Repair",
  "GH Secretagogues",
  "Metabolic & GLP-1",
  "Sexual Health",
  "Sleep",
  "Longevity",
  "Cosmetic & Other",
];

export function getMolecule(slug: string): MoleculeConfig | undefined {
  return MOLECULES.find((m) => m.slug === slug);
}

export function moleculePath(slug: string): string {
  return `/peptides/${slug}/`;
}

/** Molecules grouped by their `group`, in hub display order. */
export function moleculesByGroup(): { group: MoleculeGroup; items: MoleculeConfig[] }[] {
  return MOLECULE_GROUP_ORDER.map((group) => ({
    group,
    items: MOLECULES.filter((m) => m.group === group),
  })).filter((g) => g.items.length > 0);
}

/**
 * Reverse mapping: every molecule that serves a given goal. Drives the
 * "molecules in this guide" module on goal spokes (US-006), so goal→molecule
 * links stay in sync with each molecule's `goals` array.
 */
export function moleculesForGoal(goal: GoalSlug): MoleculeConfig[] {
  return MOLECULES.filter((m) => m.goals.includes(goal));
}

/** Up to `n` sibling molecules in the same group (excludes `slug`). */
export function siblingMolecules(slug: string, n = 3): MoleculeConfig[] {
  const self = getMolecule(slug);
  if (!self) return [];
  const sameGroup = MOLECULES.filter((m) => m.slug !== slug && m.group === self.group);
  if (sameGroup.length >= n) return sameGroup.slice(0, n);
  // Backfill from goal-adjacent molecules so every page gets 2–3 siblings.
  const goalAdjacent = MOLECULES.filter(
    (m) =>
      m.slug !== slug &&
      m.group !== self.group &&
      m.goals.some((g) => self.goals.includes(g)),
  );
  return [...sameGroup, ...goalAdjacent].slice(0, n);
}
