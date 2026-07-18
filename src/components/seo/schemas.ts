/**
 * Schema.org JSON-LD builders (port of src/components/seo/JsonLd.tsx from the
 * old repo). Pure functions returning objects — render through
 * <JsonLd schema={...} />. Emitted JSON is identical to production.
 */
import type { Author } from "../../data/articleAuthors";
import {
  MIAMI_BRICKELL_CLINIC,
  STRONG_HEALTH_ORG_ID,
  STRONG_HEALTH_SAME_AS,
} from "../../data/miamiClinic";

const SITE_URL = "https://www.stronghealth.com";
const ORG_ID = STRONG_HEALTH_ORG_ID;

const absUrl = (url: string) => (url.startsWith("http") ? url : `${SITE_URL}${url}`);

/**
 * Production-parity URL formatting (remediation D5). Live production emits
 * SLASHLESS self-URL schema fields (MedicalWebPage.url, Article
 * mainEntityOfPage.@id, CollectionPage.url, final breadcrumb item) on exactly
 * these routes — the pages whose old `path` prop was slashless. Derived from
 * the 2026-07-14 QA fixture (jsonld-differences.json). Other routes (reviews,
 * diet, authors, home, miami peptide-therapy) emitted trailing-slash and are
 * left untouched. Canonicals are unaffected — always trailing-slash.
 */
const PROD_SLASHLESS_PATHS = new Set([
  "/about/", "/baking-soda-for-ed/", "/blog/", "/careers/",
  "/collagen-peptides/", "/dexa-scan/", "/editorial-guidelines/", "/fl/",
  "/foods-that-lower-testosterone/", "/garlic-and-honey-for-erectile-dysfunction/",
  "/hipaa-policy/", "/home-remedies-for-premature-ejaculation/",
  "/lysine-benefit-men-health/", "/nac-benefits-men/", "/nadh-benefits/",
  "/peptides-for-arthritis/", "/peptides-for-belly-fat/", "/peptides-for-healing/",
  "/peptides-for-libido/", "/peptides-for-muscle-growth/", "/peptides-for-sleep/",
  "/peptides-for-tendon-repair/", "/peptides/", "/porn-induced-erectile-dysfunction/",
  "/premature-ejaculation-exercises/", "/privacy-policy/", "/resveratrol-side-effects/",
  "/terms-of-use/",
]);

export function parityUrl(url: string): string {
  const abs = absUrl(url);
  const path = abs.replace(SITE_URL, "");
  return PROD_SLASHLESS_PATHS.has(path) ? SITE_URL + path.slice(0, -1) : abs;
}

function personRef(author: Author): Record<string, unknown> {
  return {
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    ...(author.profileUrl ? { url: absUrl(author.profileUrl) } : {}),
    worksFor: { "@id": ORG_ID },
  };
}

/**
 * Physician schema for a medically-reviewed page (US-008). Dr. Angel Rivera is
 * the default reviewer of record; `worksFor` links the org entity so the
 * physician, page, and clinic form one connected graph.
 */
export function physicianSchema(opts?: {
  name?: string;
  medicalSpecialty?: string;
  profileUrl?: string;
}) {
  const name = opts?.name ?? "Dr. Angel Rivera, M.D.";
  const profileUrl = opts?.profileUrl ?? "/author/dr-angel-rivera/";
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name,
    url: absUrl(profileUrl),
    medicalSpecialty: opts?.medicalSpecialty ?? "Preventive Medicine",
    worksFor: { "@id": ORG_ID },
  };
}

export interface MedicalClinicSchemaProps {
  name: string;
  description: string;
  url: string;
  telephone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  physicianName?: string;
  mapUrl?: string;
}

/**
 * MedicalClinic (LocalBusiness) schema for a physical clinic with NAP + geo
 * (US-007). Only physical locations emit this; telehealth service areas use
 * MedicalWebPage per the NYC precedent (no clinic → no MedicalClinic).
 */
