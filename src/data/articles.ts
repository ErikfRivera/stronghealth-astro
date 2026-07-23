import { reviews } from "./reviews";

export type Category =
  | "All"
  | "Sexual Health"
  | "Nutrients & Supplements"
  | "Peptide Therapy"
  | "Supplement Reviews"
  | "Services"
  | "Diet & Nutrition";

export interface ArticleMeta {
  title: string;
  subtitle: string;
  path: string;
  category: Category;
  readTime: string;
  datePublished: string;
}

export const articles: ArticleMeta[] = [
  {
    title: "Peptides for Anti-Aging: GH Secretagogues, NAD+, and the Longevity Axis",
    subtitle: "An evidence-based look at what physician-supervised peptide therapy can and can't do about age-related decline in the growth-hormone and NAD+ systems.",
    path: "/peptides-for-anti-aging/",
    category: "Peptide Therapy",
    readTime: "9 min read",
    datePublished: "2026-07-16",
  },
  {
    title: "Peptides for Weight Loss: GLP-1, GH Secretagogues, and Fat-Loss Protocols",
    subtitle: "How GLP-1 medications and GH-secretagogue peptides support medical weight loss — and how they protect lean mass along the way.",
    path: "/peptides-for-weight-loss/",
    category: "Peptide Therapy",
    readTime: "10 min read",
    datePublished: "2026-07-16",
  },
  {
    title: "Peptides for Men: What the Evidence Actually Shows",
    subtitle: "Men are the target market for peptide marketing, and that volume gets mistaken for evidence. What actually has human data, what doesn't, and the prostate and fertility risks clinics underplay.",
    path: "/peptides-for-men/",
    category: "Peptide Therapy",
    readTime: "14 min read",
    datePublished: "2026-07-23",
  },
  {
    title: "Pollotarianism: The Complete Guide to the Pollotarian Diet",
    subtitle: "Poultry stays, every other meat goes. What the research shows about swapping red meat for chicken — heart health, cancer risk, weight, and how to do it right.",
    path: "/pollotarianism/",
    category: "Diet & Nutrition",
    readTime: "15 min read",
    datePublished: "2026-07-18",
  },
  {
    title: "Detox Diets: What the Evidence Actually Says About Cleansing Your Body",
    subtitle: "Your liver, kidneys, and gut already detoxify you around the clock. Here's what a detox diet can and can't do — and the honest, evidence-based version worth keeping.",
    path: "/detox-diet/",
    category: "Diet & Nutrition",
    readTime: "12 min read",
    datePublished: "2026-07-18",
  },
  {
    title: "The Stillman Diet: History, Risks, and Why Modern Medicine Moved On",
    subtitle: "A 1967 crash diet that sold 5 million copies, raised cholesterol in every study participant, and pioneered ideas that still influence how we think about protein and weight loss.",
    path: "/stillman-diet/",
    category: "Diet & Nutrition",
    readTime: "16 min read",
    datePublished: "2026-04-04",
  },
  {
    title: "Semaglutide Diet: Complete Guide for Weight Loss (2026)",
    subtitle: "What to eat, what to avoid, and how to structure your nutrition for maximum results on semaglutide — backed by STEP trial data and clinical evidence.",
    path: "/semaglutide-diet/",
    category: "Diet & Nutrition",
    readTime: "18 min read",
    datePublished: "2026-04-01",
  },
  {
    title: "Foods That Lower Testosterone: Separating Myth from Evidence",
    subtitle: "The internet is full of lists claiming certain foods destroy your testosterone. But what does the clinical evidence actually say?",
    path: "/foods-that-lower-testosterone/",
    category: "Nutrients & Supplements",
    readTime: "11 min read",
    datePublished: "2026-03-28",
  },
  {
    title: "Resveratrol Side Effects: GI Issues, Blood Thinning & Estrogenic Concerns for Men",
    subtitle: "Resveratrol is widely promoted for anti-aging and cardiovascular benefits, but it carries real side effects and drug interactions that men should understand.",
    path: "/resveratrol-side-effects/",
    category: "Nutrients & Supplements",
    readTime: "8 min read",
    datePublished: "2026-03-28",
  },
  {
    title: "NADH Benefits: Cellular Energy, Cognition & the NAD+/NADH Distinction Explained",
    subtitle: "NADH is the reduced form of NAD+ and the primary electron carrier that drives mitochondrial ATP production.",
    path: "/nadh-benefits/",
    category: "Nutrients & Supplements",
    readTime: "10 min read",
    datePublished: "2026-03-28",
  },
  {
    title: "Lysine Benefits for Men's Health: Collagen, Calcium, Immunity & Testosterone Support",
    subtitle: "This essential amino acid does more than fight cold sores. Lysine supports connective tissue integrity, bone density, immune defense, and may indirectly support testosterone production.",
    path: "/lysine-benefit-men-health/",
    category: "Nutrients & Supplements",
    readTime: "9 min read",
    datePublished: "2026-03-28",
  },
  {
    title: "NAC Benefits for Men: Liver Detox, Testosterone Support & Antioxidant Defense",
    subtitle: "N-Acetyl Cysteine is one of the most versatile supplements available, supporting liver function, fertility, and hormonal health in men.",
    path: "/nac-benefits-men/",
    category: "Nutrients & Supplements",
    readTime: "9 min read",
    datePublished: "2026-03-28",
  },
  {
    title: "DEXA Scan: The Gold Standard for Body Composition Analysis",
    subtitle: "Everything you need to know about dual-energy X-ray absorptiometry: what it measures, how it compares to other methods, and why it matters for TRT monitoring.",
    path: "/dexa-scan/",
    category: "Services",
    readTime: "14 min read",
    datePublished: "2025-03-15",
  },
  {
    title: "Peptides for Arthritis: How BPC-157 and TB-500 Address Joint Inflammation",
    subtitle: "Arthritis affects millions of men. BPC-157 and TB-500 offer anti-inflammatory and regenerative mechanisms that may complement traditional treatment.",
    path: "/peptides-for-arthritis/",
    category: "Peptide Therapy",
    readTime: "11 min read",
    datePublished: "2026-02-15",
  },
  {
    title: "Collagen Peptides: Structural Support for Joints, Skin & Connective Tissue",
    subtitle: "Collagen peptides support the body's structural framework. Learn about the different types, clinical evidence, and how they complement hormone optimization.",
    path: "/collagen-peptides/",
    category: "Peptide Therapy",
    readTime: "11 min read",
    datePublished: "2026-02-20",
  },
  {
    title: "Porn-Induced Erectile Dysfunction (PIED): Understanding, Recovery & Treatment",
    subtitle: "An evidence-based guide to how excessive pornography use can affect erectile function, and what you can do about it.",
    path: "/porn-induced-erectile-dysfunction/",
    category: "Sexual Health",
    readTime: "12 min read",
    datePublished: "2026-02-10",
  },
  {
    title: "Peptides for Belly Fat: How Tesamorelin and AOD-9604 Target Abdominal Fat",
    subtitle: "Stubborn belly fat is more than cosmetic. It's metabolically active and hormonally disruptive. These peptides address it at the biological level.",
    path: "/peptides-for-belly-fat/",
    category: "Peptide Therapy",
    readTime: "11 min read",
    datePublished: "2026-02-10",
  },
  {
    title: "Premature Ejaculation Exercises: Step-by-Step Kegel & Reverse Kegel Guide",
    subtitle: "A clinician-reviewed, progressive training program to improve ejaculatory control through pelvic floor strengthening.",
    path: "/premature-ejaculation-exercises/",
    category: "Sexual Health",
    readTime: "10 min read",
    datePublished: "2026-02-05",
  },
  {
    title: "Peptides for Muscle Growth: How CJC-1295, Ipamorelin & BPC-157 Support Lean Mass",
    subtitle: "Growth hormone-releasing peptides offer a physician-supervised approach to muscle growth that works with your body's natural systems.",
    path: "/peptides-for-muscle-growth/",
    category: "Peptide Therapy",
    readTime: "12 min read",
    datePublished: "2026-02-05",
  },
  {
    title: "Peptides for Libido: How PT-141 Addresses Sexual Desire at the Neurological Level",
    subtitle: "PT-141 (bremelanotide) represents a fundamentally different approach to treating low libido, one that works through the brain rather than blood flow.",
    path: "/peptides-for-libido/",
    category: "Peptide Therapy",
    readTime: "10 min read",
    datePublished: "2026-02-01",
  },
  {
    title: "Home Remedies for Premature Ejaculation: What Actually Works",
    subtitle: "Evidence-based behavioral techniques, topical treatments, and lifestyle changes that can help, and the claims that don't hold up.",
    path: "/home-remedies-for-premature-ejaculation/",
    category: "Sexual Health",
    readTime: "11 min read",
    datePublished: "2026-02-01",
  },
  {
    title: "Garlic and Honey for Erectile Dysfunction: Fact vs. Fiction",
    subtitle: "Examining the traditional folk remedy claim: what science supports, what it doesn't, and what actually works.",
    path: "/garlic-and-honey-for-erectile-dysfunction/",
    category: "Sexual Health",
    readTime: "9 min read",
    datePublished: "2026-01-25",
  },
  {
    title: "Baking Soda for Erectile Dysfunction: What the Science Actually Says",
    subtitle: "Separating internet claims from medical evidence, and what actually works for ED.",
    path: "/baking-soda-for-ed/",
    category: "Sexual Health",
    readTime: "8 min read",
    datePublished: "2026-01-20",
  },
  {
    title: "Peptides for Sleep: How DSIP Supports Deep, Restorative Sleep Architecture",
    subtitle: "Poor sleep undermines every aspect of health, from hormones and metabolism to cognition and recovery. DSIP offers a fundamentally different approach.",
    path: "/peptides-for-sleep/",
    category: "Peptide Therapy",
    readTime: "11 min read",
    datePublished: "2026-01-20",
  },
  {
    title: "Peptides for Tendon Repair: How BPC-157 and TB-500 Accelerate Healing",
    subtitle: "Tendon injuries are notoriously slow to heal. BPC-157 and TB-500 represent a new frontier in regenerative medicine.",
    path: "/peptides-for-tendon-repair/",
    category: "Peptide Therapy",
    readTime: "12 min read",
    datePublished: "2026-01-15",
  },
  {
    title: "Peptides for Healing: How BPC-157 and TB-500 Support Full-Body Recovery",
    subtitle: "From gut lining repair to musculoskeletal recovery, healing peptides address tissue damage at the cellular level.",
    path: "/peptides-for-healing/",
    category: "Peptide Therapy",
    readTime: "12 min read",
    datePublished: "2026-01-10",
  },
  ...reviews.map(
    (r): ArticleMeta => ({
      title: r.title,
      subtitle: r.blurb,
      path: r.path,
      category: "Supplement Reviews",
      readTime: r.readTime,
      datePublished: r.datePublished,
    }),
  ),
];

export const categoryColors: Record<Category, string> = {
  "All": "#C9A84C",
  "Sexual Health": "#EF4444",
  "Nutrients & Supplements": "#34D399",
  "Peptide Therapy": "#818CF8",
  "Supplement Reviews": "#F59E0B",
  "Services": "#38BDF8",
  "Diet & Nutrition": "#F472B6",
};
