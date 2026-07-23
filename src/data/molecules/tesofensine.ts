import type { MoleculeConfig } from "./types";

export const TESOFENSINE: MoleculeConfig = {
  slug: "tesofensine",
  name: "Tesofensine",
  aliases: ["NS2330"],
  group: "Metabolic & GLP-1",
  goals: ["weight-loss", "belly-fat"],
  seoTitle: "Tesofensine: What It Is & the Evidence",
  metaDescription:
    "Tesofensine is an investigational triple monoamine reuptake inhibitor — not a peptide — studied for weight loss, with notable blood-pressure and safety caveats.",
  tagline:
    "An investigational, orally administered appetite suppressant studied for obesity — often marketed alongside peptides, though it is not a peptide and is not FDA-approved.",
  primaryUse: "Investigational appetite suppressant for weight loss (not FDA-approved)",
  datePublishedISO: "2026-07-23",
  dateModifiedISO: "2026-07-23",
  whatItIs: [
    "Tesofensine (development code NS2330) is frequently searched for as a 'peptide,' but it is not one. It is a small-molecule, orally administered triple monoamine reuptake inhibitor — it blocks the reuptake of noradrenaline, dopamine, and serotonin in the brain, which is a fundamentally different class of drug from the peptides in this library.",
    "It was originally investigated for neurological conditions and later studied for obesity after weight loss was noticed as a side effect. As of 2026 it is not FDA-approved in the United States. It is an investigational compound, and Strong Health does not prescribe or provide it.",
  ],
  mechanism: [
    "By slowing the reuptake of noradrenaline, dopamine, and serotonin, tesofensine raises the levels of these neurotransmitters in the brain. Preclinical work suggests its appetite-suppressing effect is driven largely by indirect stimulation of alpha-1 adrenergic and dopamine D1 receptor pathways, reducing food intake.",
    "This central, stimulant-like mechanism is also the source of its safety concerns. The same neurotransmitter systems that curb appetite also influence blood pressure, heart rate, mood, and sleep — which is why the drug's cardiovascular and psychiatric effects have received close scrutiny.",
  ],
  usedFor: [
    {
      heading: "Obesity and weight management",
      desc: "The main context in which tesofensine has been studied — appetite suppression and weight loss in adults with obesity, alongside diet.",
    },
    {
      heading: "Neurological research (historical)",
      desc: "Originally investigated for Parkinson's and Alzheimer's disease; weight loss emerged as a notable effect and redirected later research toward obesity.",
    },
  ],
  evidence: [
    "In a 24-week phase 2, randomized, double-blind, placebo-controlled trial published in The Lancet in 2008, tesofensine combined with an energy-restricted diet produced dose-dependent weight loss substantially greater than placebo, with the middle dose (0.5 mg) yielding roughly 10% weight reduction [1]. Its appetite-suppressing mechanism has been characterized in preclinical models as acting through alpha-1 adrenergic and dopamine D1 pathways [2].",
    "That evidence comes with important caveats. The same trial noted increases in blood pressure and heart rate at higher doses, and the drug's monoaminergic activity has been linked to psychiatric effects such as agitation, mood changes, and sleep disturbance. A published expression of concern later questioned the completeness of adverse-event reporting for tesofensine, which is a further reason for caution.",
    "Tesofensine has not completed the large phase 3 outcome trials that regulators require, and it is not FDA-approved. We present it as a compound patients ask about — with its real risks stated — not as a treatment we endorse or provide.",
  ],
  dosingContext: [
    "In trials, tesofensine was taken as a once-daily oral tablet alongside a calorie-restricted diet, with dosing set by study protocols. There is no FDA-approved label or approved dose in the United States.",
    "Because tesofensine is investigational and not approved here, there is no legitimate pharmacy source for it as an obesity treatment. Product marketed online or by gray-market 'peptide' vendors is unverified for identity and purity, and its stimulant-like cardiovascular and psychiatric risks make unsupervised use particularly unwise.",
  ],
  safety: [
    "The safety signals that matter most are cardiovascular and psychiatric. Trials reported dose-dependent increases in blood pressure and heart rate, and the drug's mechanism raises the potential for agitation, anxiety, mood changes, insomnia, and dry mouth. These are not trivial in a medication intended for long-term use.",
    "Long-term safety is not established, and questions have been raised about the reporting of adverse effects in the published literature. Combined with the lack of FDA approval, this is why Strong Health does not offer tesofensine and why we would steer patients toward better-characterized, approved options.",
  ],
  commonSideEffects: [
    "Increased blood pressure and heart rate",
    "Dry mouth",
    "Insomnia or disturbed sleep",
    "Agitation, anxiety, or mood changes",
    "Constipation",
  ],
  contraindications: [
    "Cardiovascular disease, uncontrolled hypertension, or arrhythmia",
    "History of mood, anxiety, or other psychiatric disorders",
    "Concurrent use of other stimulants, MAO inhibitors, or serotonergic drugs",
    "Pregnancy or breastfeeding",
    "Use outside a clinical trial (tesofensine is investigational and not FDA-approved)",
  ],
  howWePrescribe: [
    "Strong Health does not prescribe or provide tesofensine. It is not FDA-approved in the United States, it is not a peptide, and its cardiovascular and psychiatric risk profile — together with published concerns about adverse-event reporting — puts it outside the standard of care we hold to.",
    "We document tesofensine because it is heavily marketed and searched for, sometimes mislabeled as a peptide, and patients deserve an honest, physician-reviewed explanation. If you want medically supervised weight loss, our physicians evaluate FDA-cleared and appropriately compounded options and monitor you with real labs and follow-up.",
  ],
  faqs: [
    {
      question: "Is tesofensine a peptide?",
      answer:
        "No. Despite being marketed alongside peptides, tesofensine is a small-molecule triple monoamine reuptake inhibitor — it acts on noradrenaline, dopamine, and serotonin in the brain. It is a different class of drug entirely from the peptides in this library.",
    },
    {
      question: "Is tesofensine FDA-approved for weight loss?",
      answer:
        "No. Tesofensine is investigational and not FDA-approved in the United States. It has not completed the phase 3 outcome trials required for approval, and there is no legitimate pharmacy source for it as an obesity treatment here.",
    },
    {
      question: "How much weight did people lose on tesofensine?",
      answer:
        "In a 24-week phase 2 trial, the 0.5 mg dose plus a calorie-restricted diet produced roughly 10% weight loss — more than placebo. However, the same trial showed dose-dependent increases in blood pressure and heart rate, and the drug carries psychiatric risks, so those figures have to be read alongside the safety concerns.",
    },
    {
      question: "Can I get tesofensine at Strong Health?",
      answer:
        "No. We do not offer tesofensine because it is not FDA-approved, is not a peptide, and carries cardiovascular and psychiatric risks together with questions about its adverse-event reporting. We can evaluate you for approved, physician-supervised weight-loss options instead.",
    },
  ],
  citations: [
    {
      id: 1,
      text: "Astrup A, Madsbad S, Breum L, et al. Effect of tesofensine on bodyweight loss, body composition, and quality of life in obese patients: a randomised, double-blind, placebo-controlled trial. Lancet. 2008;372(9653):1906-1913.",
      url: "https://pubmed.ncbi.nlm.nih.gov/18950853/",
    },
    {
      id: 2,
      text: "Axel AM, Mikkelsen JD, Hansen HH. Tesofensine, a novel triple monoamine reuptake inhibitor, induces appetite suppression by indirect stimulation of alpha1 adrenoceptor and dopamine D1 receptor pathways in the diet-induced obese rat. Neuropsychopharmacology. 2010;35(7):1464-1476.",
      url: "https://pubmed.ncbi.nlm.nih.gov/20200509/",
    },
  ],
  regulatoryNote:
    "Tesofensine is not a peptide and is not FDA-approved. This page is educational, physician-reviewed context — not medical advice, a dosing guide, or an offer to prescribe. Strong Health does not provide tesofensine.",
  weDoNotOffer: true,
  doNotOfferBody:
    "Interested in medically supervised weight loss? Talk to one of our physicians about FDA-approved and appropriately compounded options with real clinical monitoring — or explore our physician-reviewed guides.",
  doNotOfferCtaLabel: "Talk to a physician about weight loss →",
  doNotOfferLinks: [
    { label: "our guide to peptides for weight loss", href: "/peptides-for-weight-loss/" },
    { label: "peptides for belly & visceral fat", href: "/peptides-for-belly-fat/" },
    { label: "the full molecule library", href: "/molecules/" },
  ],
};