export function medicalClinicSchema({
  name,
  description,
  url,
  telephone,
  streetAddress,
  city,
  state,
  postalCode,
  lat,
  lng,
  physicianName,
  mapUrl,
}: MedicalClinicSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name,
    description,
    url: absUrl(url),
    telephone,
    medicalSpecialty: "Preventive Medicine",
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality: city,
      addressRegion: state,
      postalCode,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
    parentOrganization: { "@id": ORG_ID },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
  };
  if (physicianName) {
    schema.employee = {
      "@type": "Physician",
      name: physicianName,
      url: absUrl("/author/dr-angel-rivera/"),
    };
  }
  if (mapUrl) schema.hasMap = mapUrl;
  return schema;
}

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: Author;
  reviewer?: Author;
  publishDate: string;
  updatedDate?: string;
  imageUrl?: string;
  url: string;
}

export function articleSchema({
  headline,
  description,
  author,
  reviewer,
  publishDate,
  updatedDate,
  imageUrl,
  url,
}: ArticleSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: personRef(author),
    publisher: { "@id": ORG_ID },
    datePublished: publishDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": parityUrl(url) },
  };
  if (updatedDate) schema.dateModified = updatedDate;
  if (imageUrl) schema.image = imageUrl;
  if (reviewer) schema.reviewedBy = personRef(reviewer);
  return schema;
}

export interface MedicalWebPageSchemaProps {
  name: string;
  description: string;
  url: string;
  lastReviewed?: string;
  reviewedBy?: Author;
}

export function medicalWebPageSchema({
  name,
  description,
  url,
  lastReviewed,
  reviewedBy,
}: MedicalWebPageSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    description,
    url: parityUrl(url),
    isPartOf: { "@type": "WebSite", name: "Strong Health", url: SITE_URL },
  };
  if (lastReviewed) schema.lastReviewed = lastReviewed;
  if (reviewedBy) schema.reviewedBy = personRef(reviewedBy);
  return schema;
}

export interface ProductSchemaProps {
  name: string;
  description: string;
  imageUrl?: string;
  brand?: string;
  rating?: { value: number; count: number };
  offers?: { price: string; currency?: string; availability?: string };
}

export function productSchema({
  name,
  description,
  imageUrl,
  brand,
  rating,
  offers,
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
  };
  if (imageUrl) schema.image = imageUrl;
  if (brand) schema.brand = { "@type": "Brand", name: brand };
  if (rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      reviewCount: rating.count,
    };
  }
  if (offers) {
    schema.offers = {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.currency || "USD",
      availability: offers.availability || "https://schema.org/InStock",
    };
  }
  return schema;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": ORG_ID,
    name: "Strong Health",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      "Physician-supervised peptide therapy from our Miami (Brickell) clinic. In-person exams, comprehensive biomarker labs, pharmacy-grade compounds, telehealth follow-ups.",
    telephone: MIAMI_BRICKELL_CLINIC.phoneTel,
    sameAs: STRONG_HEALTH_SAME_AS,
    // Backs the homepage "4.9 from 2,500+ verified patient reviews" trust claim
    // (US-008). Keep these values in sync with the on-page figures in
    // src/pages/index.astro; adjust or remove if the underlying review data
    // changes (YMYL: the schema must not overstate the on-page claim).
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2500",
      bestRating: "5",
      worstRating: "1",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: MIAMI_BRICKELL_CLINIC.streetAddress,
      addressLocality: MIAMI_BRICKELL_CLINIC.city,
      addressRegion: MIAMI_BRICKELL_CLINIC.state,
      postalCode: MIAMI_BRICKELL_CLINIC.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: MIAMI_BRICKELL_CLINIC.lat,
      longitude: MIAMI_BRICKELL_CLINIC.lng,
    },
    areaServed: { "@type": "State", name: "Florida" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    priceRange: "$",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Medical Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Peptide Therapy",
            description:
              "Physician-supervised peptide protocols for healing, body composition, sleep, libido, and longevity — compounded by licensed 503A/503B pharmacies.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Comprehensive Lab Testing",
            description:
              "Full biomarker panels including hormone levels, IGF-1, glucose, and metabolic markers, drawn on-site.",
          },
        },
      ],
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Omit for trail entries with no real destination URL. */
  path?: string;
}

