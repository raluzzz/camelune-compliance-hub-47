import type { CountrySectionData } from "@/components/seller/help/CountrySection";
import type { FAQItem } from "@/components/seller/FAQ";

export const EPR_FAQ: FAQItem[] = [
  {
    q: "How does Camelune identify my EPR obligations?",
    a: "Camelune determines your obligations based on your active listings, the destination countries you ship to, and the product categories you sell. Packaging (PACK) applies to all sellers who ship packaged goods to EU countries. Battery (BATT) obligations apply if your catalogue includes quartz watches, smartwatches, or any product with an integrated battery. Electrical appliances (EEE / WEEE) obligations apply to electronic equipment sold into EU markets. Obligations are assessed per destination country — selling to Germany, France, and Romania simultaneously may require separate registrations in each.",
  },
  {
    q: "Do I need to comply with EPR even if I'm based in Romania and only sell within Romania?",
    a: "Yes. Romanian law implements EU Extended Producer Responsibility rules nationally, so EPR is not limited to cross-border sales. If you ship packaged goods, sell battery-powered products, or sell electronic equipment to customers in Romania, the relevant PACK, BATT, or EEE obligations apply in Romania. Your company location does not exempt you — what matters is where you place products on the market.",
  },
  {
    q: "Can one product trigger multiple EPR obligations?",
    a: "Yes. A single product can fall under more than one EPR category at the same time. A quartz watch, for example, can simultaneously trigger packaging obligations (for its box and shipping materials), battery obligations (for the cell inside the watch), and WEEE obligations (as an electronic device). Each category requires its own registration with the relevant authority in each destination country where you sell.",
  },
  {
    q: "Do I need separate registrations for each country?",
    a: "Yes. EPR registrations are country-specific — a German packaging registration does not cover France, Romania, Austria, or Spain. Each destination market has its own authority, registration process, and reporting requirements. On Camelune, you submit your EPR numbers separately for each country and category combination (for example, Packaging — Germany and Batteries — France are two distinct obligations).",
  },
  {
    q: "What happens if my EPR information is missing on Camelune?",
    a: "Camelune may pause your listings in the affected destination country until the required registration is submitted and verified. For example, missing German packaging information blocks all eligible sales to Germany — but does not affect your sales to Romania or France. You can track the status of each obligation on your EPR Compliance page, including items marked Missing, Review required, or Rejected.",
  },
  {
    q: "Where do I submit my EPR numbers?",
    a: "Directly in your Camelune dashboard under EPR Compliance. Each country and category has its own detail page and submission form — open the relevant obligation (for example, Packaging — Germany), complete the required fields, upload your registration documents, and submit for review. Once approved, your EPR number is stored on file for that market.",
  },
  {
    q: "How long does document review take?",
    a: "Documents are typically reviewed within 3–5 business days after submission. You will receive an email notification once your registration is approved. If a document is missing, illegible, or does not match the registration number provided, you will be asked to resubmit — the obligation will be marked Rejected or Review required on your EPR Compliance page until the issue is resolved.",
  },
  {
    q: "Do I have other EPR obligations not listed here?",
    a: "This page and the EPR help center reflect obligations Camelune has identified based on your current catalogue and shipping destinations. If you expand into new EU countries or add new product categories, additional obligations may appear. You remain responsible for compliance with any EPR requirements not yet covered by Camelune, including voluntary schemes or categories outside PACK, BATT, and EEE.",
  },
];

