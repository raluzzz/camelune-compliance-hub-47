export type EprStatus =
  | "missing"
  | "draft"
  | "submitted"
  | "under-review"
  | "approved"
  | "rejected"
  | "expiring-soon"
  | "not-required"
  | "review-required";

export const STATUS_LABEL: Record<EprStatus, string> = {
  missing: "Missing",
  draft: "Draft",
  submitted: "Submitted",
  "under-review": "Under review",
  approved: "Approved",
  rejected: "Rejected",
  "expiring-soon": "Expiring soon",
  "not-required": "Not required",
  "review-required": "Review required",
};

export type EprCategory = "packaging" | "batteries" | "weee" | "textiles";

export const CATEGORY_LABEL: Record<EprCategory, string> = {
  packaging: "Packaging",
  batteries: "Batteries",
  weee: "Electrical products / WEEE",
  textiles: "Textiles",
};

export type CountryCode = "RO" | "DE" | "FR";

export const COUNTRY_LABEL: Record<CountryCode, string> = {
  RO: "Romania",
  DE: "Germany",
  FR: "France",
};

export interface Obligation {
  id: string;
  category: EprCategory;
  country: CountryCode;
  status: EprStatus;
  dueLabel?: string;
  affectedProducts: number;
  authority: string;
  note?: string;
}

export const SELLER = {
  name: "Veronica Fox",
  email: "nykaqito@mailinator.com",
  company: "Atelier Lune SRL",
  baseCountry: "RO" as CountryCode,
  sellsTo: ["RO", "DE", "FR"] as CountryCode[],
  shippingModel: "Mixed — direct & Camelune-authenticated",
};

export const OBLIGATIONS: Obligation[] = [
  // Romania
  { id: "packaging-RO", category: "packaging", country: "RO", status: "approved", dueLabel: "Renews 31 Mar 2027", affectedProducts: 48, authority: "ANPM / OIREP", note: "EPR number on file. Annual declaration filed." },
  { id: "batteries-RO", category: "batteries", country: "RO", status: "approved", dueLabel: "Renews 31 Mar 2027", affectedProducts: 12, authority: "ANPM", note: "Covers quartz & smart watches." },
  { id: "weee-RO", category: "weee", country: "RO", status: "not-required", affectedProducts: 0, authority: "ANPM", note: "ANPM — not required for this category in Romania at this time." },
  { id: "textiles-RO", category: "textiles", country: "RO", status: "not-required", affectedProducts: 0, authority: "Reciclad'OR", note: "Reciclad'OR — voluntary scheme, not required in Romania at this time." },

  // Germany
  { id: "packaging-DE", category: "packaging", country: "DE", status: "missing", dueLabel: "Blocks DE sales", affectedProducts: 31, authority: "ZSVR / LUCID" },
  { id: "batteries-DE", category: "batteries", country: "DE", status: "review-required", dueLabel: "Action required", affectedProducts: 9, authority: "Stiftung EAR (BattG-Melderegister)", note: "Applies to quartz watch and smartwatch listings in your catalogue." },
  { id: "weee-DE", category: "weee", country: "DE", status: "submitted", dueLabel: "Filed 02 Jun 2026", affectedProducts: 4, authority: "Stiftung EAR", note: "Awaiting WEEE number assignment." },
  { id: "textiles-DE", category: "textiles", country: "DE", status: "expiring-soon", dueLabel: "Renew by 14 Aug 2026", affectedProducts: 18, authority: "ZSVR (voluntary register)", note: "Apparel & bag declarations expire in 8 weeks." },

  // France
  { id: "packaging-FR", category: "packaging", country: "FR", status: "approved", dueLabel: "Renews 31 Dec 2026", affectedProducts: 48, authority: "ADEME — Citeo", note: "UIN: FR234560_01ABCD." },
  { id: "batteries-FR", category: "batteries", country: "FR", status: "under-review", dueLabel: "Submitted 28 May 2026", affectedProducts: 9, authority: "ADEME — Screlec", note: "PRO contract under verification." },
  { id: "weee-FR", category: "weee", country: "FR", status: "rejected", dueLabel: "Resubmit required", affectedProducts: 4, authority: "ADEME — Ecosystem", note: "The authorized representative document was illegible. Please re-upload a clear, color PDF scan of the signed contract." },
  { id: "textiles-FR", category: "textiles", country: "FR", status: "approved", dueLabel: "Renews 31 Dec 2026", affectedProducts: 22, authority: "Refashion", note: "TLC category — apparel, shoes, bags." },
];