export function breadcrumbSchema(
  items: BreadcrumbItem[],
  opts?: { parityLastItem?: boolean },
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? {
            item:
              opts?.parityLastItem && index === items.length - 1
                ? parityUrl(item.path)
                : `${SITE_URL}${item.path}`,
          }
        : {}),
    })),
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function faqPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export interface JobPostingSchemaProps {
  title: string;
  /** HTML description string (Google requires HTML formatting). */
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: string | string[];
  identifier: string;
  baseSalary: {
    min: number;
    max: number;
    currency?: string;
    unitText?: string;
  };
  jobLocation: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry?: string;
  };
  hiringOrganizationName?: string;
}

export function jobPostingSchema({
  title,
  description,
  datePosted,
  validThrough,
  employmentType,
  identifier,
  baseSalary,
  jobLocation,
  hiringOrganizationName = "Strong Health",
}: JobPostingSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    validThrough,
    employmentType,
    directApply: true,
    identifier: {
      "@type": "PropertyValue",
      name: hiringOrganizationName,
      value: identifier,
    },
    hiringOrganization: {
      "@id": ORG_ID,
      "@type": "Organization",
      name: hiringOrganizationName,
      sameAs: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: jobLocation.streetAddress,
        addressLocality: jobLocation.addressLocality,
        addressRegion: jobLocation.addressRegion,
        postalCode: jobLocation.postalCode,
        addressCountry: jobLocation.addressCountry ?? "US",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: baseSalary.currency ?? "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: baseSalary.min,
        maxValue: baseSalary.max,
        unitText: baseSalary.unitText ?? "YEAR",
      },
    },
  };
}

/**
 * Review-page schema graph (port of buildStructuredData in
 * ReviewArticleLayout.tsx): Article + FAQPage, plus Product with review /
 * aggregateRating for product-type reviews. Author/reviewer default to the
 * named physician (Dr. Angel Rivera).
 */
export interface ReviewStructuredDataProps {
  type: "product" | "competitor";
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  faqs: FAQItem[];
  productName?: string;
  productRating?: number;
  productReviewCount?: number;
  author?: Author;
  reviewer?: Author;
}

function reviewPersonSchema(author: Author) {
  const url = author.profileUrl
    ? author.profileUrl.startsWith("http")
      ? author.profileUrl
      : `${SITE_URL}${author.profileUrl}`
    : undefined;
  return {
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    ...(url ? { url } : {}),
  };
}

export function buildReviewStructuredData(
  props: ReviewStructuredDataProps,
  defaultAuthor: Author,
): object[] {
  const author = props.author ?? defaultAuthor;
  const reviewer = props.reviewer ?? defaultAuthor;
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: props.title,
      description: props.description,
      datePublished: props.datePublished,
      dateModified: props.dateModified,
      author: reviewPersonSchema(author),
      reviewedBy: reviewPersonSchema(reviewer),
      publisher: { "@type": "Organization", name: "Strong Health" },
      mainEntityOfPage: { "@type": "WebPage" },
    },
    faqPageSchema(props.faqs),
  ];

  if (props.type === "product" && props.productName) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: props.productName,
      description: props.description,
      review: {
        "@type": "Review",
        author: reviewPersonSchema(author),
        reviewRating: {
          "@type": "Rating",
          ratingValue: props.productRating ?? 3,
          bestRating: 5,
        },
      },
      aggregateRating: props.productReviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: props.productRating ?? 3,
            reviewCount: props.productReviewCount,
          }
        : undefined,
    });
  }

  return schemas;
}

export interface CollectionPageItem {
  name: string;
  url: string;
}

export function collectionPageSchema({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: CollectionPageItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: parityUrl(url),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absUrl(item.url),
      })),
    },
  };
}
