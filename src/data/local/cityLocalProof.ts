// Ported from src/pages/local/cityLocalProof.tsx (data + helpers only;
// LocalProofSection / ReferencesSection are Astro components in src/components/local/).

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

/**
 * Peptide use-case cross-links per city. Peptides are the sole service theme,
 * so every city page cross-links the "peptides for [outcome]" cluster. Vary
 * the spokes per city so inbound equity spreads across the full use-case set
 * rather than concentrating on two pages (internal-linking audit, Phase 2).
 */
const DEFAULT_PEPTIDE_USE_CASE_LINKS: RelatedInternalLink[] = [
  { label: "Peptides for Healing & Recovery (BPC-157)", href: "/peptides-for-healing/" },
  { label: "Peptides for Muscle Growth", href: "/peptides-for-muscle-growth/" },
  { label: "Peptides for Belly Fat (Tesamorelin)", href: "/peptides-for-belly-fat/" },
];

const PEPTIDE_USE_CASE_LINKS_BY_SLUG: Record<string, RelatedInternalLink[]> = {
  miami: [
    { label: "Peptides for healing & recovery (BPC-157)", href: "/peptides-for-healing/" },
    { label: "Peptides for muscle growth", href: "/peptides-for-muscle-growth/" },
    { label: "Peptides for libido & sexual health", href: "/peptides-for-libido/" },
  ],
  "delray-beach": [
    { label: "Peptides for arthritis & joint pain", href: "/peptides-for-arthritis/" },
    { label: "Peptides for anti-aging & longevity", href: "/peptides-for-anti-aging/" },
    { label: "Peptides for sleep & overnight recovery", href: "/peptides-for-sleep/" },
  ],
  "new-york": [
    { label: "Peptides for tendon & ligament repair", href: "/peptides-for-tendon-repair/" },
    { label: "Peptides for sleep & overnight recovery", href: "/peptides-for-sleep/" },
    { label: "Peptides for healing & recovery (BPC-157)", href: "/peptides-for-healing/" },
  ],
  "san-diego": [
    { label: "Peptides for sleep & recovery", href: "/peptides-for-sleep/" },
    { label: "GH peptides for lean muscle", href: "/peptides-for-muscle-growth/" },
    { label: "Peptides for healing & recovery (BPC-157)", href: "/peptides-for-healing/" },
  ],
  "las-vegas": [
    { label: "Peptides for muscle growth", href: "/peptides-for-muscle-growth/" },
    { label: "Peptides for healing & recovery (BPC-157)", href: "/peptides-for-healing/" },
    { label: "Peptides for belly fat (Tesamorelin)", href: "/peptides-for-belly-fat/" },
  ],
  atlanta: [
    { label: "Peptides for healing & recovery (BPC-157)", href: "/peptides-for-healing/" },
    { label: "Peptides for arthritis & joint pain", href: "/peptides-for-arthritis/" },
    { label: "GH peptides for lean muscle", href: "/peptides-for-muscle-growth/" },
  ],
  austin: [
    { label: "Peptides for belly fat (Tesamorelin)", href: "/peptides-for-belly-fat/" },
    { label: "Peptides for muscle growth", href: "/peptides-for-muscle-growth/" },
    { label: "Peptides for healing & recovery (BPC-157)", href: "/peptides-for-healing/" },
  ],
  tampa: [
    { label: "Peptides for arthritis & joint pain", href: "/peptides-for-arthritis/" },
    { label: "Peptides for healing & recovery (BPC-157)", href: "/peptides-for-healing/" },
    { label: "Collagen peptides guide", href: "/collagen-peptides/" },
  ],
};

/**
 * Build page-specific internal links for a city peptide page: the peptides
 * hub, a city-varied slice of the "peptides for [outcome]" cluster, Miami's
 * on-site body-composition extras, and the state/site hubs.
 */
export function defaultRelatedInternalLinks(
  slug: string,
  _cityName: string,
  _current: "peptide" = "peptide",
  statePrefix: string = "fl",
): RelatedInternalLink[] {
  const links: RelatedInternalLink[] = [
    { label: "Peptides Hub: All Peptide Therapies", href: "/peptides/" },
    ...(PEPTIDE_USE_CASE_LINKS_BY_SLUG[slug] ?? DEFAULT_PEPTIDE_USE_CASE_LINKS),
  ];
  if (slug === "miami") {
    links.push({ label: "DEXA Scan Miami clinic", href: "/fl/miami/dexascan/" });
  }
  // Molecule-layer cross-links (US-007): every location page links the
  // commonly-prescribed molecules so location → molecule equity flows.
  links.push(
    { label: "BPC-157 for healing & recovery", href: "/peptides/bpc-157/" },
    { label: "CJC-1295 / Ipamorelin for body composition", href: "/peptides/cjc-1295/" },
    { label: "Tesamorelin for visceral fat", href: "/peptides/tesamorelin/" },
    { label: "Browse the full molecule library", href: "/molecules/" },
  );
  const hubs: RelatedInternalLink[] =
    statePrefix === "fl"
      ? [
          { label: "All Strong Health Florida locations", href: "/fl/" },
          { label: "Strong Health peptide therapy hub", href: "/" },
        ]
      : [{ label: "Strong Health peptide therapy hub", href: "/" }];
  return [...links, ...hubs];
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
