export interface CityPeptideClinic {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursWeekdayHours: { opens: string; closes: string };
  hoursSaturdayHours: { opens: string; closes: string } | null;
  lat: number;
  lng: number;
}

export interface CityPeptidePhysician {
  name: string;
  title: string;
  credentials: string;
  focus: string;
}

export interface CityPeptideFAQ {
  question: string;
  answer: string;
}

export interface CityPeptideStep {
  title: string;
  desc: string;
}

export interface CityPeptideRelatedService {
  name: string;
  desc: string;
  href: string;
  cta: string;
}

export interface CityPeptideConfig {
  /**
   * URL state prefix (US-N1). Drives the route (`/{statePrefix}/{slug}/peptide-therapy/`),
   * the hero state abbreviation, breadcrumbs, and same-state nearby-city links.
   * Defaults to "fl" so existing Florida configs are untouched.
   */
  statePrefix?: "fl" | "ny" | "ca" | "nv" | "ga" | "tx";
  /** Full state name for breadcrumbs/copy, e.g. "New York". Defaults to "Florida". */
  stateName?: string;
  /** Whether this page corresponds to a real walk-in clinic. Defaults to true. When false, MedicalClinic JSON-LD is suppressed and copy treats the page as a service area. */
  physicalClinic?: boolean;
  /**
   * Layout-string overrides (US-N1) for service-area pages that must not imply
   * a local storefront. Every default reproduces the pre-N1 hardcoded string,
   * so omitting them keeps existing pages byte-identical.
   */
  /** <Tag> above the "How it works" section. Default: `How Peptide Therapy Works at Our ${cityName} Clinic`. */
  howItWorksTag?: string;
  /** Plain-text intro of the "How it works" h2 (before the gold span). Default: "One in-person visit. Then". */
  howItWorksHeadingIntro?: string;
  /** Gold tail of the "How it works" h2. Default: "monitored care.". */
  howItWorksHeadingGold?: string;
  /** Trailing phrase of the physicians subtitle. Default: `at our ${clinicArea} clinic.`. */
  physiciansSubtitleSuffix?: string;
  /** Plain-text intro of the related-services h2 (before the gold span). Default: `Same ${clinicArea} clinic.`. */
  relatedServicesHeadingIntro?: string;
  /** Override for the "Parking & transit" line in the local-proof block. */
  parkingTransit?: string;
  /** Override for "Physician availability" in the local-proof block. */
  physicianAvailability?: string;
  /** Override for "Appointment expectations" in the local-proof block. */
  appointmentExpectations?: string;
  /** Page-specific external review-source links. Falls back to derived defaults. */
  reviewLinks?: { label: string; url: string }[];
  /** Page-specific internal cross-links rendered in the local-proof block. Falls back to derived defaults. */
  relatedInternalLinks?: { label: string; href: string }[];
  /** 2–3 credible outbound citations rendered as a "References" section. Falls back to a shared peptide default list. */
  outboundCitations?: { label: string; url: string }[];

  /** URL slug, e.g. "miami" */
  slug: string;
  /** Human-readable city name, e.g. "Miami" */
  cityName: string;
  /** County name, e.g. "Miami-Dade County" */
  county: string;
  /** Neighborhood/area where clinic sits, e.g. "Brickell" */
  clinicArea: string;

  /** Clinic data (display + JSON-LD) */
  clinic: CityPeptideClinic;

  /** SEO */
  seoTitle: string;
  seoDescription: string;
  /** ISO date for lastReviewed in MedicalWebPageJsonLd */
  lastReviewed: string;
  /** Long name for MedicalWebPage JSON-LD */
  jsonLdPageName: string;
  /** Long description for MedicalWebPage JSON-LD */
  jsonLdPageDescription: string;
  /** "Reviewed by" physician */
  reviewedByName: string;
  reviewedByRole: string;

  /** Hero */
  heroTag: string;
  reviewRating: string;
  reviewCount: string;
  aggregateReviewCount: number;
  heroDescription1: string;
  heroDescription2: string;
  heroCtaMeta: string;

  /** Intro section */
  introHeadingHtml: string;
  introParagraphs: string[];

  /** "Why Strong Health [City]" section */
  whyHeadingHtml: string;
  whyParagraphs: string[];
  whyStandardBullets: string[];

  /** How It Works steps (4 entries) */
  steps: CityPeptideStep[];

  /** Physicians */
  physicians: CityPeptidePhysician[];

  /** Neighborhoods */
  neighborhoods: string[];
  neighborhoodAreaName: string;
  neighborhoodsSubtitle: string;

  /** Related services cards */
  relatedServices: CityPeptideRelatedService[];
  relatedServicesSubtitle: string;

  /** FAQ */
  faqs: CityPeptideFAQ[];

  /** Final CTA */
  finalCtaHeading: string;
  finalCtaCopy: string;
}

