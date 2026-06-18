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
  { id: "ro-pack", category: "packaging", country: "RO", status: "approved", dueLabel: "Renews 31 Mar 2027", affectedProducts: 48, authority: "ANPM / OIREP", note: "EPR number on file. Annual declaration filed." },
  { id: "ro-batt", category: "batteries", country: "RO", status: "approved", dueLabel: "Renews 31 Mar 2027", affectedProducts: 12, authority: "ANPM", note: "Covers quartz & smart watches." },
  { id: "ro-weee", category: "weee", country: "RO", status: "not-required", affectedProducts: 0, authority: "ANPM", note: "No WEEE-classified items currently listed for RO." },
  { id: "ro-tex", category: "textiles", country: "RO", status: "draft", dueLabel: "Voluntary scheme", affectedProducts: 6, authority: "Reciclad'OR", note: "Draft saved 12 Jun 2026." },

  // Germany
  { id: "de-pack", category: "packaging", country: "DE", status: "missing", dueLabel: "Blocks DE sales", affectedProducts: 31, authority: "ZSVR / LUCID", note: "Required before any shipment enters Germany." },
  { id: "de-batt", category: "batteries", country: "DE", status: "review-required", dueLabel: "Action required", affectedProducts: 9, authority: "Stiftung EAR (BattG-Melderegister)", note: "Quartz & smartwatch listings need battery registration." },
  { id: "de-weee", category: "weee", country: "DE", status: "submitted", dueLabel: "Filed 02 Jun 2026", affectedProducts: 4, authority: "Stiftung EAR", note: "Awaiting WEEE number assignment." },
  { id: "de-tex", category: "textiles", country: "DE", status: "expiring-soon", dueLabel: "Renew by 14 Aug 2026", affectedProducts: 18, authority: "ZSVR (voluntary register)", note: "Apparel & bag declarations expire in 8 weeks." },

  // France
  { id: "fr-pack", category: "packaging", country: "FR", status: "approved", dueLabel: "Renews 31 Dec 2026", affectedProducts: 48, authority: "ADEME — Citeo", note: "UIN: FR234560_01ABCD." },
  { id: "fr-batt", category: "batteries", country: "FR", status: "under-review", dueLabel: "Submitted 28 May 2026", affectedProducts: 9, authority: "ADEME — Screlec", note: "PRO contract under verification." },
  { id: "fr-weee", category: "weee", country: "FR", status: "rejected", dueLabel: "Resubmit required", affectedProducts: 4, authority: "ADEME — Ecosystem", note: "Authorized representative document was illegible." },
  { id: "fr-tex", category: "textiles", country: "FR", status: "approved", dueLabel: "Renews 31 Dec 2026", affectedProducts: 22, authority: "Refashion", note: "TLC category — apparel, shoes, bags." },
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
