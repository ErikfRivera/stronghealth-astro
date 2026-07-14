import type {
  CityClinic,
  CityPhysician,
  CityTestimonial,
  CityFAQ,
} from "./cityTrtConfig";

export type { CityClinic, CityPhysician, CityTestimonial, CityFAQ };

export interface CityWeightLossConfig {
  /** URL slug, e.g. "boca-raton" */
  slug: string;
  /** Human-readable city name, e.g. "Boca Raton" */
  cityName: string;
  /** County, e.g. "Palm Beach County" */
  county: string;
  /** Tag at top of hero, e.g. "Boca Raton Weight Loss Clinic · GLP-1 Programs" */
  heroTag: string;
  /** e.g. "4.9" */
  reviewRating: string;
  /** e.g. "from 220+ Boca Raton patient reviews" */
  reviewCount: string;
  /** Aggregate rating count for JSON-LD */
  aggregateReviewCount: number;
  /** Hero paragraph below the H1 */
  heroSubtitle: string;
  /** Doctors / care team listed in LocalPhysicians */
  physicians: CityPhysician[];
  /** Patient testimonials */
  testimonials: CityTestimonial[];
  /** Neighborhoods/areas this clinic serves */
  neighborhoods: string[];
  /** Area name for NeighborhoodsServed section, e.g. "Miami-Dade" */
  neighborhoodAreaName: string;
  /** Local FAQs */
  faqs: CityFAQ[];
  /** Clinic data for SEO + display */
  clinic: CityClinic;
  /** "Medical Weight Loss Clinic Serving [City and ...]" subtitle phrase */
  servingArea: string;
  /** Section blurb below the clinic-area heading */
  clinicAreaBlurb: string;
  /** Directions blurb at bottom of clinic card */
  directions: string;
  /** Heading on the right-hand "lifestyle" card next to the clinic info */
  lifestyleHeading: string;
  /** Paragraphs in the lifestyle card (the last paragraph receives the TRT cross-link automatically) */
  lifestyleParagraphs: string[];
  /** SEO title */
  seoTitle: string;
  /** SEO description */
  seoDescription: string;
  /** Reviewed-by physician for MedicalWebPageJsonLd */
  reviewedByName: string;
  /** "Medical Director — [City]" */
  reviewedByRole: string;
  /** Optional: hide the cross-link grid of other South Florida cities (default: shown) */
  showNearbyCities?: boolean;
  /** Optional: clinic photo URL emitted as `image` on the MedicalClinic JSON-LD */
  clinicImage?: string;
  /** Optional: named physician(s) emitted as `employee` on the MedicalClinic JSON-LD */
  schemaEmployees?: Array<{
    name: string;
    jobTitle: string;
    medicalSpecialty: string;
    qualifications: string;
  }>;
  /** Optional: social profile URLs emitted as `sameAs` on the MedicalClinic JSON-LD */
  schemaSameAs?: string[];
  /** Optional: `sameAs` URL for the City entry in `areaServed` (e.g. Wikipedia link) */
  citySameAs?: string;
  /** Optional: `sameAs` URL for the County entry in `areaServed` (e.g. Wikipedia link) */
  countySameAs?: string;
  /** Optional cross-link to a related service page (e.g. peptide therapy) shown above the final CTA */
  relatedServiceLink?: { label: string; href: string };
  /** Whether this page corresponds to a real walk-in clinic. Defaults to true. When false, MedicalClinic JSON-LD is suppressed and copy treats the page as a service area. */
  physicalClinic?: boolean;
  /** Override for the "Parking & transit" line in the local-proof block. Falls back to `directions`. */
  parkingTransit?: string;
  /** Override for "Physician availability" in the local-proof block. */
  physicianAvailability?: string;
  /** Override for "Appointment expectations" in the local-proof block. */
  appointmentExpectations?: string;
  /** Page-specific external review-source links. Falls back to derived defaults. */
  reviewLinks?: { label: string; url: string }[];
  /** Page-specific internal cross-links rendered in the local-proof block. Falls back to derived defaults. */
  relatedInternalLinks?: { label: string; href: string }[];
}

export interface CityWeightLossListing {
  slug: string;
  name: string;
  county: string;
}

/** Master list of South Florida weight-loss clinic cities. Used for NearbyCities cross-linking. */
export const ALL_WEIGHT_LOSS_CITIES: CityWeightLossListing[] = [
  { slug: "miami", name: "Miami", county: "Miami-Dade County" },
  { slug: "delray-beach", name: "Delray Beach", county: "Palm Beach County" },
];
