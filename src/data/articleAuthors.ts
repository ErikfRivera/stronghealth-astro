export interface Author {
  name: string;
  credentials: string;
  role: string;
  avatarUrl?: string;
  profileUrl?: string;
}

export const DR_ANGEL_RIVERA: Author = {
  name: "Dr. Angel Rivera, M.D.",
  credentials: "M.D., Staff Psychiatrist",
  role: "Medical Reviewer, Strong Health",
  profileUrl: "/author/dr-angel-rivera/",
};

export const MAHADEV_MUKHERJEE: Author = {
  name: "Mahadev Mukherjee",
  credentials: "B.Sc. (Hons) Chemistry, MBA Pharma Mgmt (Pursuing)",
  role: "Scientific Content Writer, Strong Health",
  profileUrl: "/author/mahadev-mukherjee/",
};

export const EDITORIAL_GUIDELINES_URL = "/editorial-guidelines/";

export const ARTICLE_AUTHORSHIP: Record<
  string,
  { author: Author; reviewer: Author }
> = {
  "/dexa-scan/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/fl/miami/dexascan/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/foods-that-lower-testosterone/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/lysine-benefit-men-health/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/nac-benefits-men/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/nadh-benefits/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/resveratrol-side-effects/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/semaglutide-diet/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/stillman-diet/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-healing/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-tendon-repair/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-sleep/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-muscle-growth/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-libido/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-belly-fat/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-arthritis/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/collagen-peptides/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-anti-aging/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/peptides-for-weight-loss/": { author: MAHADEV_MUKHERJEE, reviewer: DR_ANGEL_RIVERA },
  "/porn-induced-erectile-dysfunction/": { author: DR_ANGEL_RIVERA, reviewer: DR_ANGEL_RIVERA },
  "/premature-ejaculation-exercises/": { author: DR_ANGEL_RIVERA, reviewer: DR_ANGEL_RIVERA },
  "/home-remedies-for-premature-ejaculation/": { author: DR_ANGEL_RIVERA, reviewer: DR_ANGEL_RIVERA },
  "/baking-soda-for-ed/": { author: DR_ANGEL_RIVERA, reviewer: DR_ANGEL_RIVERA },
  "/garlic-and-honey-for-erectile-dysfunction/": { author: DR_ANGEL_RIVERA, reviewer: DR_ANGEL_RIVERA },
};
