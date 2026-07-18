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
    label: "Healing & Recovery",
    anchor: "peptides for healing and recovery",
  },
  "tendon-repair": {
    path: "/peptides-for-tendon-repair/",
    label: "Tendon & Ligament Repair",
    anchor: "peptides for tendon repair",
  },
  arthritis: {
    path: "/peptides-for-arthritis/",
    label: "Arthritis & Joint Pain",
    anchor: "peptides for arthritis",
  },
  "belly-fat": {
    path: "/peptides-for-belly-fat/",
    label: "Belly Fat & Visceral Fat",
    anchor: "peptides for belly fat",
  },
  "muscle-growth": {
    path: "/peptides-for-muscle-growth/",
    label: "Muscle Growth",
    anchor: "peptides for muscle growth",
  },
  "weight-loss": {
    path: "/peptides-for-weight-loss/",
    label: "Weight Loss",
    anchor: "peptides for weight loss",
  },
  libido: {
    path: "/peptides-for-libido/",
    label: "Libido & Sexual Health",
    anchor: "peptides for libido",
  },
  sleep: {
    path: "/peptides-for-sleep/",
    label: "Sleep & Recovery",
    anchor: "peptides for sleep",
  },
  "anti-aging": {
    path: "/peptides-for-anti-aging/",
    label: "Anti-Aging & Longevity",
    anchor: "peptides for anti-aging",
  },
  collagen: {
    path: "/collagen-peptides/",
    label: "Collagen & Connective Tissue",
    anchor: "collagen peptides",
  },
};