export type StatusGroup =
  | "needs-action"
  | "under-review"
  | "approved"
  | "expiring-soon"
  | "neutral";

export const STATUS_GROUP_LABEL: Record<StatusGroup, string> = {
  "needs-action": "Needs action",
  "under-review": "Under review",
  approved: "Approved",
  "expiring-soon": "Expiring soon",
  neutral: "Not required",
};

export function statusGroup(s: EprStatus): StatusGroup {
  switch (s) {
    case "missing":
    case "rejected":
    case "review-required":
      return "needs-action";
    case "submitted":
    case "under-review":
    case "draft":
      return "under-review";
    case "approved":
      return "approved";
    case "expiring-soon":
      return "expiring-soon";
    case "not-required":
      return "neutral";
  }
}

export function statusGroupToneClass(g: StatusGroup) {
  switch (g) {
    case "needs-action":
      return "bg-rose-50/70 text-rose-700";
    case "under-review":
      return "bg-slate-100/70 text-slate-600";
    case "approved":
      return "bg-emerald-50/70 text-emerald-700";
    case "expiring-soon":
      return "bg-amber-50/80 text-amber-800";
    case "neutral":
      return "bg-muted text-muted-foreground";
  }
}

export function statusToneClass(s: EprStatus) {
  return statusGroupToneClass(statusGroup(s));
}

/** Legacy internal key: `packaging-de` */
export function obligationSlug(o: { category: EprCategory; country: CountryCode }) {
  return `${o.category}-${o.country.toLowerCase()}`;
}

const COUNTRY_ROUTE_SLUG: Record<CountryCode, string> = {
  RO: "romania",
  DE: "germany",
  FR: "france",
};

const ROUTE_SLUG_TO_CODE: Record<string, CountryCode> = {
  romania: "RO",
  germany: "DE",
  france: "FR",
};

/** Public URL segment: `packaging-germany`, `batteries-romania`, etc. */
export function obligationRouteSlug(o: { category: EprCategory; country: CountryCode }) {
  return `${o.category}-${COUNTRY_ROUTE_SLUG[o.country]}`;
}

export function parseObligationRouteSlug(slug: string): string {
  const lower = slug.toLowerCase();
  for (const [name, code] of Object.entries(ROUTE_SLUG_TO_CODE)) {
    const suffix = `-${name}`;
    if (lower.endsWith(suffix)) {
      const category = lower.slice(0, -suffix.length);
      return `${category}-${code.toLowerCase()}`;
    }
  }
  return lower;
}

export type ObligationDetailDestination = {
  to: "/seller/compliance/epr/$slug";
  params: { slug: string };
};

/** Canonical detail route for an obligation (matrix, Fix now, country rows). */
export function obligationDetailLink(o: {
  category: EprCategory;
  country: CountryCode;
}): ObligationDetailDestination {
  return {
    to: "/seller/compliance/epr/$slug",
    params: { slug: obligationRouteSlug(o) },
  };
}

export function findObligationBySlug(slug: string): Obligation | undefined {
  const key = parseObligationRouteSlug(slug);
  return OBLIGATIONS.find(
    (o) => `${o.category}-${o.country.toLowerCase()}` === key,
  );
}

/* ============================================================
 * Per category × country field specifications and copy.
 * ============================================================ */

export interface DetailField {
  key: string;
  label: string;
  type: "text" | "file" | "checkbox";
  optional?: boolean;
  note?: string;
  defaultValue?: string;
  formatKey?: "lucid";
}

export interface DetailSpec {
  subtitle: string;
  authority: string;
  externalLink?: { label: string; url: string };
  whatYouNeed: { title: string; desc: string }[];
  fields: DetailField[];
}

