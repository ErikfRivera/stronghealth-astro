// PRP (Platelet-Rich Plasma) therapy — config-driven local page (US-N* pattern,
// modeled on cityPeptideConfig.ts). PRP is a distinct service line from peptide
// therapy: autologous platelet-rich plasma drawn from the patient's own blood
// and used for hair restoration, facial/skin rejuvenation, microneedling,
// under-eye rejuvenation, and orthopedic/sports-injury recovery.
//
// Miami is the launch (and, at launch, only) market. The interface is written
// so additional cities can be added later the way the peptide config grew.

export interface CityPRPClinic {
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

export interface CityPRPPhysician {
  name: string;
  title: string;
  credentials: string;
  focus: string;
}

export interface CityPRPFAQ {
  question: string;
  answer: string;
}

export interface CityPRPStep {
  title: string;
  desc: string;
}

export interface CityPRPRelatedService {
  name: string;
  desc: string;
  href: string;
  cta: string;
}

export interface CityPRPConfig {
  /** URL state prefix. Drives `/{statePrefix}/{slug}/prp-therapy/`. Defaults to "fl". */
  statePrefix?: "fl" | "ny" | "ca" | "nv" | "ga" | "tx";
  /** Full state name for breadcrumbs/copy. Defaults to "Florida". */
  stateName?: string;
  /** Real walk-in clinic? Defaults to true; false suppresses MedicalClinic JSON-LD. */
  physicalClinic?: boolean;

  /** LocalProof overrides (fall back to derived defaults). */
  parkingTransit?: string;
  physicianAvailability?: string;
  appointmentExpectations?: string;
  reviewLinks?: { label: string; url: string }[];
  relatedInternalLinks?: { label: string; href: string }[];
  outboundCitations?: { label: string; url: string }[];

  slug: string;
  cityName: string;
  county: string;
  clinicArea: string;

  clinic: CityPRPClinic;

  /** SEO */
  seoTitle: string;
  seoDescription: string;
  lastReviewed: string;
  jsonLdPageName: string;
  jsonLdPageDescription: string;
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

  /** Conditions/applications section subtitle */
  applicationsSubtitle: string;

  /** "Why Strong Health [City]" section */
  whyHeadingHtml: string;
  whyParagraphs: string[];
  whyStandardBullets: string[];

  /** How It Works steps */
  steps: CityPRPStep[];

  /** Physicians */
  physicians: CityPRPPhysician[];

  /** Neighborhoods */
  neighborhoods: string[];
  neighborhoodAreaName: string;
  neighborhoodsSubtitle: string;

  /** Related services cards */
  relatedServices: CityPRPRelatedService[];
  relatedServicesSubtitle: string;

  /** Pricing/cost transparency block */
  pricingHeadingHtml: string;
  pricingIntro: string;
  pricingRows: { label: string; price: string; note: string }[];
  pricingFootnote: string;

  /** FAQ */
  faqs: CityPRPFAQ[];