export const MIAMI_PEPTIDE_CONFIG: CityPeptideConfig = {
  slug: "miami",
  cityName: "Miami",
  county: "Miami-Dade County",
  clinicArea: "Brickell",

  clinic: {
    name: "Strong Health Miami",
    streetAddress: "1000 Brickell Plaza",
    city: "Miami",
    state: "FL",
    postalCode: "33131",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 25.7631,
    lng: -80.1898,
  },

  seoTitle: "Peptide Therapy in Miami, FL",
  seoDescription:
    "Physician-supervised peptide therapy in Miami, FL. Brickell clinic prescribing BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141. Book a free assessment.",
  lastReviewed: "2026-04-22",
  jsonLdPageName: "Peptide Therapy in Miami, FL — Strong Health Brickell Clinic",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy at Strong Health Miami's Brickell clinic. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Miami",

  heroTag: "Miami Peptide Therapy Clinic · Brickell",
  reviewRating: "4.9",
  reviewCount: "from 850+ Miami patient reviews",
  aggregateReviewCount: 850,
  heroDescription1:
    "Physician-supervised peptide protocols at our Brickell clinic — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not around a generic stack. In-person evaluation at our Miami clinic, followed by telehealth check-ins for dose adjustments and lab reviews.",
  heroCtaMeta:
    "In-person physician visit · On-site labs · No subscriptions · Bilingual (English/Spanish)",

  introHeadingHtml:
    "Why Miami men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "Miami is full of clinics promising to sell you peptides. Most are med spas with no physician on staff, IV-drip lounges that hand out \"research-grade\" vials, or online stores shipping unregulated product from overseas. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health Miami designs peptide protocols around individual labs and goals. Whether you're trying to recover from a torn rotator cuff, drop visceral belly fat you can't budge with diet alone, sleep through the night again, restore desire and arousal, or simply maintain the body composition you're working hard to build, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Our Brickell clinic is a real medical practice with board-certified physicians, on-site lab draws, and pharmacy-compounded medications dispensed under physician orders. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in Miami, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "Brickell has plenty of clinics offering peptides, but very few that combine board-certified physician oversight with on-site labs and pharmacy-grade compounds from licensed compounders. Most Miami patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health Miami around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored. That's not extra. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians at our Brickell clinic",
    "In-person physical exam before any peptide is prescribed",
    "On-site lab draws — no separate Quest or LabCorp trip",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Bilingual care (English & Spanish)",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Walk into our Brickell clinic",
      desc: "Your first visit is in-person at 1000 Brickell Plaza. Meet your physician, complete a physical exam, and discuss your goals, prior treatments, and any musculoskeletal or hormonal history.",
    },
    {
      title: "Comprehensive on-site lab draw",
      desc: "We draw a baseline panel on-site — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs needed for your protocol. No separate Quest or LabCorp trip.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth. In-person reassessment at the Brickell clinic anytime you want.",
    },
  ],

  physicians: [
    {
      name: "Dr. Angel Rivera, M.D.",
      title: "Medical Director, Miami",
      credentials:
        "Board-Certified · University of Medicine & Health Sciences · Medical Director, Strong Health",
      focus:
        "Peptide therapy, men's hormonal health, and metabolic optimization. 12+ years of clinical experience in South Florida. Bilingual (English/Spanish).",
    },
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, Miami",
      credentials:
        "Board-Certified Physicians · Peptide & Hormone Therapy Specialists · Full-Spectrum Men's Health Care",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols with on-site labs and ongoing monitoring at the Brickell clinic.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, Miami",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for active patients across Brickell, Wynwood, and Miami Beach.",
    },
  ],

  neighborhoods: [
    "Brickell", "Wynwood", "Coral Gables", "Coconut Grove",
    "Little Havana", "Doral", "Kendall", "Miami Beach",
    "Key Biscayne", "Edgewater", "Midtown", "Design District",
    "Overtown", "Little Haiti", "Aventura", "Pinecrest",
    "South Miami", "Hialeah", "Westchester", "Flagami",
  ],
  neighborhoodAreaName: "Miami-Dade",
  neighborhoodsSubtitle:
    "Our Brickell clinic is centrally located for peptide therapy patients across the greater Miami area.",

  relatedServices: [
    {
      name: "TRT in Miami",
      desc: "Physician-supervised testosterone replacement therapy at our Brickell clinic. Frequently paired with GH-secretagogue peptide protocols.",
      href: "/fl/miami/trt-therapy/",
      cta: "Miami TRT clinic →",
    },
    {
      name: "Weight Loss Clinic in Miami",
      desc: "Semaglutide and tirzepatide programs with full metabolic workups. Often combined with peptides that protect lean mass during caloric deficit.",
      href: "/fl/miami/weight-loss-clinic/",
      cta: "Miami weight loss →",
    },
    {
      name: "All Miami Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — all available at the Brickell clinic.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with TRT, weight-loss programs, or comprehensive hormone panels — all designed and monitored by the same physician.",

  faqs: [
    {
      question: "Where can I get peptide therapy in Miami?",
      answer:
        "Strong Health Miami offers physician-supervised peptide therapy at our Brickell clinic, located at 1000 Brickell Plaza, Miami, FL 33131. Initial visits include an in-person physician evaluation, on-site lab draw, and individualized protocol design. Follow-up visits can be in-person at the Brickell office or via telehealth. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health Miami prescribe?",
      answer:
        "Our Miami physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in Florida?",
      answer:
        "Yes, when prescribed by a licensed Florida physician and dispensed through a licensed compounding pharmacy. Strong Health Miami works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard Florida medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost at Strong Health Miami?",
      answer:
        "Your initial assessment at the Brickell clinic is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit to anything. We do not bill insurance directly, but we provide itemized superbills that many Miami patients submit to plans like Florida Blue, Aetna, UnitedHealthcare, and Cigna for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern, rather than introducing exogenous hormone. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health Miami patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on the tissue involved. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health Miami protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Do I need an in-person visit, or can I start peptide therapy by telehealth?",
      answer:
        "Florida law and our clinical standards require an in-person physician evaluation before starting peptide therapy at Strong Health Miami. Your first visit at the Brickell clinic includes a physical exam, full medical history, on-site lab draw, and a detailed discussion of goals. After your baseline visit, follow-ups can be conducted via telehealth — including dose adjustments, lab reviews, and renewal authorizations — with periodic in-person check-ins for labs and physical reassessment.",
    },
    {
      question: "Can peptide therapy be combined with TRT at the Miami clinic?",
      answer:
        "Yes, and many Brickell-area patients do exactly that. Strong Health Miami physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Are there side effects or risks with peptide therapy?",
      answer:
        "When prescribed by a board-certified physician with proper labs and monitoring, peptides used in clinical practice have a generally favorable safety profile. The most common side effects are mild and protocol-specific: temporary injection-site irritation, transient water retention or hunger with GH secretagogues, brief flushing or nausea with PT-141, and grogginess if DSIP is dosed incorrectly. Contraindications include active malignancy, certain endocrine disorders, and pregnancy. Strong Health Miami screens for contraindications during your initial assessment and monitors relevant labs (IGF-1, glucose, hormones) on an ongoing basis.",
    },
    {
      question: "Does the Miami clinic offer Spanish-speaking peptide therapy consultations?",
      answer:
        "Yes. Our Brickell clinic offers bilingual care in English and Spanish. Dr. Rivera and several team members are fluent in Spanish, reflecting the Miami-Dade communities we serve. Initial peptide consultations, lab reviews, and follow-up visits can all be conducted in Spanish if preferred.",
    },
  ],

  finalCtaHeading: "Ready to talk to a Miami physician about peptide therapy?",
  finalCtaCopy:
    "Book a free assessment at our Brickell clinic. Real exam, real labs, and a real protocol if peptide therapy is the right fit for your goals.",
    physicalClinic: true,
    parkingTransit:
      "Located in Brickell, Miami. Free or validated parking available; convenient access via local highways and public transit.",
    physicianAvailability:
      "Dr. Angel Rivera, M.D. and the Strong Health attending physician team see patients in person on weekdays and Saturday mornings; telehealth follow-ups available between visits.",
    appointmentExpectations:
      "Free first assessment, typically 30–45 minutes. Bring photo ID and a list of any current medications and supplements. Visit includes a physician evaluation and discussion of which peptide protocols (if any) fit your goals; labs may be ordered. Most patients are seen within 5 business days of booking.",
    reviewLinks: [
      { label: "Trustpilot reviews", url: "https://www.trustpilot.com/review/stronghealth.com" },
      { label: "Google Business Profile reviews", url: "https://www.google.com/maps/search/?api=1&query=Strong%20Health%20Miami%2C%201000%20Brickell%20Plaza%2C%20Miami%2C%20FL%2033131" },
    ],
    relatedInternalLinks: [
      { label: "Testosterone Therapy in Miami", href: "/fl/miami/trt-therapy/" },
      { label: "Medical Weight Loss in Miami", href: "/fl/miami/weight-loss-clinic/" },
      { label: "DEXA Scan in Miami", href: "/fl/miami/dexascan/" },
      { label: "Peptides for recovery & healing", href: "/peptides-for-healing/" },
      { label: "Peptides for visceral belly fat", href: "/peptides-for-belly-fat/" },
      { label: "Peptides for libido & sexual health", href: "/peptides-for-libido/" },
      { label: "All Florida locations", href: "/fl/" },
      { label: "Strong Health services hub", href: "/" },
    ],
    outboundCitations: [
      { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Tesamorelin reduces visceral adipose tissue in HIV-associated lipodystrophy (NEJM)", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa0706512" },
    { label: "Bremelanotide (PT-141) for hypoactive sexual desire disorder (FDA label)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/210557s000lbl.pdf" },
    ],
};

export const DELRAY_BEACH_PEPTIDE_CONFIG: CityPeptideConfig = {
  slug: "delray-beach",
  cityName: "Delray Beach",
  county: "Palm Beach County",
  clinicArea: "Delray Beach service area",

  clinic: {
    name: "Strong Health Delray Beach",
    streetAddress: "",
    city: "Delray Beach",
    state: "FL",
    postalCode: "",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 26.4615,
    lng: -80.0728,
  },

  seoTitle: "Peptide Therapy in Delray Beach, FL",
  seoDescription:
    "Physician-supervised peptide therapy for Delray Beach, FL patients. Telehealth visits with in-person evaluation at our Miami Brickell clinic. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141.",
  lastReviewed: "2026-04-22",
  jsonLdPageName: "Peptide Therapy for Delray Beach, FL — Strong Health (Telehealth + Miami Brickell)",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy for Delray Beach patients, delivered via telehealth with the in-person baseline evaluation at our Miami Brickell clinic. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Strong Health",

  heroTag: "Delray Beach Peptide Therapy · Telehealth + Miami Brickell labs",
  reviewRating: "4.9",
  reviewCount: "from 175+ Delray Beach patient reviews",
  aggregateReviewCount: 175,
  heroDescription1:
    "Physician-supervised peptide protocols for Delray Beach patients — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Telehealth visits with the in-person baseline at our Miami Brickell clinic. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not a generic stack. In-person baseline evaluation and on-site labs at our Miami Brickell clinic, followed by telehealth check-ins for dose adjustments and lab reviews.",
  heroCtaMeta:
    "In-person physician visit · On-site labs · No subscriptions · Saturday hours available",

  introHeadingHtml:
    "Why Delray Beach men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "Delray Beach has plenty of places willing to sell you peptides — IV-drip lounges along Atlantic Avenue, beachside med spas with no physician on staff, recovery-focused boutiques selling research-grade vials. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health Delray Beach designs peptide protocols around individual labs and goals. Whether you're recovering from a tennis or pickleball injury, dropping visceral belly fat ahead of season on the boat, sleeping through the night again, restoring desire and arousal, or simply maintaining the body composition you're working hard to build, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Strong Health is a real medical practice with board-certified physicians, on-site lab draws at our Miami Brickell clinic, and pharmacy-compounded medications dispensed under physician orders. Delray Beach patients are served via telehealth after an in-person baseline at the Brickell clinic. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in Delray Beach, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "Delray Beach and the surrounding central Palm Beach County country-club circuit has plenty of clinics offering peptides, but very few that combine board-certified physician oversight with on-site labs and pharmacy-grade compounds from licensed compounders. Most Delray Beach patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health Delray Beach around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored — and for our many seasonal residents, that monitoring follows you up north when you travel. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians via telehealth + in-person at our Miami Brickell clinic",
    "In-person physical exam before any peptide is prescribed",
    "On-site lab draws — no separate Quest or LabCorp trip",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Continuity of care for seasonal residents — telehealth follow-ups travel north with you",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Start with a telehealth consult, then visit our Miami Brickell clinic for the baseline exam",
      desc: "Your first visit is a video consult with a Strong Health physician. The in-person physical exam, on-site lab draw, and detailed history take place at our Miami Brickell clinic (1000 Brickell Plaza, Miami, FL 33131).",
    },
    {
      title: "Comprehensive on-site lab draw",
      desc: "We draw a baseline panel on-site — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs needed for your protocol. No separate Quest or LabCorp trip.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth. In-person reassessment at the Miami Brickell clinic when on-site labs or a physical re-exam are clinically needed.",
    },
  ],

  physicians: [
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, Delray Beach",
      credentials:
        "Board-Certified Physicians · Peptide & Hormone Therapy Specialists · Full-Spectrum Men's Health Care",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols with on-site labs at our Miami Brickell clinic and ongoing telehealth monitoring.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, Delray Beach",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for active patients across the Delray Beach tennis, pickleball, and country-club circuits.",
    },
  ],

  neighborhoods: [
    "Atlantic Avenue", "Pineapple Grove", "Beach District", "Lake Ida",
    "Old School Square", "Osceola Park", "West Delray", "Delray Shores",
    "Sherwood Park", "Tropic Isle", "Seagate", "Tropic Palms",
    "Hidden Lake", "Country Club Acres", "Mizner Country Club", "Boynton Beach",
    "Highland Beach", "Gulf Stream",
  ],
  neighborhoodAreaName: "central Palm Beach County",
  neighborhoodsSubtitle:
    "Strong Health serves peptide therapy patients across Delray Beach, Boynton Beach, Highland Beach, and the surrounding central Palm Beach communities via telehealth, with in-person visits at our Miami Brickell clinic.",

  relatedServices: [
    {
      name: "TRT in Delray Beach",
      desc: "Physician-supervised testosterone replacement therapy for Delray Beach patients — telehealth visits with on-site labs at our Miami Brickell clinic. Frequently paired with GH-secretagogue peptide protocols.",
      href: "/fl/delray-beach/trt-therapy/",
      cta: "Delray Beach TRT clinic →",
    },
    {
      name: "Weight Loss Clinic in Delray Beach",
      desc: "Semaglutide and tirzepatide programs with full metabolic workups. Often combined with peptides that protect lean mass during caloric deficit.",
      href: "/fl/delray-beach/weight-loss-clinic/",
      cta: "Delray Beach weight loss →",
    },
    {
      name: "All Delray Beach Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — telehealth statewide with on-site labs at our Miami Brickell clinic.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with TRT, weight-loss programs, or comprehensive hormone panels — all designed and monitored by the same physician.",

  faqs: [
    {
      question: "Where can I get peptide therapy in Delray Beach?",
      answer:
        "Strong Health serves Delray Beach peptide-therapy patients by appointment via telehealth, with in-person physician evaluations and on-site lab draws conducted at our Miami Brickell clinic (1000 Brickell Plaza, Miami, FL 33131). Follow-up visits are conducted via telehealth statewide. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health Delray Beach prescribe?",
      answer:
        "Our Delray Beach physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in Florida?",
      answer:
        "Yes, when prescribed by a licensed Florida physician and dispensed through a licensed compounding pharmacy. Strong Health Delray Beach works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard Florida medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost at Strong Health Delray Beach?",
      answer:
        "Your initial telehealth consult is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit. We do not bill insurance directly, but we provide itemized superbills that many Palm Beach County patients submit to plans like Florida Blue, Aetna, UnitedHealthcare, and Cigna for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health Delray Beach patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on tissue. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health Delray Beach protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Do I need an in-person visit, or can I start peptide therapy by telehealth?",
      answer:
        "Florida law and our clinical standards require an in-person physician evaluation before starting peptide therapy. For Delray Beach patients, that baseline visit is scheduled at our Miami Brickell clinic (1000 Brickell Plaza, Miami, FL 33131) and includes a physical exam, full medical history, on-site lab draw, and a detailed discussion of goals. After your baseline visit, follow-ups are conducted via telehealth — including dose adjustments, lab reviews, and renewal authorizations — with periodic in-person check-ins at the Brickell clinic for labs and physical reassessment.",
    },
    {
      question: "Can peptide therapy be combined with TRT at the Delray Beach clinic?",
      answer:
        "Yes, and many Delray Beach patients do exactly that. Strong Health physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Can I stay on peptide therapy if I split time between Delray Beach and another city?",
      answer:
        "Yes. Many Delray patients are seasonal residents who split the year between South Florida and a second residence up north. Telehealth follow-ups travel with you, and we coordinate compounding-pharmacy refills with a partner pharmacy near wherever you happen to be. Initial in-person visits and scheduled lab reassessments are scheduled at our Miami Brickell clinic during your time in South Florida.",
    },
  ],

  finalCtaHeading: "Ready to talk to a Strong Health physician about peptide therapy?",
  finalCtaCopy:
    "Book a free assessment. Telehealth visits for Delray Beach patients with on-site labs and in-person evaluations at our Miami Brickell clinic.",
    physicalClinic: false,
    parkingTransit:
      "No Delray Beach storefront. In-person visits and on-site labs are conducted at the Strong Health Miami Brickell clinic; telehealth follow-ups are available statewide.",
    physicianAvailability:
      "Strong Health attending physicians see Delray Beach patients by appointment via telehealth, with in-person visits scheduled at our Miami Brickell clinic when on-site labs or exams are required.",
    appointmentExpectations:
      "Free first assessment, typically 30–45 minutes. Initial telehealth visit reviews history, goals, and current medications/supplements; on-site biomarker draws are scheduled at the Brickell clinic. Most patients are seen within 5 business days of booking.",
    relatedInternalLinks: [
      { label: "Testosterone Therapy in Delray Beach", href: "/fl/delray-beach/trt-therapy/" },
      { label: "Medical Weight Loss in Delray Beach", href: "/fl/delray-beach/weight-loss-clinic/" },
      { label: "Peptides for tissue repair & recovery", href: "/peptides-for-healing/" },
      { label: "Collagen peptides guide", href: "/collagen-peptides/" },
      { label: "All Florida locations", href: "/fl/" },
      { label: "Strong Health services hub", href: "/" },
    ],
    outboundCitations: [
      { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Thymosin beta-4 (TB-500) and tissue repair", url: "https://pubmed.ncbi.nlm.nih.gov/22894631/" },
    { label: "Ipamorelin / CJC-1295 stimulation of GH release", url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
    ],
};

/**
 * New York City (US-N2) — telehealth service-area page modeled on Delray
 * Beach: no physical clinic, no MedicalClinic JSON-LD/NAP, and copy that says
 * physician-supervised telehealth "for New York patients" without implying an
 * NYC storefront. Labs are referenced generically as "local lab draw sites"
 * (partner name pending, PRD §8).
 */
export const NEW_YORK_PEPTIDE_CONFIG: CityPeptideConfig = {
  statePrefix: "ny",
  stateName: "New York",
  slug: "new-york",
  cityName: "New York",
  county: "New York City",
  clinicArea: "New York service area",

  clinic: {
    name: "Strong Health New York",
    streetAddress: "",
    city: "New York",
    state: "NY",
    postalCode: "",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 40.7128,
    lng: -74.006,
  },

  seoTitle: "Peptide Therapy in New York, NY — Telehealth",
  seoDescription:
    "Physician-supervised peptide therapy for New York patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
  lastReviewed: "2026-07-14",
  jsonLdPageName: "Peptide Therapy in New York, NY — Strong Health (Telehealth)",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy for New York patients, delivered via telehealth with labs at local lab draw sites. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Strong Health",

  heroTag: "New York Peptide Therapy · Telehealth for NY Patients",
  reviewRating: "4.9",
  reviewCount: "from 1,000+ Strong Health patient reviews",
  aggregateReviewCount: 1000,
  heroDescription1:
    "Physician-supervised peptide protocols for New York patients — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Telehealth visits with labs at local lab draw sites. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not a generic stack. Telehealth evaluations with physicians licensed in New York, with baseline and monitoring labs drawn at local lab draw sites across the five boroughs.",
  heroCtaMeta:
    "Telehealth physician visits · Local lab draw sites · No subscriptions",

  introHeadingHtml:
    "Why New York men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "New York is full of places willing to sell you peptides — IV-drip lounges in Midtown, boutique med spas with no physician on staff, online stores shipping research-grade vials to your door. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health designs peptide protocols for New York patients around individual labs and goals. Whether you're recovering from a marathon-training injury, dropping visceral belly fat that won't budge with diet alone, sleeping through the night again, restoring desire and arousal, or maintaining the body composition you work hard for, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Strong Health is a real medical practice with board-certified physicians and pharmacy-compounded medications dispensed under physician orders. New York patients are served via telehealth by physicians licensed in New York, with baseline and monitoring labs drawn at local lab draw sites across the five boroughs. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in New York, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "From Manhattan wellness clinics to Brooklyn recovery studios, New York has no shortage of places offering peptides — but very few that combine board-certified physician oversight with real lab monitoring and pharmacy-grade compounds from licensed compounders. Most New York patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health's New York telehealth program around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored — wherever in the five boroughs you happen to live. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians licensed in New York",
    "Physician evaluation before any peptide is prescribed",
    "Baseline and monitoring labs at local lab draw sites near you",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Telehealth follow-ups that fit a New York schedule",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Start with a telehealth consult with a New York–licensed physician",
      desc: "Your first visit is a video consult with a Strong Health physician licensed in New York. You'll review your history, goals, prior treatments, and any musculoskeletal or hormonal concerns.",
    },
    {
      title: "Baseline labs at a local draw site",
      desc: "We order a baseline panel — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs your protocol needs — to a local lab draw site near you in any of the five boroughs.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth, with repeat labs ordered to the same local draw site whenever monitoring is clinically needed.",
    },
  ],

  physicians: [
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, New York",
      credentials:
        "Board-Certified Physicians · Licensed in New York · Peptide & Hormone Therapy Specialists",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols for New York patients, with telehealth visits and labs at local lab draw sites.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, New York",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for runners, cyclists, and gym athletes across Manhattan, Brooklyn, and Queens.",
    },
  ],

  neighborhoods: [
    "Manhattan", "Brooklyn", "Queens", "Bronx",
    "Staten Island", "Upper East Side", "Upper West Side", "Midtown",
    "Chelsea", "Tribeca", "SoHo", "Financial District",
    "Harlem", "Williamsburg", "Park Slope", "Astoria",
    "Long Island City", "Forest Hills", "Riverdale", "Greenwich Village",
  ],
  neighborhoodAreaName: "the five boroughs",
  neighborhoodsSubtitle:
    "Strong Health serves peptide therapy patients across Manhattan, Brooklyn, Queens, the Bronx, and Staten Island via telehealth, with lab draws at local lab draw sites near you.",

  relatedServices: [
    {
      name: "Peptides for Healing & Recovery",
      desc: "BPC-157 and TB-500 protocols for tendon, ligament, joint, and soft-tissue healing — common in running, cycling, and lifting injuries.",
      href: "/peptides-for-healing/",
      cta: "BPC-157 healing guide →",
    },
    {
      name: "Peptides for Body Composition",
      desc: "Tesamorelin and GH-secretagogue protocols targeting visceral (belly) fat and lean-mass preservation, designed around your labs.",
      href: "/peptides-for-belly-fat/",
      cta: "Peptides for belly fat →",
    },
    {
      name: "All Strong Health Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — physician-designed and monitored via telehealth.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with hormone panels or body-composition programs — all designed and monitored by the same physician team.",

  faqs: [
    {
      question: "Where can I get peptide therapy in New York City?",
      answer:
        "Strong Health serves New York City peptide-therapy patients by appointment via telehealth. Physician consultations happen by video with doctors licensed in New York, and baseline and monitoring labs are drawn at local lab draw sites across Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health prescribe for New York patients?",
      answer:
        "Our physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in New York?",
      answer:
        "Yes, when prescribed by a physician licensed in New York and dispensed through a licensed compounding pharmacy. Strong Health works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost for New York patients?",
      answer:
        "Your initial telehealth consult is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit. We do not bill insurance directly, but we provide itemized superbills that many New York patients submit to plans like UnitedHealthcare, Aetna, Cigna, and Empire BlueCross BlueShield for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on tissue. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Can I start peptide therapy entirely by telehealth in New York?",
      answer:
        "Yes. New York patients start with a telehealth evaluation by a Strong Health physician licensed in New York, including a full medical history and a detailed discussion of goals. Baseline labs are ordered to a local lab draw site near you before any peptide is prescribed, and follow-ups — dose adjustments, lab reviews, and renewal authorizations — are conducted via telehealth with repeat labs at the same draw site.",
    },
    {
      question: "Can peptide therapy be combined with TRT for New York patients?",
      answer:
        "Yes. Strong Health physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Which New York boroughs and neighborhoods do you serve?",
      answer:
        "All five boroughs — Manhattan, Brooklyn, Queens, the Bronx, and Staten Island — plus the surrounding New York metro area. Because care is delivered via telehealth with labs at local lab draw sites, you can start and stay on a protocol whether you're in the Financial District, Williamsburg, Astoria, Riverdale, or St. George.",
    },
  ],

  finalCtaHeading: "Ready to talk to a physician about peptide therapy in New York?",
  finalCtaCopy:
    "Book a free assessment. Telehealth visits for New York patients with physician-designed protocols, real labs at local draw sites, and ongoing monitoring.",
  physicalClinic: false,
  parkingTransit:
    "No New York storefront. Care is delivered via telehealth to New York patients, with baseline and monitoring labs drawn at local lab draw sites across the five boroughs.",
  physicianAvailability:
    "Strong Health physicians licensed in New York see patients by appointment via telehealth, with lab orders sent to a local lab draw site near you.",
  appointmentExpectations:
    "Free first assessment, typically 30–45 minutes by video. We review history, goals, and current medications/supplements; baseline biomarker draws are ordered to a local lab draw site near you. Most patients are seen within 5 business days of booking.",
  howItWorksTag: "How Peptide Therapy Works for New York Patients",
  howItWorksHeadingIntro: "Telehealth visits. Local labs. Then",
  howItWorksHeadingGold: "monitored care.",
  physiciansSubtitleSuffix: "for New York patients.",
  relatedServicesHeadingIntro: "One medical team.",
  outboundCitations: [
    { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Thymosin beta-4 (TB-500) and tissue repair", url: "https://pubmed.ncbi.nlm.nih.gov/22894631/" },
    { label: "Ipamorelin / CJC-1295 stimulation of GH release", url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
  ],
};

export const SAN_DIEGO_PEPTIDE_CONFIG: CityPeptideConfig = {
  statePrefix: "ca",
  stateName: "California",
  slug: "san-diego",
  cityName: "San Diego",
  county: "San Diego County",
  clinicArea: "San Diego service area",

  clinic: {
    name: "Strong Health San Diego",
    streetAddress: "",
    city: "San Diego",
    state: "CA",
    postalCode: "",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 32.7157,
    lng: -117.1611,
  },

  seoTitle: "San Diego Peptide Therapy, CA — Telehealth",
  seoDescription:
    "Physician-supervised peptide therapy for San Diego patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
  lastReviewed: "2026-07-14",
  jsonLdPageName: "Peptide Therapy in San Diego, CA — Strong Health (Telehealth)",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy for San Diego patients, delivered via telehealth with labs at local lab draw sites. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Strong Health",

  heroTag: "San Diego Peptide Therapy · Telehealth for CA Patients",
  reviewRating: "4.9",
  reviewCount: "from 1,000+ Strong Health patient reviews",
  aggregateReviewCount: 1000,
  heroDescription1:
    "Physician-supervised peptide protocols for San Diego patients — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Telehealth visits with labs at local lab draw sites. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not a generic stack. Telehealth evaluations with physicians licensed in California, with baseline and monitoring labs drawn at local lab draw sites across San Diego County.",
  heroCtaMeta:
    "Telehealth physician visits · Local lab draw sites · No subscriptions",

  introHeadingHtml:
    "Why San Diego men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "San Diego is full of places willing to sell you peptides — recovery lounges near the beaches, boutique med spas with no physician on staff, online stores shipping research-grade vials to your door. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health designs peptide protocols for San Diego patients around individual labs and goals. Whether you're recovering from a surf or trail-running injury, dropping visceral belly fat that won't budge with diet alone, sleeping through the night again, restoring desire and arousal, or maintaining the body composition you work hard for, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Strong Health is a real medical practice with board-certified physicians and pharmacy-compounded medications dispensed under physician orders. San Diego patients are served via telehealth by physicians licensed in California, with baseline and monitoring labs drawn at local lab draw sites across the county. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in San Diego, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "From La Jolla wellness clinics to downtown recovery studios, San Diego has no shortage of places offering peptides — but very few that combine board-certified physician oversight with real lab monitoring and pharmacy-grade compounds from licensed compounders. Most San Diego patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health's San Diego telehealth program around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored — wherever in the county you happen to live. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians licensed in California",
    "Physician evaluation before any peptide is prescribed",
    "Baseline and monitoring labs at local lab draw sites near you",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Telehealth follow-ups that fit a San Diego schedule",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Start with a telehealth consult with a California–licensed physician",
      desc: "Your first visit is a video consult with a Strong Health physician licensed in California. You'll review your history, goals, prior treatments, and any musculoskeletal or hormonal concerns.",
    },
    {
      title: "Baseline labs at a local draw site",
      desc: "We order a baseline panel — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs your protocol needs — to a local lab draw site near you anywhere in San Diego County.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth, with repeat labs ordered to the same local draw site whenever monitoring is clinically needed.",
    },
  ],

  physicians: [
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, San Diego",
      credentials:
        "Board-Certified Physicians · Licensed in California · Peptide & Hormone Therapy Specialists",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols for San Diego patients, with telehealth visits and labs at local lab draw sites.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, San Diego",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for surfers, runners, cyclists, and gym athletes across San Diego County.",
    },
  ],

  neighborhoods: [
    "Downtown", "La Jolla", "Pacific Beach", "Mission Valley",
    "North Park", "Hillcrest", "Point Loma", "Ocean Beach",
    "Carmel Valley", "Del Mar", "Encinitas", "Carlsbad",
    "Oceanside", "Chula Vista", "Coronado", "Rancho Bernardo",
    "Escondido", "El Cajon", "La Mesa", "Poway",
  ],
  neighborhoodAreaName: "San Diego County",
  neighborhoodsSubtitle:
    "Strong Health serves peptide therapy patients across San Diego County — from La Jolla and the coast to Chula Vista, El Cajon, and North County — via telehealth, with lab draws at local lab draw sites near you.",

  relatedServices: [
    {
      name: "Peptides for Healing & Recovery",
      desc: "BPC-157 and TB-500 protocols for tendon, ligament, joint, and soft-tissue healing — common in running, surfing, and lifting injuries.",
      href: "/peptides-for-healing/",
      cta: "BPC-157 healing guide →",
    },
    {
      name: "Peptides for Body Composition",
      desc: "Tesamorelin and GH-secretagogue protocols targeting visceral (belly) fat and lean-mass preservation, designed around your labs.",
      href: "/peptides-for-belly-fat/",
      cta: "Peptides for belly fat →",
    },
    {
      name: "All Strong Health Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — physician-designed and monitored via telehealth.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with hormone panels or body-composition programs — all designed and monitored by the same physician team.",

  faqs: [
    {
      question: "Where can I get peptide therapy in San Diego?",
      answer:
        "Strong Health serves San Diego peptide-therapy patients by appointment via telehealth. Physician consultations happen by video with doctors licensed in California, and baseline and monitoring labs are drawn at local lab draw sites across San Diego County — from La Jolla and downtown to Chula Vista, El Cajon, and North County. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health prescribe for San Diego patients?",
      answer:
        "Our physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in California?",
      answer:
        "Yes, when prescribed by a physician licensed in California and dispensed through a licensed compounding pharmacy. Strong Health works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost for San Diego patients?",
      answer:
        "Your initial telehealth consult is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit. We do not bill insurance directly, but we provide itemized superbills that many San Diego patients submit to plans like Blue Shield of California, Anthem Blue Cross, Aetna, and Cigna for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on tissue. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Can I start peptide therapy entirely by telehealth in San Diego?",
      answer:
        "Yes. San Diego patients start with a telehealth evaluation by a Strong Health physician licensed in California, including a full medical history and a detailed discussion of goals. Baseline labs are ordered to a local lab draw site near you before any peptide is prescribed, and follow-ups — dose adjustments, lab reviews, and renewal authorizations — are conducted via telehealth with repeat labs at the same draw site.",
    },
    {
      question: "Can peptide therapy be combined with TRT for San Diego patients?",
      answer:
        "Yes. Strong Health physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Which San Diego neighborhoods and cities do you serve?",
      answer:
        "All of San Diego County — from La Jolla, Pacific Beach, Downtown, and Point Loma to Carmel Valley, Del Mar, Encinitas, and Carlsbad in North County, plus Chula Vista, Coronado, El Cajon, La Mesa, and Poway. Because care is delivered via telehealth with labs at local lab draw sites, you can start and stay on a protocol wherever in the county you live.",
    },
  ],

  finalCtaHeading: "Ready to talk to a physician about peptide therapy in San Diego?",
  finalCtaCopy:
    "Book a free assessment. Telehealth visits for San Diego patients with physician-designed protocols, real labs at local draw sites, and ongoing monitoring.",
  physicalClinic: false,
  parkingTransit:
    "No San Diego storefront. Care is delivered via telehealth to San Diego patients, with baseline and monitoring labs drawn at local lab draw sites across San Diego County.",
  physicianAvailability:
    "Strong Health physicians licensed in California see patients by appointment via telehealth, with lab orders sent to a local lab draw site near you.",
  appointmentExpectations:
    "Free first assessment, typically 30–45 minutes by video. We review history, goals, and current medications/supplements; baseline biomarker draws are ordered to a local lab draw site near you. Most patients are seen within 5 business days of booking.",
  howItWorksTag: "How Peptide Therapy Works for San Diego Patients",
  howItWorksHeadingIntro: "Telehealth visits. Local labs. Then",
  howItWorksHeadingGold: "monitored care.",
  physiciansSubtitleSuffix: "for San Diego patients.",
  relatedServicesHeadingIntro: "One medical team.",
  outboundCitations: [
    { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Thymosin beta-4 (TB-500) and tissue repair", url: "https://pubmed.ncbi.nlm.nih.gov/22894631/" },
    { label: "Ipamorelin / CJC-1295 stimulation of GH release", url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
  ],
};

export const LAS_VEGAS_PEPTIDE_CONFIG: CityPeptideConfig = {
  statePrefix: "nv",
  stateName: "Nevada",
  slug: "las-vegas",
  cityName: "Las Vegas",
  county: "Clark County",
  clinicArea: "Las Vegas service area",

  clinic: {
    name: "Strong Health Las Vegas",
    streetAddress: "",
    city: "Las Vegas",
    state: "NV",
    postalCode: "",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 36.1699,
    lng: -115.1398,
  },

  seoTitle: "Las Vegas Peptide Therapy, NV — Telehealth",
  seoDescription:
    "Physician-supervised peptide therapy for Las Vegas patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
  lastReviewed: "2026-07-14",
  jsonLdPageName: "Peptide Therapy in Las Vegas, NV — Strong Health (Telehealth)",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy for Las Vegas patients, delivered via telehealth with labs at local lab draw sites. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Strong Health",

  heroTag: "Las Vegas Peptide Therapy · Telehealth for NV Patients",
  reviewRating: "4.9",
  reviewCount: "from 1,000+ Strong Health patient reviews",
  aggregateReviewCount: 1000,
  heroDescription1:
    "Physician-supervised peptide protocols for Las Vegas patients — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Telehealth visits with labs at local lab draw sites. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not a generic stack. Telehealth evaluations with physicians licensed in Nevada, with baseline and monitoring labs drawn at local lab draw sites across the Las Vegas Valley.",
  heroCtaMeta:
    "Telehealth physician visits · Local lab draw sites · No subscriptions",

  introHeadingHtml:
    "Why Las Vegas men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "Las Vegas is full of places willing to sell you peptides — IV-drip lounges off the Strip, boutique med spas with no physician on staff, online stores shipping research-grade vials to your door. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health designs peptide protocols for Las Vegas patients around individual labs and goals. Whether you're recovering from a training injury, dropping visceral belly fat that won't budge with diet alone, sleeping through the night again, restoring desire and arousal, or maintaining the body composition you work hard for, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Strong Health is a real medical practice with board-certified physicians and pharmacy-compounded medications dispensed under physician orders. Las Vegas patients are served via telehealth by physicians licensed in Nevada, with baseline and monitoring labs drawn at local lab draw sites across the valley. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in Las Vegas, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "From Summerlin wellness clinics to Henderson recovery studios, Las Vegas has no shortage of places offering peptides — but very few that combine board-certified physician oversight with real lab monitoring and pharmacy-grade compounds from licensed compounders. Most Las Vegas patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health's Las Vegas telehealth program around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored — wherever in the valley you happen to live. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians licensed in Nevada",
    "Physician evaluation before any peptide is prescribed",
    "Baseline and monitoring labs at local lab draw sites near you",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Telehealth follow-ups that fit a Las Vegas schedule",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Start with a telehealth consult with a Nevada–licensed physician",
      desc: "Your first visit is a video consult with a Strong Health physician licensed in Nevada. You'll review your history, goals, prior treatments, and any musculoskeletal or hormonal concerns.",
    },
    {
      title: "Baseline labs at a local draw site",
      desc: "We order a baseline panel — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs your protocol needs — to a local lab draw site near you anywhere in the Las Vegas Valley.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth, with repeat labs ordered to the same local draw site whenever monitoring is clinically needed.",
    },
  ],

  physicians: [
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, Las Vegas",
      credentials:
        "Board-Certified Physicians · Licensed in Nevada · Peptide & Hormone Therapy Specialists",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols for Las Vegas patients, with telehealth visits and labs at local lab draw sites.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, Las Vegas",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for runners, cyclists, and gym athletes across Summerlin, Henderson, and the Las Vegas Valley.",
    },
  ],

  neighborhoods: [
    "The Strip", "Summerlin", "Henderson", "Green Valley",
    "Spring Valley", "Downtown / Arts District", "Centennial Hills", "North Las Vegas",
    "Enterprise", "Paradise", "Southern Highlands", "Anthem",
    "Aliante", "Mountain's Edge", "Boulder City", "Sunrise Manor",
    "Seven Hills", "Rhodes Ranch", "Lake Las Vegas", "Whitney",
  ],
  neighborhoodAreaName: "the Las Vegas Valley",
  neighborhoodsSubtitle:
    "Strong Health serves peptide therapy patients across the Las Vegas Valley — from Summerlin and Henderson to Green Valley, Centennial Hills, and North Las Vegas — via telehealth, with lab draws at local lab draw sites near you.",

  relatedServices: [
    {
      name: "Peptides for Healing & Recovery",
      desc: "BPC-157 and TB-500 protocols for tendon, ligament, joint, and soft-tissue healing — common in running, cycling, and lifting injuries.",
      href: "/peptides-for-healing/",
      cta: "BPC-157 healing guide →",
    },
    {
      name: "Peptides for Body Composition",
      desc: "Tesamorelin and GH-secretagogue protocols targeting visceral (belly) fat and lean-mass preservation, designed around your labs.",
      href: "/peptides-for-belly-fat/",
      cta: "Peptides for belly fat →",
    },
    {
      name: "All Strong Health Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — physician-designed and monitored via telehealth.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with hormone panels or body-composition programs — all designed and monitored by the same physician team.",

  faqs: [
    {
      question: "Where can I get peptide therapy in Las Vegas?",
      answer:
        "Strong Health serves Las Vegas peptide-therapy patients by appointment via telehealth. Physician consultations happen by video with doctors licensed in Nevada, and baseline and monitoring labs are drawn at local lab draw sites across the valley — from Summerlin and Henderson to Green Valley, Centennial Hills, and North Las Vegas. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health prescribe for Las Vegas patients?",
      answer:
        "Our physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in Nevada?",
      answer:
        "Yes, when prescribed by a physician licensed in Nevada and dispensed through a licensed compounding pharmacy. Strong Health works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost for Las Vegas patients?",
      answer:
        "Your initial telehealth consult is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit. We do not bill insurance directly, but we provide itemized superbills that many Las Vegas patients submit to plans like UnitedHealthcare, Anthem Blue Cross Blue Shield, Aetna, and Cigna for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on tissue. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Can I start peptide therapy entirely by telehealth in Las Vegas?",
      answer:
        "Yes. Las Vegas patients start with a telehealth evaluation by a Strong Health physician licensed in Nevada, including a full medical history and a detailed discussion of goals. Baseline labs are ordered to a local lab draw site near you before any peptide is prescribed, and follow-ups — dose adjustments, lab reviews, and renewal authorizations — are conducted via telehealth with repeat labs at the same draw site.",
    },
    {
      question: "Can peptide therapy be combined with TRT for Las Vegas patients?",
      answer:
        "Yes. Strong Health physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Which Las Vegas neighborhoods and cities do you serve?",
      answer:
        "The entire Las Vegas Valley — Summerlin, Henderson, Green Valley, Spring Valley, Centennial Hills, North Las Vegas, Enterprise, Paradise, and beyond, plus surrounding Clark County. Because care is delivered via telehealth with labs at local lab draw sites, you can start and stay on a protocol wherever in the valley you live.",
    },
  ],

  finalCtaHeading: "Ready to talk to a physician about peptide therapy in Las Vegas?",
  finalCtaCopy:
    "Book a free assessment. Telehealth visits for Las Vegas patients with physician-designed protocols, real labs at local draw sites, and ongoing monitoring.",
  physicalClinic: false,
  parkingTransit:
    "No Las Vegas storefront. Care is delivered via telehealth to Las Vegas patients, with baseline and monitoring labs drawn at local lab draw sites across the Las Vegas Valley.",
  physicianAvailability:
    "Strong Health physicians licensed in Nevada see patients by appointment via telehealth, with lab orders sent to a local lab draw site near you.",
  appointmentExpectations:
    "Free first assessment, typically 30–45 minutes by video. We review history, goals, and current medications/supplements; baseline biomarker draws are ordered to a local lab draw site near you. Most patients are seen within 5 business days of booking.",
  howItWorksTag: "How Peptide Therapy Works for Las Vegas Patients",
  howItWorksHeadingIntro: "Telehealth visits. Local labs. Then",
  howItWorksHeadingGold: "monitored care.",
  physiciansSubtitleSuffix: "for Las Vegas patients.",
  relatedServicesHeadingIntro: "One medical team.",
  outboundCitations: [
    { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Thymosin beta-4 (TB-500) and tissue repair", url: "https://pubmed.ncbi.nlm.nih.gov/22894631/" },
    { label: "Ipamorelin / CJC-1295 stimulation of GH release", url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
  ],
};

export const ATLANTA_PEPTIDE_CONFIG: CityPeptideConfig = {
  statePrefix: "ga",
  stateName: "Georgia",
  slug: "atlanta",
  cityName: "Atlanta",
  county: "Fulton County",
  clinicArea: "Atlanta service area",

  clinic: {
    name: "Strong Health Atlanta",
    streetAddress: "",
    city: "Atlanta",
    state: "GA",
    postalCode: "",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 33.749,
    lng: -84.388,
  },

  seoTitle: "Peptide Therapy in Atlanta, GA — Telehealth",
  seoDescription:
    "Physician-supervised peptide therapy for Atlanta patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
  lastReviewed: "2026-07-14",
  jsonLdPageName: "Peptide Therapy in Atlanta, GA — Strong Health (Telehealth)",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy for Atlanta patients, delivered via telehealth with labs at local lab draw sites. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Strong Health",

  heroTag: "Atlanta Peptide Therapy · Telehealth for GA Patients",
  reviewRating: "4.9",
  reviewCount: "from 1,000+ Strong Health patient reviews",
  aggregateReviewCount: 1000,
  heroDescription1:
    "Physician-supervised peptide protocols for Atlanta patients — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Telehealth visits with labs at local lab draw sites. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not a generic stack. Telehealth evaluations with physicians licensed in Georgia, with baseline and monitoring labs drawn at local lab draw sites across metro Atlanta.",
  heroCtaMeta:
    "Telehealth physician visits · Local lab draw sites · No subscriptions",

  introHeadingHtml:
    "Why Atlanta men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "Atlanta is full of places willing to sell you peptides — IV-drip lounges in Buckhead, boutique med spas with no physician on staff, online stores shipping research-grade vials to your door. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health designs peptide protocols for Atlanta patients around individual labs and goals. Whether you're recovering from a training injury, dropping visceral belly fat that won't budge with diet alone, sleeping through the night again, restoring desire and arousal, or maintaining the body composition you work hard for, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Strong Health is a real medical practice with board-certified physicians and pharmacy-compounded medications dispensed under physician orders. Atlanta patients are served via telehealth by physicians licensed in Georgia, with baseline and monitoring labs drawn at local lab draw sites across the metro area. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in Atlanta, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "From Buckhead wellness clinics to Midtown recovery studios, Atlanta has no shortage of places offering peptides — but very few that combine board-certified physician oversight with real lab monitoring and pharmacy-grade compounds from licensed compounders. Most Atlanta patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health's Atlanta telehealth program around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored — wherever in the metro you happen to live. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians licensed in Georgia",
    "Physician evaluation before any peptide is prescribed",
    "Baseline and monitoring labs at local lab draw sites near you",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Telehealth follow-ups that fit an Atlanta schedule",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Start with a telehealth consult with a Georgia–licensed physician",
      desc: "Your first visit is a video consult with a Strong Health physician licensed in Georgia. You'll review your history, goals, prior treatments, and any musculoskeletal or hormonal concerns.",
    },
    {
      title: "Baseline labs at a local draw site",
      desc: "We order a baseline panel — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs your protocol needs — to a local lab draw site near you anywhere in metro Atlanta.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth, with repeat labs ordered to the same local draw site whenever monitoring is clinically needed.",
    },
  ],

  physicians: [
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, Atlanta",
      credentials:
        "Board-Certified Physicians · Licensed in Georgia · Peptide & Hormone Therapy Specialists",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols for Atlanta patients, with telehealth visits and labs at local lab draw sites.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, Atlanta",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for runners, cyclists, and gym athletes across Buckhead, Midtown, and the Atlanta metro.",
    },
  ],

  neighborhoods: [
    "Midtown", "Buckhead", "Downtown", "Old Fourth Ward",
    "Virginia-Highland", "Inman Park", "West Midtown", "East Atlanta",
    "Decatur", "Sandy Springs", "Brookhaven", "Dunwoody",
    "Marietta", "Alpharetta", "Roswell", "Smyrna",
    "Vinings", "Johns Creek", "Druid Hills", "Peachtree City",
  ],
  neighborhoodAreaName: "metro Atlanta",
  neighborhoodsSubtitle:
    "Strong Health serves peptide therapy patients across metro Atlanta — from Midtown and Buckhead to Decatur, Sandy Springs, Alpharetta, and Marietta — via telehealth, with lab draws at local lab draw sites near you.",

  relatedServices: [
    {
      name: "Peptides for Healing & Recovery",
      desc: "BPC-157 and TB-500 protocols for tendon, ligament, joint, and soft-tissue healing — common in running, cycling, and lifting injuries.",
      href: "/peptides-for-healing/",
      cta: "BPC-157 healing guide →",
    },
    {
      name: "Peptides for Body Composition",
      desc: "Tesamorelin and GH-secretagogue protocols targeting visceral (belly) fat and lean-mass preservation, designed around your labs.",
      href: "/peptides-for-belly-fat/",
      cta: "Peptides for belly fat →",
    },
    {
      name: "All Strong Health Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — physician-designed and monitored via telehealth.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with hormone panels or body-composition programs — all designed and monitored by the same physician team.",

  faqs: [
    {
      question: "Where can I get peptide therapy in Atlanta?",
      answer:
        "Strong Health serves Atlanta peptide-therapy patients by appointment via telehealth. Physician consultations happen by video with doctors licensed in Georgia, and baseline and monitoring labs are drawn at local lab draw sites across the metro — from Midtown and Buckhead to Decatur, Sandy Springs, Alpharetta, and Marietta. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health prescribe for Atlanta patients?",
      answer:
        "Our physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in Georgia?",
      answer:
        "Yes, when prescribed by a physician licensed in Georgia and dispensed through a licensed compounding pharmacy. Strong Health works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost for Atlanta patients?",
      answer:
        "Your initial telehealth consult is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit. We do not bill insurance directly, but we provide itemized superbills that many Atlanta patients submit to plans like Anthem Blue Cross Blue Shield of Georgia, UnitedHealthcare, Aetna, and Cigna for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on tissue. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Can I start peptide therapy entirely by telehealth in Atlanta?",
      answer:
        "Yes. Atlanta patients start with a telehealth evaluation by a Strong Health physician licensed in Georgia, including a full medical history and a detailed discussion of goals. Baseline labs are ordered to a local lab draw site near you before any peptide is prescribed, and follow-ups — dose adjustments, lab reviews, and renewal authorizations — are conducted via telehealth with repeat labs at the same draw site.",
    },
    {
      question: "Can peptide therapy be combined with TRT for Atlanta patients?",
      answer:
        "Yes. Strong Health physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Which Atlanta neighborhoods and suburbs do you serve?",
      answer:
        "All of metro Atlanta — Midtown, Buckhead, Downtown, Old Fourth Ward, Virginia-Highland, and East Atlanta, plus Decatur, Sandy Springs, Brookhaven, Dunwoody, Marietta, Alpharetta, Roswell, and Johns Creek. Because care is delivered via telehealth with labs at local lab draw sites, you can start and stay on a protocol wherever in the metro you live.",
    },
  ],

  finalCtaHeading: "Ready to talk to a physician about peptide therapy in Atlanta?",
  finalCtaCopy:
    "Book a free assessment. Telehealth visits for Atlanta patients with physician-designed protocols, real labs at local draw sites, and ongoing monitoring.",
  physicalClinic: false,
  parkingTransit:
    "No Atlanta storefront. Care is delivered via telehealth to Atlanta patients, with baseline and monitoring labs drawn at local lab draw sites across metro Atlanta.",
  physicianAvailability:
    "Strong Health physicians licensed in Georgia see patients by appointment via telehealth, with lab orders sent to a local lab draw site near you.",
  appointmentExpectations:
    "Free first assessment, typically 30–45 minutes by video. We review history, goals, and current medications/supplements; baseline biomarker draws are ordered to a local lab draw site near you. Most patients are seen within 5 business days of booking.",
  howItWorksTag: "How Peptide Therapy Works for Atlanta Patients",
  howItWorksHeadingIntro: "Telehealth visits. Local labs. Then",
  howItWorksHeadingGold: "monitored care.",
  physiciansSubtitleSuffix: "for Atlanta patients.",
  relatedServicesHeadingIntro: "One medical team.",
  outboundCitations: [
    { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Thymosin beta-4 (TB-500) and tissue repair", url: "https://pubmed.ncbi.nlm.nih.gov/22894631/" },
    { label: "Ipamorelin / CJC-1295 stimulation of GH release", url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
  ],
};

export const AUSTIN_PEPTIDE_CONFIG: CityPeptideConfig = {
  statePrefix: "tx",
  stateName: "Texas",
  slug: "austin",
  cityName: "Austin",
  county: "Travis County",
  clinicArea: "Austin service area",

  clinic: {
    name: "Strong Health Austin",
    streetAddress: "",
    city: "Austin",
    state: "TX",
    postalCode: "",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 30.2672,
    lng: -97.7431,
  },

  seoTitle: "Peptide Therapy in Austin, TX — Telehealth",
  seoDescription:
    "Physician-supervised peptide therapy for Austin patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
  lastReviewed: "2026-07-14",
  jsonLdPageName: "Peptide Therapy in Austin, TX — Strong Health (Telehealth)",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy for Austin patients, delivered via telehealth with labs at local lab draw sites. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Strong Health",

  heroTag: "Austin Peptide Therapy · Telehealth for TX Patients",
  reviewRating: "4.9",
  reviewCount: "from 1,000+ Strong Health patient reviews",
  aggregateReviewCount: 1000,
  heroDescription1:
    "Physician-supervised peptide protocols for Austin patients — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Telehealth visits with labs at local lab draw sites. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not a generic stack. Telehealth evaluations with physicians licensed in Texas, with baseline and monitoring labs drawn at local lab draw sites across the Austin metro.",
  heroCtaMeta:
    "Telehealth physician visits · Local lab draw sites · No subscriptions",

  introHeadingHtml:
    "Why Austin men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "Austin is full of places willing to sell you peptides — recovery and IV lounges downtown, boutique med spas with no physician on staff, online stores shipping research-grade vials to your door. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health designs peptide protocols for Austin patients around individual labs and goals. Whether you're recovering from a trail-running or lifting injury, dropping visceral belly fat that won't budge with diet alone, sleeping through the night again, restoring desire and arousal, or maintaining the body composition you work hard for, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Strong Health is a real medical practice with board-certified physicians and pharmacy-compounded medications dispensed under physician orders. Austin patients are served via telehealth by physicians licensed in Texas, with baseline and monitoring labs drawn at local lab draw sites across the metro area. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in Austin, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "From downtown wellness clinics to Westlake recovery studios, Austin has no shortage of places offering peptides — but very few that combine board-certified physician oversight with real lab monitoring and pharmacy-grade compounds from licensed compounders. Most Austin patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health's Austin telehealth program around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored — wherever in the metro you happen to live. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians licensed in Texas",
    "Physician evaluation before any peptide is prescribed",
    "Baseline and monitoring labs at local lab draw sites near you",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Telehealth follow-ups that fit an Austin schedule",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Start with a telehealth consult with a Texas–licensed physician",
      desc: "Your first visit is a video consult with a Strong Health physician licensed in Texas. You'll review your history, goals, prior treatments, and any musculoskeletal or hormonal concerns.",
    },
    {
      title: "Baseline labs at a local draw site",
      desc: "We order a baseline panel — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs your protocol needs — to a local lab draw site near you anywhere in the Austin metro.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth, with repeat labs ordered to the same local draw site whenever monitoring is clinically needed.",
    },
  ],

  physicians: [
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, Austin",
      credentials:
        "Board-Certified Physicians · Licensed in Texas · Peptide & Hormone Therapy Specialists",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols for Austin patients, with telehealth visits and labs at local lab draw sites.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, Austin",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for runners, cyclists, and gym athletes across Austin, Round Rock, and Cedar Park.",
    },
  ],

  neighborhoods: [
    "Downtown", "South Congress (SoCo)", "East Austin", "Zilker",
    "Barton Hills", "Hyde Park", "Mueller", "Tarrytown",
    "Clarksville", "The Domain / North Austin", "Westlake", "Circle C",
    "Steiner Ranch", "Cedar Park", "Round Rock", "Pflugerville",
    "Lakeway", "Bee Cave", "Georgetown", "Buda",
  ],
  neighborhoodAreaName: "the Austin metro",
  neighborhoodsSubtitle:
    "Strong Health serves peptide therapy patients across the Austin metro — from Downtown, South Congress, and East Austin to Westlake, Cedar Park, Round Rock, and Georgetown — via telehealth, with lab draws at local lab draw sites near you.",

  relatedServices: [
    {
      name: "Peptides for Healing & Recovery",
      desc: "BPC-157 and TB-500 protocols for tendon, ligament, joint, and soft-tissue healing — common in running, cycling, and lifting injuries.",
      href: "/peptides-for-healing/",
      cta: "BPC-157 healing guide →",
    },
    {
      name: "Peptides for Body Composition",
      desc: "Tesamorelin and GH-secretagogue protocols targeting visceral (belly) fat and lean-mass preservation, designed around your labs.",
      href: "/peptides-for-belly-fat/",
      cta: "Peptides for belly fat →",
    },
    {
      name: "All Strong Health Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — physician-designed and monitored via telehealth.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with hormone panels or body-composition programs — all designed and monitored by the same physician team.",

  faqs: [
    {
      question: "Where can I get peptide therapy in Austin?",
      answer:
        "Strong Health serves Austin peptide-therapy patients by appointment via telehealth. Physician consultations happen by video with doctors licensed in Texas, and baseline and monitoring labs are drawn at local lab draw sites across the metro — from Downtown, South Congress, and East Austin to Westlake, Cedar Park, Round Rock, and Georgetown. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health prescribe for Austin patients?",
      answer:
        "Our physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in Texas?",
      answer:
        "Yes, when prescribed by a physician licensed in Texas and dispensed through a licensed compounding pharmacy. Strong Health works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost for Austin patients?",
      answer:
        "Your initial telehealth consult is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit. We do not bill insurance directly, but we provide itemized superbills that many Austin patients submit to plans like Blue Cross Blue Shield of Texas, UnitedHealthcare, Aetna, and Cigna for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on tissue. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Can I start peptide therapy entirely by telehealth in Austin?",
      answer:
        "Yes. Austin patients start with a telehealth evaluation by a Strong Health physician licensed in Texas, including a full medical history and a detailed discussion of goals. Baseline labs are ordered to a local lab draw site near you before any peptide is prescribed, and follow-ups — dose adjustments, lab reviews, and renewal authorizations — are conducted via telehealth with repeat labs at the same draw site.",
    },
    {
      question: "Can peptide therapy be combined with TRT for Austin patients?",
      answer:
        "Yes. Strong Health physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Which Austin neighborhoods and suburbs do you serve?",
      answer:
        "The entire Austin metro — Downtown, South Congress, East Austin, Zilker, Hyde Park, Mueller, and Tarrytown, plus Westlake, Cedar Park, Round Rock, Pflugerville, Lakeway, Bee Cave, and Georgetown. Because care is delivered via telehealth with labs at local lab draw sites, you can start and stay on a protocol wherever in the metro you live.",
    },
  ],

  finalCtaHeading: "Ready to talk to a physician about peptide therapy in Austin?",
  finalCtaCopy:
    "Book a free assessment. Telehealth visits for Austin patients with physician-designed protocols, real labs at local draw sites, and ongoing monitoring.",
  physicalClinic: false,
  parkingTransit:
    "No Austin storefront. Care is delivered via telehealth to Austin patients, with baseline and monitoring labs drawn at local lab draw sites across the Austin metro.",
  physicianAvailability:
    "Strong Health physicians licensed in Texas see patients by appointment via telehealth, with lab orders sent to a local lab draw site near you.",
  appointmentExpectations:
    "Free first assessment, typically 30–45 minutes by video. We review history, goals, and current medications/supplements; baseline biomarker draws are ordered to a local lab draw site near you. Most patients are seen within 5 business days of booking.",
  howItWorksTag: "How Peptide Therapy Works for Austin Patients",
  howItWorksHeadingIntro: "Telehealth visits. Local labs. Then",
  howItWorksHeadingGold: "monitored care.",
  physiciansSubtitleSuffix: "for Austin patients.",
  relatedServicesHeadingIntro: "One medical team.",
  outboundCitations: [
    { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Thymosin beta-4 (TB-500) and tissue repair", url: "https://pubmed.ncbi.nlm.nih.gov/22894631/" },
    { label: "Ipamorelin / CJC-1295 stimulation of GH release", url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
  ],
};

export const TAMPA_PEPTIDE_CONFIG: CityPeptideConfig = {
  statePrefix: "fl",
  stateName: "Florida",
  slug: "tampa",
  cityName: "Tampa",
  county: "Hillsborough County",
  clinicArea: "Tampa service area",

  clinic: {
    name: "Strong Health Tampa",
    streetAddress: "",
    city: "Tampa",
    state: "FL",
    postalCode: "",
    phone: "(754) 263-6026",
    hoursWeekday: "Mon–Fri 8:00 AM – 6:00 PM",
    hoursSaturday: "Sat 9:00 AM – 1:00 PM",
    hoursWeekdayHours: { opens: "08:00", closes: "18:00" },
    hoursSaturdayHours: { opens: "09:00", closes: "13:00" },
    lat: 27.9506,
    lng: -82.4572,
  },

  seoTitle: "Peptide Therapy in Tampa, FL — Telehealth",
  seoDescription:
    "Physician-supervised peptide therapy for Tampa patients via telehealth. BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and PT-141 with local lab draws.",
  lastReviewed: "2026-07-14",
  jsonLdPageName: "Peptide Therapy in Tampa, FL — Strong Health (Telehealth)",
  jsonLdPageDescription:
    "Physician-supervised peptide therapy for Tampa patients, delivered via telehealth with labs at local lab draw sites. Pharmacy-grade BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and collagen peptide protocols.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Strong Health",

  heroTag: "Tampa Peptide Therapy · Telehealth for FL Patients",
  reviewRating: "4.9",
  reviewCount: "from 1,000+ Strong Health patient reviews",
  aggregateReviewCount: 1000,
  heroDescription1:
    "Physician-supervised peptide protocols for Tampa patients — BPC-157, CJC-1295, Ipamorelin, Tesamorelin, PT-141, DSIP, and more. Telehealth visits with labs at local lab draw sites. Pharmacy-grade compounds. Real labs. Ongoing monitoring.",
  heroDescription2:
    "We design individualized peptide therapy protocols for healing, body composition, sleep, sexual health, and longevity — built around your bloodwork, not a generic stack. Telehealth evaluations with physicians licensed in Florida, with baseline and monitoring labs drawn at local lab draw sites across the Tampa Bay area.",
  heroCtaMeta:
    "Telehealth physician visits · Local lab draw sites · No subscriptions",

  introHeadingHtml:
    "Why Tampa men are switching to <gold>physician-supervised peptide therapy</gold>",
  introParagraphs: [
    "Tampa is full of places willing to sell you peptides — IV-drip lounges in Hyde Park, boutique med spas with no physician on staff, online stores shipping research-grade vials to your door. Peptide therapy done right is physician-led medicine. It starts with bloodwork, not a sales script.",
    "Strong Health designs peptide protocols for Tampa patients around individual labs and goals. Whether you're recovering from a training injury, dropping visceral belly fat that won't budge with diet alone, sleeping through the night again, restoring desire and arousal, or maintaining the body composition you work hard for, we use specific peptides for specific clinical reasons — and we monitor the relevant labs throughout the protocol.",
    "Strong Health is a real medical practice with board-certified physicians and pharmacy-compounded medications dispensed under physician orders. Tampa patients are served via telehealth by physicians licensed in Florida, with baseline and monitoring labs drawn at local lab draw sites across the Tampa Bay area. We don't sell supplement subscriptions. We don't push gray-market compounds. Every protocol is reviewed at scheduled intervals and adjusted based on how your body actually responds.",
  ],

  whyHeadingHtml:
    "Peptide therapy in Tampa, the way it should be <gold>prescribed and monitored</gold>",
  whyParagraphs: [
    "From South Tampa wellness clinics to Westshore recovery studios, Tampa has no shortage of places offering peptides — but very few that combine board-certified physician oversight with real lab monitoring and pharmacy-grade compounds from licensed compounders. Most Tampa patients we see have already tried at least one place that handed them a vial after a 10-minute video call.",
    "We built Strong Health's Tampa telehealth program around the principle that peptide therapy is real medicine: contraindications need to be screened, doses need to be titrated, and labs need to be monitored — wherever in the Tampa Bay area you happen to live. That's the standard.",
  ],
  whyStandardBullets: [
    "Board-certified physicians licensed in Florida",
    "Physician evaluation before any peptide is prescribed",
    "Baseline and monitoring labs at local lab draw sites near you",
    "Pharmacy-grade peptides from licensed 503A/503B compounders",
    "Individualized protocols designed around your bloodwork",
    "Scheduled lab monitoring throughout the protocol",
    "Telehealth follow-ups that fit a Tampa schedule",
    "Saturday morning appointments for working professionals",
    "Month-to-month treatment. No long-term contracts",
  ],

  steps: [
    {
      title: "Start with a telehealth consult with a Florida–licensed physician",
      desc: "Your first visit is a video consult with a Strong Health physician licensed in Florida. You'll review your history, goals, prior treatments, and any musculoskeletal or hormonal concerns.",
    },
    {
      title: "Baseline labs at a local draw site",
      desc: "We order a baseline panel — hormones (testosterone, estradiol, IGF-1), metabolic markers, and any peptide-specific labs your protocol needs — to a local lab draw site near you anywhere in the Tampa Bay area.",
    },
    {
      title: "Individualized protocol design",
      desc: "Your physician selects the right peptide(s), dose, and timing based on your labs and goals. Compounded by a licensed 503A or 503B pharmacy under physician orders. Pharmacy-grade only.",
    },
    {
      title: "Ongoing monitoring & telehealth follow-ups",
      desc: "Follow-up labs and check-ins at 4–12 weeks depending on the peptide. Dose adjustments via telehealth, with repeat labs ordered to the same local draw site whenever monitoring is clinically needed.",
    },
  ],

  physicians: [
    {
      name: "Strong Health Medical Team",
      title: "Attending Physicians, Tampa",
      credentials:
        "Board-Certified Physicians · Licensed in Florida · Peptide & Hormone Therapy Specialists",
      focus:
        "Individualized BPC-157, CJC-1295/Ipamorelin, Tesamorelin, PT-141, and DSIP protocols for Tampa patients, with telehealth visits and labs at local lab draw sites.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, Tampa",
      credentials:
        "Sports Medicine · Tendon & Soft-Tissue Injury Care · Recovery Optimization",
      focus:
        "Peptide-supported tendon, joint, and soft-tissue healing protocols for runners, cyclists, and gym athletes across South Tampa, Westshore, and the Tampa Bay area.",
    },
  ],

  neighborhoods: [
    "Downtown", "Hyde Park", "South Tampa", "Westshore",
    "Channelside", "Ybor City", "Seminole Heights", "Davis Islands",
    "Carrollwood", "New Tampa", "Temple Terrace", "Brandon",
    "Riverview", "Wesley Chapel", "Land O' Lakes", "Lutz",
    "Apollo Beach", "St. Petersburg", "Clearwater", "Palm Harbor",
  ],
  neighborhoodAreaName: "the Tampa Bay area",
  neighborhoodsSubtitle:
    "Strong Health serves peptide therapy patients across the Tampa Bay area — from Hyde Park, South Tampa, and Westshore to Brandon, Wesley Chapel, St. Petersburg, and Clearwater — via telehealth, with lab draws at local lab draw sites near you.",

  relatedServices: [
    {
      name: "Peptides for Healing & Recovery",
      desc: "BPC-157 and TB-500 protocols for tendon, ligament, joint, and soft-tissue healing — common in running, cycling, and lifting injuries.",
      href: "/peptides-for-healing/",
      cta: "BPC-157 healing guide →",
    },
    {
      name: "Peptides for Body Composition",
      desc: "Tesamorelin and GH-secretagogue protocols targeting visceral (belly) fat and lean-mass preservation, designed around your labs.",
      href: "/peptides-for-belly-fat/",
      cta: "Peptides for belly fat →",
    },
    {
      name: "All Strong Health Services",
      desc: "Lab panels, men's health consultations, sexual health, and more — physician-designed and monitored via telehealth.",
      href: "/services/",
      cta: "Browse services →",
    },
  ],
  relatedServicesSubtitle:
    "Many peptide patients combine therapy with hormone panels or body-composition programs — all designed and monitored by the same physician team.",

  faqs: [
    {
      question: "Where can I get peptide therapy in Tampa?",
      answer:
        "Strong Health serves Tampa peptide-therapy patients by appointment via telehealth. Physician consultations happen by video with doctors licensed in Florida, and baseline and monitoring labs are drawn at local lab draw sites across the Tampa Bay area — from Hyde Park, South Tampa, and Westshore to Brandon, Wesley Chapel, St. Petersburg, and Clearwater. Call (754) 263-6026 to book a free assessment.",
    },
    {
      question: "What peptides does Strong Health prescribe for Tampa patients?",
      answer:
        "Our physicians prescribe pharmacy-grade peptides selected for the patient's specific goals and labs. The most commonly used protocols include BPC-157 and TB-500 for tendon, joint, and soft-tissue healing; CJC-1295 with Ipamorelin for body composition, sleep, and recovery; Tesamorelin for visceral (belly) fat reduction; PT-141 for sexual desire and arousal; DSIP for deep-sleep architecture; and clinical-grade collagen peptides for connective tissue and skin support. Every protocol is individualized — we don't use one-size-fits-all stacks.",
    },
    {
      question: "Are peptides legal in Florida?",
      answer:
        "Yes, when prescribed by a physician licensed in Florida and dispensed through a licensed compounding pharmacy. Strong Health works only with 503A and 503B pharmacies under physician orders. We do not work with research-only or gray-market peptides. Every protocol uses pharmacy-grade product with full physician oversight, ongoing monitoring, and standard medical-record documentation.",
    },
    {
      question: "How much does peptide therapy cost for Tampa patients?",
      answer:
        "Your initial telehealth consult is free. Peptide protocols are month-to-month with transparent pricing — costs vary by peptide, dose, and duration. Most protocols include physician visits, monitoring labs, and pharmacy-compounded medication. We'll review the full cost of your specific protocol before you commit. We do not bill insurance directly, but we provide itemized superbills that many Tampa patients submit to plans like Florida Blue, UnitedHealthcare, Aetna, and Cigna for partial reimbursement.",
    },
    {
      question: "How is peptide therapy different from TRT or GLP-1 weight loss medications?",
      answer:
        "Peptides are short chains of amino acids that act as targeted signaling molecules — they're distinct from steroid hormones like testosterone and from GLP-1 agonists like semaglutide and tirzepatide. Healing peptides (BPC-157, TB-500) work on tissue repair pathways with no androgenic effect. GH-secretagogue peptides (CJC-1295, Ipamorelin, Tesamorelin) prompt your pituitary to release more of your own growth hormone in its natural pulsatile pattern. Peptide therapy can be combined with TRT or GLP-1 weight-loss programs, and many Strong Health patients run integrated protocols designed and monitored by the same physician.",
    },
    {
      question: "How long does it take to see results from peptide therapy?",
      answer:
        "Timing depends on the peptide and the goal. Sleep and recovery improvements (DSIP, Ipamorelin) are often noticeable within 2–4 weeks. Body-composition changes from CJC-1295/Ipamorelin or Tesamorelin typically appear at 8–12 weeks with more visible lean mass and fat-distribution shifts at 3–6 months. Tendon and joint healing protocols using BPC-157 or TB-500 generally run 4–12 weeks depending on tissue. PT-141 for sexual health works on demand, typically within 30–90 minutes of dosing. Every Strong Health protocol includes scheduled lab reassessments to confirm progress and adjust doses.",
    },
    {
      question: "Can I start peptide therapy entirely by telehealth in Tampa?",
      answer:
        "Yes. Tampa patients start with a telehealth evaluation by a Strong Health physician licensed in Florida, including a full medical history and a detailed discussion of goals. Baseline labs are ordered to a local lab draw site near you before any peptide is prescribed, and follow-ups — dose adjustments, lab reviews, and renewal authorizations — are conducted via telehealth with repeat labs at the same draw site.",
    },
    {
      question: "Can peptide therapy be combined with TRT for Tampa patients?",
      answer:
        "Yes. Strong Health physicians frequently design combined protocols pairing testosterone replacement therapy with GH-secretagogue peptides like CJC-1295/Ipamorelin for body composition and recovery, or with BPC-157 for active patients managing sports-related soft-tissue injuries. Because both therapies are designed and monitored by the same physician using the same lab panels, dose interactions and overall response are tracked together rather than in silos.",
    },
    {
      question: "Which Tampa Bay neighborhoods and cities do you serve?",
      answer:
        "The entire Tampa Bay area — Downtown, Hyde Park, South Tampa, Westshore, Channelside, Ybor City, and Seminole Heights, plus Carrollwood, New Tampa, Brandon, Riverview, Wesley Chapel, St. Petersburg, and Clearwater. Because care is delivered via telehealth with labs at local lab draw sites, you can start and stay on a protocol wherever in the bay area you live.",
    },
  ],

  finalCtaHeading: "Ready to talk to a physician about peptide therapy in Tampa?",
  finalCtaCopy:
    "Book a free assessment. Telehealth visits for Tampa patients with physician-designed protocols, real labs at local draw sites, and ongoing monitoring.",
  physicalClinic: false,
  parkingTransit:
    "No Tampa storefront. Care is delivered via telehealth to Tampa patients, with baseline and monitoring labs drawn at local lab draw sites across the Tampa Bay area.",
  physicianAvailability:
    "Strong Health physicians licensed in Florida see patients by appointment via telehealth, with lab orders sent to a local lab draw site near you.",
  appointmentExpectations:
    "Free first assessment, typically 30–45 minutes by video. We review history, goals, and current medications/supplements; baseline biomarker draws are ordered to a local lab draw site near you. Most patients are seen within 5 business days of booking.",
  howItWorksTag: "How Peptide Therapy Works for Tampa Patients",
  howItWorksHeadingIntro: "Telehealth visits. Local labs. Then",
  howItWorksHeadingGold: "monitored care.",
  physiciansSubtitleSuffix: "for Tampa patients.",
  relatedServicesHeadingIntro: "One medical team.",
  outboundCitations: [
    { label: "BPC-157 in tendon and soft-tissue healing (review)", url: "https://pubmed.ncbi.nlm.nih.gov/30915550/" },
    { label: "Thymosin beta-4 (TB-500) and tissue repair", url: "https://pubmed.ncbi.nlm.nih.gov/22894631/" },
    { label: "Ipamorelin / CJC-1295 stimulation of GH release", url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
  ],
};

/**
 * Master list of cities offering peptide therapy.
 *
 * To launch a new peptide city:
 *   1. Add a `CityPeptideConfig` constant above (mirroring `MIAMI_PEPTIDE_CONFIG`,
 *      or `DELRAY_BEACH_PEPTIDE_CONFIG` / `NEW_YORK_PEPTIDE_CONFIG` for
 *      telehealth service areas). Non-Florida cities set `statePrefix`/`stateName`.
 *   2. Append it to this array.
 *   3. Add the wrapper page at
 *      `src/pages/{statePrefix}/{slug}/peptide-therapy.astro` passing the config
 *      to `CityPeptidePage.astro`.
 */
export const ALL_PEPTIDE_CITIES: CityPeptideConfig[] = [
  MIAMI_PEPTIDE_CONFIG,
  DELRAY_BEACH_PEPTIDE_CONFIG,
  TAMPA_PEPTIDE_CONFIG,
  NEW_YORK_PEPTIDE_CONFIG,
  SAN_DIEGO_PEPTIDE_CONFIG,
  LAS_VEGAS_PEPTIDE_CONFIG,
  ATLANTA_PEPTIDE_CONFIG,
  AUSTIN_PEPTIDE_CONFIG,
];

/** Lookup peptide city config by slug. */
export const CITY_PEPTIDE_BY_SLUG: Record<string, CityPeptideConfig> = Object.fromEntries(
  ALL_PEPTIDE_CITIES.map(c => [c.slug, c]),
);