export const PACKAGING_COUNTRIES: CountrySectionData[] = [
  {
    flag: "🇷🇴",
    country: "Romania",
    basedIn: {
      requirements: [
        [
          "Register as a packaging producer with ",
          { label: "ANPM", url: "https://www.anpm.ro" },
          " through a licensed ",
          { label: "OIREP collective scheme", url: "https://www.anpm.ro" },
          ".",
        ],
        [
          "Report packaging volumes placed on the Romanian market annually to your OIREP.",
        ],
        [
          "Pay eco-contributions based on the packaging materials and weights you place on the market.",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your ANPM / OIREP registration number",
        "Registration document — signed contract or certificate from your collective scheme",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "If you ship packaged goods to end consumers in Romania, you are considered a producer under Romanian law — even if your company is established elsewhere.",
        ],
        [
          "Register with ",
          { label: "ANPM", url: "https://www.anpm.ro" },
          " through a licensed OIREP before placing packaging on the Romanian market.",
        ],
        [
          "Submit annual packaging declarations and pay applicable eco-contributions.",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your ANPM / OIREP registration number",
        "Registration document — signed contract or certificate from your collective scheme",
      ],
    },
  },
  {
    flag: "🇩🇪",
    country: "Germany",
    basedIn: {
      requirements: [
        [
          "Register in the ",
          { label: "LUCID packaging register (ZSVR)", url: "https://www.verpackungsregister.org" },
          " before placing any packaged goods on the German market.",
        ],
        [
          "Obtain a packaging licence (Verpackungslizenz) from a licensed dual-system provider such as Der Grüne Punkt or Interzero.",
        ],
        [
          "Report packaging data to your dual-system provider and ZSVR as required.",
        ],
      ],
      cameluneRequires: [
        "LUCID registration number (format: DE + 11 digits)",
        "Packaging licence proof — executed agreement with your dual-system provider",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "Register in the ",
          { label: "LUCID packaging register (ZSVR)", url: "https://www.verpackungsregister.org" },
          " before any shipment of packaged goods to Germany.",
        ],
        [
          "Obtain a packaging licence from a licensed dual-system provider.",
        ],
        [
          "From August 2026 under PPWR, appoint an ",
          { label: "authorized representative", url: "https://www.verpackungsregister.org" },
          " in Germany if you are not established there (optional until then).",
        ],
      ],
      cameluneRequires: [
        "LUCID registration number",
        "Packaging licence proof",
        "Authorized representative name and proof of authorization (optional today, mandatory from August 2026)",
      ],
    },
  },
  {
    flag: "🇫🇷",
    country: "France",
    basedIn: {
      requirements: [
        [
          "Register with ",
          { label: "Citeo", url: "https://www.citeo.com" },
          " (ADEME-approved scheme) to obtain a UIN / IDU EMPAP for packaging placed on the French market.",
        ],
        [
          "Declare packaging placed on the market and pay eco-contributions to Citeo.",
        ],
        [
          "Comply with French packaging marking and sorting requirements (Triman logo where applicable).",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your UIN / IDU EMPAP",
        "Authorized representative details (optional today, mandatory from August 2026 for non-EU sellers)",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "Distance sellers shipping packaged goods to France must register with ",
          { label: "Citeo", url: "https://www.citeo.com" },
          " and obtain a UIN / IDU EMPAP.",
        ],
        [
          "Submit packaging declarations and pay eco-contributions based on volumes placed on the French market.",
        ],
        [
          "From August 2026, non-EU established sellers must appoint an authorized representative in France.",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your UIN / IDU EMPAP",
        "Authorized representative name and proof of authorization (optional today, mandatory from August 2026 for non-EU sellers)",
      ],
    },
  },
  {
    flag: "🇦🇹",
    country: "Austria",
    basedIn: {
      requirements: [
        [
          "Register with an approved packaging collection and recycling system — such as ",
          { label: "ARA", url: "https://www.ara.at" },
          ", Interzero, ERP Austria, or Reclay — before placing packaged goods on the Austrian market.",
        ],
        [
          "Obtain a 6-digit EPR packaging number issued by the ",
          { label: "Verpackungskoordinierungsstelle (VKS)", url: "https://www.vks.at" },
          ", Austria's national packaging coordination body.",
        ],
        [
          "Report packaging volumes placed on the market and pay eco-contributions to your chosen system as required.",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your 6-digit VKS packaging number",
        "Registration document — contract or confirmation from your approved collection system",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "If you ship packaged goods to Austrian consumers, you are treated as a packaging producer under Austrian law — even if your company is established elsewhere.",
        ],
        [
          "Register with an approved collection system and obtain your 6-digit VKS number before placing packaging on the Austrian market.",
        ],
        [
          "Appoint an ",
          { label: "authorized representative", url: "https://www.vks.at" },
          " in Austria — mandatory for companies not established in Austria.",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your 6-digit VKS packaging number",
        "Registration document — contract or confirmation from your approved collection system",
        "Authorized representative name and proof of authorization",
      ],
    },
  },
  {
    flag: "🇪🇸",
    country: "Spain",
    basedIn: {
      requirements: [
        [
          "Register through an approved packaging compliance scheme — such as ",
          { label: "Ecoembes", url: "https://www.ecoembes.com/en" },
          " or Procircular — for all packaging materials you place on the Spanish market.",
        ],
        [
          "Enrol in the ",
          { label: "Registro de Productores de Productos (RPP)", url: "https://www.miteco.gob.es" },
          ", Spain's national producer register for packaging.",
        ],
        [
          "Declare packaging volumes and pay eco-contributions to your compliance scheme as required.",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your RPP registration reference",
        "Registration document — confirmation from your approved compliance scheme",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "Distance sellers shipping packaged goods to Spain must register with an approved compliance scheme and enrol in the ",
          { label: "RPP", url: "https://www.miteco.gob.es" },
          " before placing packaging on the market.",
        ],
        [
          "Obtain a Spanish ",
          { label: "NIF (Número de Identificación Fiscal)", url: "https://www.agenciatributaria.es" },
          " for producer registration purposes.",
        ],
        [
          "Appoint an authorized representative in Spain — mandatory for companies not established in Spain.",
        ],
      ],
      cameluneRequires: [
        "EPR number (PACK) — your RPP registration reference",
        "Spanish NIF used for registration",
        "Registration document — confirmation from your approved compliance scheme",
        "Authorized representative name and proof of authorization",
      ],
    },
  },
];

export const PACKAGING_FAQ: FAQItem[] = [
  {
    id: "faq-packaging-per-country",
    q: "Does every shipment need a separate packaging registration?",
    a: "No — you register once per country and report volumes periodically. However, each destination country requires its own registration. A Romanian packaging registration does not cover Germany, France, Austria, or Spain.",
  },
  {
    id: "faq-what-counts-as-packaging",
    q: "What counts as packaging for EPR purposes?",
    a: "All materials used to contain, protect, handle, deliver or present goods — including shipping boxes and mailers, outer presentation packaging, product-level wrapping, bubble wrap, tape, and filling material. On Camelune, packaging obligations apply to all sellers who ship packaged goods to EU countries.",
  },
  {
    id: "faq-dual-system-germany",
    q: "What is a dual-system provider in Germany?",
    a: "A licensed organisation that collects and recycles packaging waste on behalf of producers. German law requires a contract with a dual-system (e.g. Der Grüne Punkt, Interzero) in addition to LUCID registration.",
  },
  {
    id: "faq-authorized-representative",
    q: "When do I need an authorized representative for packaging?",
    a: "Austria and Spain require an authorized representative for sellers not established in those countries today. For Germany and France, an authorized representative will become mandatory from August 2026 under PPWR. Camelune accepts optional representative details for Germany and France now so you can prepare in advance.",
  },
  {
    id: "faq-austria-vks-number",
    q: "What is the Austrian VKS packaging number?",
    a: "The Verpackungskoordinationsstelle (VKS) issues a 6-digit EPR packaging number to producers registered with an approved Austrian collection system. You need this number in addition to your contract with a scheme such as ARA, Interzero, ERP Austria, or Reclay.",
  },
  {
    id: "faq-spain-rpp-registration",
    q: "What is the Spanish RPP and when do I need a NIF?",
    a: "The Registro de Productores de Productos (RPP) is Spain's national register for packaging producers. Sellers based outside Spain typically need a Spanish NIF (tax identification number) to complete RPP enrolment, alongside registration with an approved scheme such as Ecoembes or Procircular.",
  },
];

export const BATTERIES_COUNTRIES: CountrySectionData[] = [
  {
    flag: "🇷🇴",
    country: "Romania",
    basedIn: {
      requirements: [
        [
          "Register as a battery producer with ",
          { label: "ANPM", url: "https://www.anpm.ro" },
          " for batteries placed on the Romanian market — including batteries installed in devices.",
        ],
        [
          "Join a licensed battery take-back scheme and report quantities placed on the market.",
        ],
        [
          "Comply with EU Battery Regulation (EU) 2023/1542 labelling and due diligence requirements.",
        ],
      ],
      cameluneRequires: [
        "EPR number (BATT) — your ANPM registration number",
        "Registration document — signed scheme membership or registration certificate",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "If you sell battery-powered products (quartz watches, smartwatches, accessories with integrated cells) to Romanian consumers, you must register with ",
          { label: "ANPM", url: "https://www.anpm.ro" },
          " regardless of where your company is established.",
        ],
        [
          "Report battery quantities and pay eco-contributions to your take-back scheme.",
        ],
      ],
      cameluneRequires: [
        "EPR number (BATT) — your ANPM registration number",
        "Registration document — signed scheme membership or registration certificate",
      ],
    },
  },
  {
    flag: "🇩🇪",
    country: "Germany",
    basedIn: {
      requirements: [
        [
          "Register with ",
          { label: "Stiftung EAR (BattG-Melderegister)", url: "https://www.stiftung-ear.de" },
          " for batteries placed on the German market.",
        ],
        [
          "Classify batteries by chemistry and application type in your registration.",
        ],
        [
          "Comply with EU Battery Regulation (EU) 2023/1542 requirements.",
        ],
      ],
      cameluneRequires: [
        "EPR number (BATT) — Stiftung EAR registration number",
        "Self-certification confirming compliance with Regulation (EU) 2023/1542",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "Register with ",
          { label: "Stiftung EAR", url: "https://www.stiftung-ear.de" },
          " before selling battery-powered products in Germany.",
        ],
        [
          "Appoint an authorized representative in Germany — mandatory for sellers not established in Germany.",
        ],
        [
          "Provide a signed authorization contract between you and your representative.",
        ],
        [
          "Self-certify that batteries offered comply with Regulation (EU) 2023/1542.",
        ],
      ],
      cameluneRequires: [
        "EPR number (BATT) — Stiftung EAR registration number",
        "Authorized representative name",
        "Authorization contract — signed mandate with your representative",
        "Self-certification confirming compliance with Regulation (EU) 2023/1542",
      ],
    },
  },
  {
    flag: "🇫🇷",
    country: "France",
    basedIn: {
      requirements: [
        [
          "Register with an approved producer organisation such as ",
          { label: "Screlec", url: "https://www.screlec.fr" },
          " (ADEME) for batteries placed on the French market.",
        ],
        [
          "Declare battery quantities and pay eco-contributions to your PRO.",
        ],
        [
          "Comply with EU Battery Regulation (EU) 2023/1542 labelling requirements.",
        ],
      ],
      cameluneRequires: [
        "EPR number (BATT) — registration number from your French PRO",
        "Self-certification confirming compliance with Regulation (EU) 2023/1542",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "Register with an approved French PRO (e.g. ",
          { label: "Screlec", url: "https://www.screlec.fr" },
          ") for batteries sold to French consumers.",
        ],
        [
          "Appoint an authorized representative in France — mandatory for sellers not established in France.",
        ],
        [
          "Provide a signed authorization contract with your representative.",
        ],
      ],
      cameluneRequires: [
        "EPR number (BATT) — registration number from your French PRO",
        "Authorized representative name",
        "Authorization contract — signed mandate with your representative",
        "Self-certification confirming compliance with Regulation (EU) 2023/1542",
      ],
    },
  },
];