  /** Final CTA */
  finalCtaHeading: string;
  finalCtaCopy: string;
}

export const MIAMI_PRP_CONFIG: CityPRPConfig = {
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

  seoTitle: "PRP Therapy in Miami, FL",
  seoDescription:
    "Physician-led PRP in Miami, FL: platelet-rich plasma for hair restoration, PRP facials, microneedling, and joint & sports-injury recovery. Brickell clinic.",
  lastReviewed: "2026-07-17",
  jsonLdPageName: "PRP Therapy in Miami, FL — Strong Health Brickell Clinic",
  jsonLdPageDescription:
    "Physician-supervised platelet-rich plasma (PRP) therapy at Strong Health Miami's Brickell clinic: PRP hair restoration, PRP facials and microneedling, under-eye rejuvenation, and PRP injections for joints, tendons, and sports injuries.",
  reviewedByName: "Dr. Angel Rivera, M.D.",
  reviewedByRole: "Medical Director — Miami",

  heroTag: "Miami PRP Therapy Clinic · Brickell",
  reviewRating: "4.9",
  reviewCount: "from 850+ Miami patient reviews",
  aggregateReviewCount: 850,
  heroDescription1:
    "Physician-supervised platelet-rich plasma at our Brickell clinic — PRP hair restoration, PRP facials and microneedling, under-eye rejuvenation, and PRP injections for joints, tendons, and sports injuries. Your own blood, processed on-site, injected by a physician.",
  heroDescription2:
    "PRP uses the growth factors in your own platelets to stimulate tissue repair — no synthetic filler, no foreign donor material. Every treatment at Strong Health Miami starts with a physician consultation, an on-site blood draw, and a plan built around your goals, whether that's thinning hair, aging skin, dark under-eye hollows, or a knee that won't recover.",
  heroCtaMeta:
    "In-office physician injections · On-site blood processing · Bilingual (English/Spanish) · Saturday hours",

  introHeadingHtml:
    "What Miami patients should know about <gold>platelet-rich plasma (PRP)</gold>",
  introParagraphs: [
    "Miami is saturated with places offering \"PRP\" — med spas in Brickell and South Beach, mobile IV lounges, aesthetic studios, and hair clinics that run PRP as an add-on to whatever else they're selling. The quality gap is enormous. PRP is only as good as the blood processing behind it (the centrifuge spin, the platelet concentration, the technique) and the clinician holding the needle.",
    "Platelet-rich plasma is autologous, meaning it comes from you. We draw a small amount of your blood, spin it in a centrifuge to concentrate the platelets and their growth factors, and inject that concentrate into the scalp, face, under-eye area, or an injured joint or tendon. Because it's your own plasma, allergic reaction and rejection are not concerns the way they are with synthetic fillers.",
    "Strong Health Miami runs PRP as a physician-led medical service, not a walk-in spa menu item. Your blood is drawn and processed on-site at our Brickell clinic, and every injection is performed by or under a physician who has evaluated whether PRP is actually the right treatment for your goal. If it isn't, we'll tell you.",
  ],

  applicationsSubtitle:
    "The same platelet-rich plasma, applied to different problems. Each Strong Health Miami PRP protocol is matched to your goal, your anatomy, and realistic expectations about results.",

  whyHeadingHtml:
    "PRP in Miami, done as <gold>real medicine — not a spa add-on</gold>",
  whyParagraphs: [
    "Brickell and greater Miami have no shortage of PRP providers. What's rare is a clinic where a physician draws and processes your blood on-site, performs the injections, and follows your results across a treatment series — instead of a technician running a discounted \"vampire facial\" between other bookings.",
    "PRP is genuinely useful for the right patient and the right indication — androgenetic hair thinning, early skin aging, periorbital (under-eye) hollowing, and low-to-moderate joint and tendon problems all have published evidence behind them. It is not a miracle, and it is not right for everyone. We built Strong Health Miami's PRP program to be honest about both.",
  ],
  whyStandardBullets: [
    "Board-certified physicians at our Brickell clinic",
    "Your blood drawn and processed on-site — never shipped or pre-made",
    "Physician-performed injections, not delegated to a spa technician",
    "Honest assessment: we recommend PRP only when the evidence supports it",
    "Treatment series planned and tracked, with progress photos",
    "Combined protocols available (PRP + microneedling, PRP + TRT/peptides)",
    "Bilingual care (English & Spanish)",
    "Saturday morning appointments for working professionals",
    "Transparent, up-front pricing — no memberships or subscriptions",
  ],

  steps: [
    {
      title: "Physician consultation at our Brickell clinic",
      desc: "Your first visit is in person at 1000 Brickell Plaza. A physician evaluates your scalp, skin, under-eye area, or affected joint, reviews your goals and history, and confirms whether PRP is the right treatment — or whether something else fits better.",
    },
    {
      title: "On-site blood draw & PRP processing",
      desc: "We draw a small amount of your blood and spin it in a centrifuge on-site to concentrate the platelets and growth factors. Nothing is shipped, pre-made, or pooled — your PRP is prepared fresh, in the room, from your own blood.",
    },
    {
      title: "Physician-performed treatment",
      desc: "The concentrated plasma is injected into the scalp, face, or joint — or applied with medical microneedling for skin and hair. We use topical numbing and fine needles to keep it comfortable, and the whole visit typically runs 45–75 minutes.",
    },
    {
      title: "Treatment series & follow-up",
      desc: "Most PRP goals need a short series (commonly 3 sessions, 4–6 weeks apart) with maintenance afterward. We track progress with standardized photos and reassess at each visit, adjusting the plan to how you actually respond.",
    },
  ],

  physicians: [
    {
      name: "Dr. Angel Rivera, M.D.",
      title: "Medical Director, Miami",
      credentials:
        "Board-Certified · University of Medicine & Health Sciences · Medical Director, Strong Health",
      focus:
        "Regenerative and men's health medicine, including PRP hair restoration and facial rejuvenation. 12+ years of clinical experience in South Florida. Bilingual (English/Spanish).",
    },
    {
      name: "Strong Health Aesthetic & Hair Team",
      title: "Attending Clinicians, Miami",
      credentials:
        "Physician-Led Aesthetic Injectors · PRP Hair Restoration · Microneedling & Skin Rejuvenation",
      focus:
        "PRP scalp injections for androgenetic hair thinning, PRP facials, PRP with microneedling, and periorbital (under-eye) rejuvenation at the Brickell clinic.",
    },
    {
      name: "Strong Health Sports Medicine Team",
      title: "Consulting Specialists, Miami",
      credentials:
        "Sports Medicine · Orthopedic & Tendon Injury Care · Regenerative Injection Therapy",
      focus:
        "Image-guided PRP injections for knee, shoulder, elbow, and Achilles problems and sports injuries across Brickell, Wynwood, and Miami Beach.",
    },
  ],

  neighborhoods: [
    "Brickell", "Downtown Miami", "Wynwood", "Coral Gables",
    "Coconut Grove", "Little Havana", "Miami Beach", "South Beach",
    "Key Biscayne", "Edgewater", "Midtown", "Design District",
    "Doral", "Kendall", "South Miami", "Pinecrest",
    "Aventura", "North Miami", "Miami Lakes", "Hialeah",
  ],
  neighborhoodAreaName: "Miami-Dade",
  neighborhoodsSubtitle:
    "Our Brickell clinic is central and easy to reach for PRP patients from across Miami-Dade — from Miami Beach and Aventura to Coral Gables, South Miami, and Doral.",

  relatedServices: [
    {
      name: "Peptide Therapy in Miami",
      desc: "BPC-157, CJC-1295/Ipamorelin, and tissue-repair peptides — frequently combined with PRP joint and tendon injections to support recovery.",
      href: "/fl/miami/peptide-therapy/",
      cta: "Miami peptide therapy →",
    },
    {
      name: "Peptides for Healing & Recovery",
      desc: "How healing peptides work on tendon, ligament, and soft-tissue repair pathways — the clinical companion to a PRP injection plan.",
      href: "/peptides-for-healing/",
      cta: "Peptides for healing →",
    },
    {
      name: "DEXA Scan in Miami",
      desc: "Gold-standard body-composition and bone-density imaging at the same Brickell clinic.",
      href: "/fl/miami/dexascan/",
      cta: "Miami DEXA scan →",
    },
  ],
  relatedServicesSubtitle:
    "Many Miami PRP patients also see us for peptide-supported recovery or body-composition tracking — all at the same Brickell clinic, designed by the same physicians.",

  pricingHeadingHtml:
    "What does PRP <gold>cost in Miami?</gold>",
  pricingIntro:
    "PRP pricing in Miami varies widely because the product and the clinician vary widely. These are typical ranges for physician-performed PRP at Strong Health Miami. Your exact quote depends on the treatment area, the number of sessions, and whether PRP is combined with microneedling. We confirm the full price before anything is booked — no surprises.",
  pricingRows: [
    {
      label: "PRP hair restoration (per session)",
      price: "$600–$900",
      note: "Scalp injections for androgenetic thinning. Commonly a series of 3, then maintenance.",
    },
    {
      label: "PRP facial + microneedling (per session)",
      price: "$650–$950",
      note: "Medical microneedling with topical/injected PRP for skin texture and tone.",
    },
    {
      label: "PRP under-eye rejuvenation (per session)",
      price: "$600–$850",
      note: "Periorbital PRP for dark hollows and crepey under-eye skin.",
    },
    {
      label: "PRP joint / tendon injection (per site)",
      price: "$700–$1,200",
      note: "Knee, shoulder, elbow, or Achilles. Image guidance used when indicated.",
    },
  ],
  pricingFootnote:
    "PRP is generally considered elective and is rarely covered by insurance. We're a transparent direct-pay clinic and provide itemized receipts on request. Package pricing for a full treatment series is available.",

  faqs: [
    {
      question: "Where can I get PRP therapy in Miami?",
      answer:
        "Strong Health Miami offers physician-supervised PRP therapy at our Brickell clinic, located at 1000 Brickell Plaza, Miami, FL 33131. We treat patients from across Miami-Dade — Brickell, Miami Beach, Coral Gables, South Miami, Aventura, Doral, and beyond. Every PRP visit includes a physician consultation, an on-site blood draw and processing, and a physician-performed treatment. Call (754) 263-6026 to book a consultation.",
    },
    {
      question: "What is PRP therapy and how does it work?",
      answer:
        "PRP stands for platelet-rich plasma. We draw a small amount of your own blood and spin it in a centrifuge to concentrate the platelets, which carry growth factors that signal your body to repair tissue. That concentrate is then injected into — or microneedled over — the treatment area: the scalp for hair, the face for skin quality, the under-eye area for hollowing and crepey skin, or a joint or tendon for orthopedic recovery. Because PRP is autologous (from your own body), there's no risk of allergic reaction or rejection.",
    },
    {
      question: "What does PRP treat at Strong Health Miami?",
      answer:
        "Our Miami PRP program covers four main areas: (1) PRP hair restoration — scalp injections for androgenetic (pattern) hair thinning in men and women; (2) PRP facials and PRP with microneedling — for skin texture, tone, and early aging; (3) PRP under-eye rejuvenation — for dark, hollow, or crepey periorbital skin; and (4) PRP injections for joints, tendons, and sports injuries — knee, shoulder, elbow, and Achilles among them. A physician confirms PRP is appropriate for your specific goal before treating.",
    },
    {
      question: "How much does PRP cost in Miami?",
      answer:
        "At Strong Health Miami, PRP hair restoration typically runs $600–$900 per session, PRP facials with microneedling $650–$950, PRP under-eye treatment $600–$850, and PRP joint or tendon injections $700–$1,200 per site. Most cosmetic PRP goals need a series of about 3 sessions spaced 4–6 weeks apart, with maintenance afterward, and package pricing is available. PRP is elective and rarely covered by insurance. We confirm your full price up front — no memberships, no subscriptions, no surprises.",
    },
    {
      question: "Does PRP really work for hair loss?",
      answer:
        "For androgenetic alopecia (male- and female-pattern thinning), published systematic reviews and meta-analyses report that PRP scalp injections can increase hair density and thickness, especially in earlier-stage thinning where the follicles are miniaturized but not gone. It works best as part of a series with maintenance, and often alongside proven therapies like minoxidil or finasteride. PRP will not regrow hair on a scalp that is completely bald in an area, and results vary between patients — which is exactly why we start with a physician assessment rather than selling a package sight unseen.",
    },
    {
      question: "How many PRP sessions will I need and when will I see results?",
      answer:
        "Most cosmetic PRP protocols — hair, facial, and under-eye — start with a series of about 3 sessions spaced 4–6 weeks apart, followed by maintenance every 4–6 months. Hair results are gradual: reduced shedding first, then visible density changes over 3–6 months. Skin and under-eye improvements in texture and brightness typically show over 4–12 weeks. Joint and tendon injections are often 1–3 sessions, with recovery measured over weeks to a few months. We track your progress with standardized photos at each visit.",
    },
    {
      question: "Is PRP painful, and is there downtime?",
      answer:
        "PRP uses fine needles, and we apply topical numbing before scalp, facial, and under-eye treatments to keep it comfortable. Most patients describe it as very tolerable. Downtime is minimal: expect some redness, mild swelling, or pinpoint tenderness for 1–3 days, and for under-eye and facial work occasionally light bruising. Most Miami patients return to normal activity the same day and to the gym within 24–48 hours. Joint injections may ask for a short period of relative rest, which the physician will review with you.",
    },
    {
      question: "Is PRP safe?",
      answer:
        "Because PRP is made from your own blood, the safety profile is favorable — there's no risk of allergic reaction or rejection to a foreign substance. The most common effects are temporary: injection-site soreness, redness, swelling, or minor bruising. As with any injection, there is a small risk of infection or bruising, which is minimized by drawing and processing blood under proper medical conditions and having a physician perform the treatment. We screen for contraindications (certain blood disorders, active infection, some medications) during your consultation.",
    },
    {
      question: "Can PRP be combined with microneedling or other treatments?",
      answer:
        "Yes. PRP with medical microneedling is one of our most popular Miami facial protocols — the microneedling creates controlled micro-channels that let the platelet growth factors reach deeper into the skin. For hair, PRP is often combined with topical or oral therapies. And for men addressing hair thinning alongside low energy or libido, PRP hair restoration pairs naturally with a hormone (TRT) or peptide workup — all available at the same Brickell clinic and coordinated by the same physicians.",
    },
    {
      question: "How is PRP different from fillers or a hair transplant?",
      answer:
        "Dermal fillers add synthetic volume (usually hyaluronic acid) instantly; PRP instead stimulates your own tissue to improve quality and thickness gradually, using no foreign material. For hair, a transplant surgically relocates follicles and is a one-time procedure for advanced loss, whereas PRP is a non-surgical, injection-based treatment best suited to earlier thinning or to support a transplant's results. These are complementary tools, not competitors — during your consultation a physician will tell you honestly which one actually fits your situation.",
    },
    {
      question: "Do you offer Spanish-speaking PRP consultations in Miami?",
      answer:
        "Yes. Our Brickell clinic offers bilingual care in English and Spanish. Dr. Rivera and several team members are fluent in Spanish, reflecting the Miami-Dade communities we serve. Consultations, treatments, and follow-ups can all be conducted in Spanish if you prefer.",
    },
  ],

  finalCtaHeading: "Ready to talk to a Miami physician about PRP?",
  finalCtaCopy:
    "Book a consultation at our Brickell clinic. A physician will assess your scalp, skin, or joint and tell you honestly whether PRP is the right treatment — before you commit to anything.",
  physicalClinic: true,
  parkingTransit:
    "Located at 1000 Brickell Plaza in Brickell, Miami. Parking at the Brickell Plaza garage; Metrorail/Metromover Brickell station is about 0.3 mi away. I-95 exit 1A, then east on SW 13th St.",
  physicianAvailability:
    "Dr. Angel Rivera, M.D. and the Strong Health aesthetic, hair, and sports-medicine teams perform PRP treatments in person on weekdays and Saturday mornings at the Brickell clinic.",
  appointmentExpectations:
    "Consultation first, typically 30–45 minutes, before any PRP is performed. If you're treating on the same day, avoid NSAIDs and alcohol beforehand and come hydrated. A PRP visit including the blood draw and treatment usually runs 45–75 minutes. Most patients are seen within 5 business days of booking.",
  reviewLinks: [
    { label: "Trustpilot reviews for Strong Health", url: "https://www.trustpilot.com/review/stronghealth.com" },
    {
      label: "Google Business Profile — Strong Health Miami",
      url: "https://www.google.com/maps/search/?api=1&query=Strong%20Health%20Miami%2C%201000%20Brickell%20Plaza%2C%20Miami%2C%20FL%2033131",
    },
  ],
  relatedInternalLinks: [
    { label: "Peptide Therapy in Miami", href: "/fl/miami/peptide-therapy/" },
    { label: "Peptides Hub: All Peptide Therapies", href: "/peptides/" },
    { label: "DEXA Scan in Miami", href: "/fl/miami/dexascan/" },
    { label: "Peptides for tissue repair & healing", href: "/peptides-for-healing/" },
    { label: "Peptides for tendon & ligament repair", href: "/peptides-for-tendon-repair/" },
    { label: "All Florida locations", href: "/fl/" },
    { label: "Strong Health services hub", href: "/" },
  ],
  outboundCitations: [
    {
      label:
        "Gupta AK, et al. — Platelet-rich plasma as a therapy for androgenic alopecia: systematic review & meta-analysis (PubMed/NIH)",
      url: "https://pubmed.ncbi.nlm.nih.gov/32410524/",
    },
    {
      label:
        "Nita AC, et al. — Platelet-Rich Plasma in Facial Rejuvenation: a systematic appraisal of the clinical evidence (PMC/NIH)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8606573/",
    },
    {
      label:
        "American Academy of Orthopaedic Surgeons (AAOS) — Platelet-Rich Plasma (PRP), OrthoInfo",
      url: "https://www.orthoinfo.org/en/treatment/platelet-rich-plasma-prp/",
    },
  ],
};

/** All cities with a PRP page (parallels ALL_PEPTIDE_CITIES). Miami-only at launch. */
export const ALL_PRP_CITIES: {
  slug: string;
  cityName: string;
  statePrefix?: CityPRPConfig["statePrefix"];
}[] = [{ slug: MIAMI_PRP_CONFIG.slug, cityName: MIAMI_PRP_CONFIG.cityName }];
