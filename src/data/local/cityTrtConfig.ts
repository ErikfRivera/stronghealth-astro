export interface CityClinic {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  hours: string;
  hoursWeekday: { opens: string; closes: string };
  hoursSaturday: { opens: string; closes: string } | null;
  lat: number;
  lng: number;
}

export interface CityPhysician {
  name: string;
  title: string;
  credentials: string;
  focus: string;
}

export interface CityTestimonial {
  name: string;
  neighborhood: string;
  text: string;
}

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityTRTConfig {
  /** URL slug, e.g. "boca-raton" */
  slug: string;
  /** Human-readable city name, e.g. "Boca Raton" */
  cityName: string;
  /** County, e.g. "Palm Beach County" */
  county: string;
  /** Tag at top of hero, e.g. "Boca Raton TRT Clinic · In-Person + Telehealth" */
  heroTag: string;
  /** "from XXX+ Boca Raton patient reviews" */
  reviewCount: string;
  /** e.g. "4.9" */
  reviewRating: string;
  /** Aggregate rating count for JSON-LD */
  aggregateReviewCount: number;
  /** Hero H1 second half styling: stays "Physician-supervised. Evidence-based." */
  heroSubtitle: string;
  /** Section "Our [City] Clinic" → "Visit Us in [Area]" */
  clinicArea: string;
  /** Paragraph below "Visit Us in [Area]" */
  clinicAreaBlurb: string;
  /** Directions blurb at bottom of clinic card */
  directions: string;
  /** Section: Why [City] Men Choose Us — H2: "Built for men who take [city's pace] seriously" */
  paceLine: string;
  /** 2–3 paragraphs describing the city + lifestyle */
  introParagraphs: string[];
  /** "What sets us apart in [city]" bullets */
  differentiators: string[];
  /** Step 01 title in HowItWorks (e.g. "Walk Into Our Brickell Clinic") */
  step1Title: string;
  /** Step 01 description */
  step1Desc: string;
  /** "Optimize via Telehealth" step 4 description (mentions city office) */
  step4Desc: string;
  /** Doctors / care team listed in LocalPhysicians */
  physicians: CityPhysician[];
  /** Patient testimonials */
  testimonials: CityTestimonial[];
  /** Neighborhoods/areas this clinic serves */
  neighborhoods: string[];
  /** Title for NeighborhoodsServed section, e.g. "Serving neighborhoods across Palm Beach County" */
  neighborhoodAreaName: string;
  /** Subtitle for NeighborhoodsServed section */
  neighborhoodSubtitle: string;
  /** Local FAQs */
  faqs: CityFAQ[];
  /** Final CTA paragraph */
  finalCtaCopy: string;
  /** Clinic data for SEO + display */
  clinic: CityClinic;
  /** SEO title */
  seoTitle: string;
  /** SEO description */
  seoDescription: string;
  /** Reviewed-by physician for MedicalWebPageJsonLd */
  reviewedByName: string;
  /** "Medical Director — [City]" */
  reviewedByRole: string;
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
  /** Page-specific external review-source links (Google, Yelp, Healthgrades). Falls back to derived defaults. */
  reviewLinks?: { label: string; url: string }[];
  /** Page-specific internal cross-links rendered in the local-proof block. Falls back to derived defaults. */
  relatedInternalLinks?: { label: string; href: string }[];
}

export interface CityListing {
  slug: string;
  name: string;
  county: string;
  /** Full clinic name, e.g. "Strong Health Miami" */
  clinicName: string;
  /** Neighborhood/area name, e.g. "Brickell" */
  area: string;
  /** Local phone, e.g. "(754) 263-6026". Service-area listings without a
   *  physical storefront share the Strong Health central NAP phone. */
  phone: string;
}

/** Master list of South Florida TRT clinic cities. Used for NearbyCities cross-linking and hub pages. */
export const ALL_CITIES: CityListing[] = [
  { slug: "miami", name: "Miami", county: "Miami-Dade County", clinicName: "Strong Health Miami", area: "Brickell", phone: "(754) 263-6026" },
  { slug: "delray-beach", name: "Delray Beach", county: "Palm Beach County", clinicName: "Strong Health Delray Beach", area: "Atlantic Avenue", phone: "(754) 263-6026" },
];
