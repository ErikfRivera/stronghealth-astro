export const SITE_URL = "https://www.stronghealth.com";

export const STRONG_HEALTH_ORG_ID = `${SITE_URL}/#organization`;

export const MIAMI_BRICKELL_CLINIC = {
  name: "Strong Health Miami",
  streetAddress: "1000 Brickell Plaza",
  city: "Miami",
  state: "FL",
  postalCode: "33131",
  phone: "(754) 263-6026",
  phoneTel: "+17542636026",
  phoneHref: "tel:+17542636026",
  hours: "Mon–Fri 8:00 AM – 6:00 PM | Sat 9:00 AM – 1:00 PM",
  hoursWeekday: { opens: "08:00", closes: "18:00" },
  hoursSaturday: { opens: "09:00", closes: "13:00" },
  lat: 25.7631,
  lng: -80.1898,
  area: "Brickell",
  directions:
    "Parking available at Brickell Plaza garage. Metrorail: Brickell station (0.3 mi). I-95 exit 1A, turn east on SW 13th St.",
  schemaId: `${SITE_URL}/#strong-health-miami`,
} as const;

export const MIAMI_BRICKELL_FULL_ADDRESS = `${MIAMI_BRICKELL_CLINIC.streetAddress}, ${MIAMI_BRICKELL_CLINIC.city}, ${MIAMI_BRICKELL_CLINIC.state} ${MIAMI_BRICKELL_CLINIC.postalCode}`;

/**
 * Primary NAP phone for the entire site. Every visible phone number, every
 * `tel:` link, and every schema `telephone` field should read from here so we
 * never ship placeholder ("555") numbers again.
 */
export const STRONG_HEALTH_PHONE_DISPLAY = MIAMI_BRICKELL_CLINIC.phone;
export const STRONG_HEALTH_PHONE_HREF = MIAMI_BRICKELL_CLINIC.phoneHref;
export const STRONG_HEALTH_PHONE_TEL = MIAMI_BRICKELL_CLINIC.phoneTel;

/**
 * Public review-profile URLs for the Strong Health Miami / Brickell clinic.
 *
 * Trustpilot exposes a canonical profile URL for stronghealth.com. The Google
 * link is a name+address Google Maps query that resolves to the verified
 * Business Profile listing for the Brickell clinic — once the official GBP CID
 * (`?cid=…`) is available it should replace the search URL here so the
 * `sameAs` entry points at the canonical Knowledge Graph node.
 */
export const STRONG_HEALTH_REVIEW_URLS = {
  trustpilot: "https://www.trustpilot.com/review/stronghealth.com",
  google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${MIAMI_BRICKELL_CLINIC.name}, ${MIAMI_BRICKELL_FULL_ADDRESS}`,
  )}`,
} as const;

export const STRONG_HEALTH_REVIEW_LINKS = [
  { label: "Trustpilot reviews", url: STRONG_HEALTH_REVIEW_URLS.trustpilot },
  { label: "Google Business Profile reviews", url: STRONG_HEALTH_REVIEW_URLS.google },
] as const;

/** sameAs URLs for Organization / MedicalClinic JSON-LD. */
export const STRONG_HEALTH_SAME_AS: string[] = [
  STRONG_HEALTH_REVIEW_URLS.trustpilot,
  STRONG_HEALTH_REVIEW_URLS.google,
];
