// Goal-spoke metadata for molecule↔goal cross-links (US-005/US-006).
// Descriptive anchors only — never "read the guide".
import type { GoalSlug } from "./types";

export interface GoalPage {
  path: string;
  /** Display label for cards/headings. */
  label: string;
  /** Descriptive anchor text for in-content links. */
  anchor: string;
}

export const GOAL_PAGES: Record<GoalSlug, GoalPage> = {
  healing: {
    path: "/peptides-for-healing/",
    label: "Peptides for Healing",
    anchor: "peptides for healing and recovery",
  },
  "tendon-repair": {
    path: "/peptides-for-tendon-repair/",
    label: "Peptides for Tendon Repair",
    anchor: "peptides for tendon repair",
  },
  arthritis: {
    path: "/peptides-for-arthritis/",
    label: "Peptides for Arthritis",
    anchor: "peptides for arthritis",
  },
  "belly-fat": {
    path: "/peptides-for-belly-fat/",
    label: "Peptides for Belly Fat",
    anchor: "peptides for belly fat",
  },
  "muscle-growth": {
    path: "/peptides-for-muscle-growth/",
    label: "Peptides for Muscle Growth",
    anchor: "peptides for muscle growth",
  },
  "weight-loss": {
    path: "/peptides-for-weight-loss/",
    label: "Peptides for Weight Loss",
    anchor: "peptides for weight loss",
  },
  libido: {
    path: "/peptides-for-libido/",
    label: "Peptides for Libido",
    anchor: "peptides for libido",
  },
  sleep: {
    path: "/peptides-for-sleep/",
    label: "Peptides for Sleep",
    anchor: "peptides for sleep",
  },
  "anti-aging": {
    path: "/peptides-for-anti-aging/",
    label: "Peptides for Anti-Aging",
    anchor: "peptides for anti-aging",
  },
  collagen: {
    path: "/collagen-peptides/",
    label: "Collagen Peptides",
    anchor: "collagen peptides",
  },
  testosterone: {
    path: "/peptides-for-testosterone/",
    label: "Peptides for Testosterone",
    anchor: "peptides for testosterone",
  },
  skin: {
    path: "/peptides-for-skin/",
    label: "Peptides for Skin",
    anchor: "peptides for skin",
  },
  acne: {
    path: "/peptides-for-acne/",
    label: "Peptides for Acne",
    anchor: "peptides for acne",
  },
  hair: {
    path: "/peptides-for-hair-growth/",
    label: "Peptides for Hair Growth",
    anchor: "peptides for hair growth",
  },
  recovery: {
    path: "/peptides-for-recovery/",
    label: "Peptides for Recovery",
    anchor: "peptides for recovery",
  },
  brain: {
    path: "/peptides-for-brain/",
    label: "Peptides for Brain & Focus",
    anchor: "peptides for brain, focus, and mood",
  },
  "gut-health": {
    path: "/peptides-for-gut-health/",
    label: "Peptides for Gut Health",
    anchor: "peptides for gut health",
  },
  energy: {
    path: "/peptides-for-energy/",
    label: "Peptides for Energy",
    anchor: "peptides for energy",
  },
};