export const DETAIL_SPECS: Record<string, DetailSpec> = {
  "packaging-ro": {
    subtitle:
      "Packaged goods sold in Romania require registration with ANPM through a licensed OIREP (collective scheme).",
    authority: "ANPM / OIREP",
    externalLink: { label: "ANPM packaging info", url: "https://www.anpm.ro" },
    whatYouNeed: [
      { title: "EPR number (PACK)", desc: "ANPM / OIREP registration number issued after joining a collective scheme." },
      { title: "Registration document", desc: "Signed contract or registration certificate from your OIREP." },
    ],
    fields: [
      { key: "epr", label: "EPR number (PACK)", type: "text" },
      { key: "doc", label: "Upload registration document", type: "file" },
    ],
  },
  "packaging-de": {
    subtitle:
      "Germany requires LUCID registration with ZSVR and a contract with a licensed dual-system before any packaged shipment.",
    authority: "ZSVR / LUCID",
    externalLink: { label: "ZSVR / LUCID portal", url: "https://www.verpackungsregister.org" },
    whatYouNeed: [
      { title: "LUCID registration number", desc: "Obtained from ZSVR. Typically issued within 2 working days." },
      { title: "Packaging licence proof", desc: "Executed agreement with a dual-system provider (Der Grüne Punkt, Interzero, etc.)." },
      { title: "Authorized representative", desc: "Optional today. Will be mandatory from August 2026 under PPWR for sellers not established in Germany." },
    ],
    fields: [
      { key: "epr", label: "LUCID registration number", type: "text", note: "Format: DE + 11 digits.", formatKey: "lucid" },
      { key: "doc", label: "Upload packaging licence proof", type: "file" },
      { key: "rep", label: "Authorized representative name", type: "text", optional: true, note: "Optional today, mandatory from August 2026." },
      { key: "repDoc", label: "Upload proof of authorization", type: "file", optional: true },
      { key: "confirm", label: "I confirm the information provided is complete and accurate.", type: "checkbox" },
    ],
  },
  "packaging-fr": {
    subtitle:
      "France requires a UIN / IDU EMPAP through Citeo for packaging placed on the French market.",
    authority: "ADEME — Citeo",
    externalLink: { label: "Citeo producer portal", url: "https://www.citeo.com" },
    whatYouNeed: [
      { title: "EPR number (PACK)", desc: "UIN / IDU EMPAP issued by ADEME / Citeo." },
      { title: "Authorized representative", desc: "Currently voluntary, mandatory from August 2026 for non-EU established sellers." },
    ],
    fields: [
      { key: "epr", label: "EPR number (PACK) — UIN/IDU EMPAP", type: "text" },
      { key: "rep", label: "Authorized representative name", type: "text", optional: true, note: "Voluntary today, mandatory from August 2026." },
      { key: "repDoc", label: "Upload proof of authorization", type: "file", optional: true },
      { key: "confirm", label: "I confirm the information provided is complete and accurate.", type: "checkbox" },
    ],
  },
  "batteries-ro": {
    subtitle:
      "Batteries (including those installed in devices) placed on the Romanian market require ANPM registration.",
    authority: "ANPM",
    whatYouNeed: [
      { title: "EPR number (BATT)", desc: "ANPM registration number." },
      { title: "Registration document", desc: "Signed scheme membership / registration certificate." },
    ],
    fields: [
      { key: "epr", label: "EPR number (BATT)", type: "text" },
      { key: "doc", label: "Upload registration document", type: "file" },
    ],
  },
  "batteries-de": {
    subtitle:
      "Germany requires registration with Stiftung EAR (BattG-Melderegister) and an authorized representative if the seller is not established in Germany.",
    authority: "Stiftung EAR (BattG-Melderegister)",
    externalLink: { label: "Stiftung EAR portal", url: "https://www.stiftung-ear.de" },
    whatYouNeed: [
      { title: "EPR number (BATT)", desc: "Registration number from Stiftung EAR." },
      { title: "Authorized representative", desc: "Required for sellers not established in Germany." },
      { title: "Authorization contract", desc: "Signed mandate between you and your authorized representative." },
    ],
    fields: [
      { key: "epr", label: "EPR number (BATT)", type: "text" },
      { key: "rep", label: "Authorized representative name", type: "text" },
      { key: "repDoc", label: "Upload authorization contract", type: "file" },
      { key: "selfCert", label: "I confirm I only offer batteries — including those installed in devices — that meet the requirements of Regulation (EU) 2023/1542 (Battery Regulation). At Camelune's request, I will provide all necessary evidence.", type: "checkbox" },
      { key: "confirm", label: "I confirm the information provided is complete and accurate.", type: "checkbox" },
    ],
  },
  "batteries-fr": {
    subtitle:
      "France requires registration with an approved producer organisation (e.g. Screlec) for batteries placed on the French market.",
    authority: "ADEME — Screlec",
    whatYouNeed: [
      { title: "EPR number (BATT)", desc: "Registration number from your French PRO." },
      { title: "Authorized representative", desc: "Required for sellers not established in France." },
      { title: "Authorization contract", desc: "Signed mandate with your authorized representative." },
    ],
    fields: [
      { key: "epr", label: "EPR number (BATT)", type: "text" },
      { key: "rep", label: "Authorized representative name", type: "text" },
      { key: "repDoc", label: "Upload authorization contract", type: "file" },
      { key: "selfCert", label: "I confirm I only offer batteries — including those installed in devices — that meet the requirements of Regulation (EU) 2023/1542 (Battery Regulation).", type: "checkbox" },
      { key: "confirm", label: "I confirm the information provided is complete and accurate.", type: "checkbox" },
    ],
  },
  "weee-de": {
    subtitle:
      "Electrical and electronic equipment placed on the German market requires registration with Stiftung EAR.",
    authority: "Stiftung EAR",
    externalLink: { label: "Stiftung EAR portal", url: "https://www.stiftung-ear.de" },
    whatYouNeed: [
      { title: "EPR number (EEE)", desc: "Stiftung EAR WEEE registration number." },
      { title: "Authorized representative", desc: "Required for sellers not established in Germany." },
      { title: "Authorization document", desc: "Signed mandate with your authorized representative." },
    ],
    fields: [
      { key: "epr", label: "EPR number (EEE)", type: "text" },
      { key: "rep", label: "Authorized representative name", type: "text" },
      { key: "repDoc", label: "Upload proof of authorization", type: "file" },
      { key: "confirm", label: "I confirm the information provided is complete and accurate.", type: "checkbox" },
    ],
  },
  "weee-fr": {
    subtitle:
      "Electrical and electronic equipment in France requires a UIN per category through an approved PRO (e.g. Ecosystem).",
    authority: "ADEME — Ecosystem",
    whatYouNeed: [
      { title: "EPR number (EEE)", desc: "UIN for the Electrical Appliances category." },
      { title: "Authorized representative", desc: "Required for sellers not established in France." },
      { title: "Authorization contract", desc: "Signed mandate with your authorized representative." },
    ],
    fields: [
      { key: "epr", label: "EPR number (EEE)", type: "text" },
      { key: "rep", label: "Authorized representative name", type: "text" },
      { key: "repDoc", label: "Upload authorization contract", type: "file" },
      { key: "confirm", label: "I confirm the information provided is complete and accurate.", type: "checkbox" },
    ],
  },
  "weee-ro": {
    subtitle:
      "WEEE is currently not required for the categories you list in Romania.",
    authority: "ANPM",
    whatYouNeed: [],
    fields: [],
  },
  "textiles-de": {
    subtitle:
      "Germany operates a voluntary textile take-back scheme via ZSVR. Sellers shipping textiles to DE can register voluntarily.",
    authority: "ZSVR (voluntary scheme)",
    whatYouNeed: [
      { title: "Registration number", desc: "ZSVR voluntary scheme registration number." },
      { title: "Registration document", desc: "Confirmation issued by ZSVR." },
      { title: "Renewal date", desc: "Annual renewal — Camelune will remind you 60 days before." },
    ],
    fields: [
      { key: "epr", label: "ZSVR registration number", type: "text" },
      { key: "doc", label: "Upload registration document", type: "file" },
      { key: "renewal", label: "Renewal date (DD/MM/YYYY)", type: "text" },
    ],
  },
  "textiles-fr": {
    subtitle:
      "France requires Refashion registration for textiles, household linen and footwear (TLC category).",
    authority: "Refashion",
    externalLink: { label: "Refashion portal", url: "https://refashion.fr" },
    whatYouNeed: [
      { title: "EPR number (Textiles)", desc: "Refashion registration number." },
      { title: "Registration document", desc: "Refashion membership certificate." },
    ],
    fields: [
      { key: "epr", label: "EPR number (Textiles)", type: "text" },
      { key: "doc", label: "Upload registration document", type: "file" },
    ],
  },
  "textiles-ro": {
    subtitle:
      "Textiles EPR is not currently mandatory in Romania for the categories you list.",
    authority: "Reciclad'OR",
    whatYouNeed: [],
    fields: [],
  },
};

/* DAC7 — sample seller activity for the current reporting period */
export const DAC7 = {
  reportingPeriod: 2026,
  salesCount: 17,
  salesThreshold: 30,
  revenue: 1240, // EUR
  revenueThreshold: 2000,
  sellerInformationComplete: true,
};