export const BATTERIES_FAQ: FAQItem[] = [
  {
    q: "Do quartz watches require battery EPR registration?",
    a: "Yes. Batteries installed in devices — including quartz watches and smartwatches — trigger battery EPR obligations in each EU country where those products are sold. This is separate from any packaging or WEEE obligations.",
  },
  {
    q: "What is the Battery Regulation self-certification?",
    a: "For Germany and France, Camelune requires you to confirm that batteries you offer — including those built into devices — meet the requirements of EU Regulation 2023/1542. You may be asked to provide supporting evidence on request.",
  },
  {
    q: "Can one product trigger both battery and WEEE obligations?",
    a: "Yes. A smartwatch, for example, may require BATT registration (for its battery), EEE registration (as electronic equipment), and PACK registration (for its packaging) — each in every destination country where you sell.",
  },
  {
    q: "Do I need an authorized representative for batteries?",
    a: "In Germany and France, an authorized representative is mandatory for sellers not established in those countries. Romania does not currently require a separate representative for EU-established sellers.",
  },
];

export const WEEE_COUNTRIES: CountrySectionData[] = [
  {
    flag: "🇩🇪",
    country: "Germany",
    basedIn: {
      requirements: [
        [
          "Register electrical and electronic equipment with ",
          { label: "Stiftung EAR", url: "https://www.stiftung-ear.de" },
          " before placing products on the German market.",
        ],
        [
          "Select the correct WEEE equipment category for your products (e.g. small appliances, monitoring and control instruments).",
        ],
        [
          "Mark products with the crossed-out wheelie bin symbol where required.",
        ],
      ],
      cameluneRequires: [
        "EPR number (EEE) — Stiftung EAR WEEE registration number",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "Register with ",
          { label: "Stiftung EAR", url: "https://www.stiftung-ear.de" },
          " for electronic products sold to German consumers.",
        ],
        [
          "Appoint an authorized representative in Germany — mandatory for sellers not established in Germany.",
        ],
        [
          "Provide a signed authorization document with your representative.",
        ],
      ],
      cameluneRequires: [
        "EPR number (EEE) — Stiftung EAR WEEE registration number",
        "Authorized representative name",
        "Proof of authorization — signed mandate with your representative",
      ],
    },
  },
  {
    flag: "🇫🇷",
    country: "France",
    basedIn: {
      requirements: [
        [
          "Register with an approved PRO such as ",
          { label: "Ecosystem", url: "https://www.ecosystem.eco" },
          " to obtain a UIN for the Electrical Appliances category.",
        ],
        [
          "Declare quantities of electrical equipment placed on the French market.",
        ],
        [
          "Pay eco-contributions and comply with French WEEE marking requirements.",
        ],
      ],
      cameluneRequires: [
        "EPR number (EEE) — UIN for the Electrical Appliances category",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "Register with an approved French PRO (e.g. ",
          { label: "Ecosystem", url: "https://www.ecosystem.eco" },
          ") for electronic products sold in France.",
        ],
        [
          "Appoint an authorized representative in France — mandatory for sellers not established in France.",
        ],
        [
          "Provide a signed authorization contract with your representative.",
        ],
      ],
      cameluneRequires: [
        "EPR number (EEE) — UIN for the Electrical Appliances category",
        "Authorized representative name",
        "Authorization contract — signed mandate with your representative",
      ],
    },
  },
  {
    flag: "🇷🇴",
    country: "Romania",
    basedIn: {
      requirements: [
        [
          "WEEE registration with ",
          { label: "ANPM", url: "https://www.anpm.ro" },
          " may apply depending on the product categories you sell.",
        ],
        [
          "For watch sellers on Camelune, WEEE is currently not required for the product categories listed in Romania.",
        ],
        [
          "Monitor regulatory changes — obligations may expand as Romania implements updated EU WEEE directives.",
        ],
      ],
      cameluneRequires: [
        "No submission required at this time for watch and accessory categories in Romania",
      ],
    },
    basedOutside: {
      requirements: [
        [
          "If WEEE obligations apply to your product categories in Romania, register with ",
          { label: "ANPM", url: "https://www.anpm.ro" },
          " before placing electrical equipment on the Romanian market.",
        ],
        [
          "For current Camelune watch and accessory categories, WEEE registration is not required in Romania.",
        ],
      ],
      cameluneRequires: [
        "No submission required at this time for watch and accessory categories in Romania",
      ],
    },
  },
];

export const WEEE_FAQ: FAQItem[] = [
  {
    q: "What products are considered electrical equipment on Camelune?",
    a: "Electronic watches, smartwatches, watch winders, and related electronic accessories are classified as electrical and electronic equipment (EEE). Quartz watches without electronic components typically fall under battery obligations only.",
  },
  {
    q: "Is WEEE required in Romania for watch sellers?",
    a: "For the product categories currently listed on Camelune, WEEE registration is not required in Romania at this time. This may change as regulations evolve — check your Compliance Hub for updates.",
  },
  {
    q: "What is an authorized representative for WEEE?",
    a: "A legal entity established in the destination country that acts on your behalf for WEEE compliance. Germany and France require an authorized representative for sellers not established in those countries.",
  },
  {
    q: "How do I know which WEEE category my products fall into?",
    a: "Your registration PRO or authority will help classify products. On Camelune, electronic watches and winders typically fall under small appliances or monitoring and control instruments. Your obligation detail page will indicate the applicable category.",
  },
];
