// Ported from src/pages/local/cityLocalProof.tsx (data + helpers only;
// LocalProofSection / ReferencesSection are Astro components in src/components/local/).
import { ALL_CITIES } from "./cityTrtConfig";
import { ALL_WEIGHT_LOSS_CITIES } from "./cityWeightLossConfig";
import { ALL_PEPTIDE_CITIES } from "./cityPeptideConfig";

export interface ReviewLink {
  label: string;
  url: string;
}

export interface OutboundCitation {
  label: string;
  url: string;
}

export interface RelatedInternalLink {
  label: string;
  href: string;
}

export interface LocalProofClinic {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  hoursDisplay: string;
}

export interface LocalProofData {
  /** Whether this page represents a real walk-in physical clinic. */
  physicalClinic: boolean;
  cityName: string;
  serviceName: string;
  clinic: LocalProofClinic;
  parkingTransit: string;
  physicianAvailability: string;
  appointmentExpectations: string;
  neighborhoodsServed: string[];
  reviewLinks: ReviewLink[];
  relatedInternalLinks: RelatedInternalLink[];
  /** Full state name for service-area copy (US-N1). Defaults to "Florida". */
  stateName?: string;
  /** State abbreviation for service-area copy (US-N1). Defaults to "FL". */
  stateAbbr?: string;
}

export const DEFAULT_APPOINTMENT_EXPECTATIONS =
  "Free first assessment, typically 30–45 minutes. Bring a photo ID and a list of any current medications. If labs are part of the visit, please arrive fasted (water is fine). Most patients are seen within 5 business days of booking.";

/**
 * Default external review-source links. Returns the verified Strong Health
 * Trustpilot profile and a Google Maps lookup for the named clinic. We do not
 * link Yelp/Healthgrades search pages by default — those are queries, not
 * verified profiles, and surface unrelated competitors.
 */
export function defaultReviewLinks(cityName: string, clinicName: string): ReviewLink[] {
  return [
    {
      label: "Trustpilot reviews for Strong Health",
      url: "https://www.trustpilot.com/review/stronghealth.com",
    },
    {
      label: `Google Business Profile — ${clinicName}`,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${clinicName}, ${cityName}, FL`,
      )}`,
    },
  ];
}

type Service = "trt" | "peptide" | "weight-loss";

const SERVICE_LABELS: Record<Service, string> = {
  trt: "TRT in",
  peptide: "Peptide therapy in",
  "weight-loss": "Weight loss clinic in",
};

const SERVICE_PATHS: Record<Service, string> = {
  trt: "trt-therapy",
  peptide: "peptide-therapy",
  "weight-loss": "weight-loss-clinic",
};

// Per-service city membership (US-N1): a sibling-service link is only emitted
// when the city actually has a page in that service's config.
const SERVICE_SLUGS: Record<Service, Set<string>> = {
  trt: new Set(ALL_CITIES.map((c) => c.slug)),
  peptide: new Set(ALL_PEPTIDE_CITIES.map((c) => c.slug)),
  "weight-loss": new Set(ALL_WEIGHT_LOSS_CITIES.map((c) => c.slug)),
};

/**
 * Build page-specific internal links: the sibling services that exist in the
 * same city, service-specific extras, the state hub (Florida only), and the
 * site hub. Cities with no sibling pages (e.g. New York, peptide-only
 * telehealth service area) get peptides-hub + /peptides/-cluster links
 * instead (US-N1).
 */
export function defaultRelatedInternalLinks(
  slug: string,
  cityName: string,
  current: Service,
  statePrefix: string = "fl",
): RelatedInternalLink[] {
  const others: Service[] = (Object.keys(SERVICE_LABELS) as Service[]).filter(
    (s) => s !== current,
  );
  const siblings = others
    .filter((s) => SERVICE_SLUGS[s].has(slug))
    .map((s) => ({
      label: `${SERVICE_LABELS[s]} ${cityName}`,
      href: `/${statePrefix}/${slug}/${SERVICE_PATHS[s]}/`,
    }));
  const extras: RelatedInternalLink[] = [];
  if (slug === "miami") {
    extras.push({
      label: `DEXA Scan ${cityName} clinic`,
      href: "/fl/miami/dexascan/",
    });
  }
  if (current === "trt") {
    extras.push(
      {
        label: "Foods That Lower Testosterone (evidence review)",
        href: "/foods-that-lower-testosterone/",
      },
      {
        label: "Porn-Induced Erectile Dysfunction: Causes & Recovery",
        href: "/porn-induced-erectile-dysfunction/",
      },
    );
  } else if (current === "weight-loss") {
    extras.push(
      {
        label: "Semaglutide Diet: Complete Guide for Weight Loss",
        href: "/semaglutide-diet/",
      },
      {
        label: "DEXA Scan: Gold Standard for Body Composition",
        href: "/dexa-scan/",
      },
    );
  } else if (current === "peptide") {
    extras.push({
      label: "Peptides Hub: All Peptide Therapies",
      href: "/peptides/",
    });
    if (siblings.length === 0) {
      // Peptide-only service area (no TRT/weight-loss city pages, e.g. New
      // York): cross-link the /peptides/ content cluster instead (US-N1).
      extras.push(
        {
          label: "Peptides for Healing & Recovery (BPC-157)",
          href: "/peptides-for-healing/",
        },
        {
          label: "Peptides for Muscle Growth",
          href: "/peptides-for-muscle-growth/",
        },
        {
          label: "Peptides for Belly Fat (Tesamorelin)",
          href: "/peptides-for-belly-fat/",
        },
      );
    }
  }
  const hubs: RelatedInternalLink[] =
    statePrefix === "fl"
      ? [
          { label: "All Strong Health Florida clinics", href: "/fl/" },
          { label: "Strong Health services hub", href: "/" },
        ]
      : [{ label: "Strong Health services hub", href: "/" }];
  return [...siblings, ...extras, ...hubs];
}

export function defaultPhysicianAvailability(physicianName?: string): string {
  if (physicianName) {
    return `${physicianName} and the Strong Health attending team see new patients in person Monday through Friday, with limited Saturday morning slots. Telehealth follow-ups are available statewide after the in-person baseline visit.`;
  }
  return "Strong Health attending physicians see new patients in person Monday through Friday, with limited Saturday morning slots. Telehealth follow-ups are available statewide after the in-person baseline visit.";
}

export const DEFAULT_PEPTIDE_CITATIONS: OutboundCitation[] = [
  {
    label:
      "Sikiric P, et al. — BPC-157 stable gastric pentadecapeptide and tendon healing (PubMed/NIH)",
    url: "https://pubmed.ncbi.nlm.nih.gov/29345863/",
  },
  {
    label:
      "Falutz J, et al. — Tesamorelin for HIV-associated abdominal fat accumulation (NEJM, NIH)",
    url: "https://pubmed.ncbi.nlm.nih.gov/17916777/",
  },
  {
    label:
      "Diamond LE, et al. — PT-141 (bremelanotide) for hypoactive sexual desire disorder (FDA-approved label, U.S. National Library of Medicine)",
    url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=27a6a3df-78e2-43c2-b0e2-9c6eaa39de7b",
  },
];
