import { COUNTRY_LABEL, SELLER, type CountryCode } from "@/lib/epr-data";

export const DAC7_SUPPORT_URL = "https://www.camelune.com/help/contact";

const EXTRA_TAXPAYER_IDS_KEY = "dac7-extra-taxpayer-ids";

export type Dac7TaxpayerIdRow = {
  issuingCountry: string;
  taxpayerId: string;
  permanentEstablishment: string;
};

export const DAC7_TAXPAYER_COUNTRIES = ["Romania", "Germany", "France"] as const;

export function loadExtraTaxpayerIds(): Dac7TaxpayerIdRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXTRA_TAXPAYER_IDS_KEY);
    return raw ? (JSON.parse(raw) as Dac7TaxpayerIdRow[]) : [];
  } catch {
    return [];
  }
}

export function saveExtraTaxpayerId(row: Dac7TaxpayerIdRow): void {
  const next = [...loadExtraTaxpayerIds(), row];
  localStorage.setItem(EXTRA_TAXPAYER_IDS_KEY, JSON.stringify(next));
}

export function getDac7ReportRecord(year: string): Dac7ReportRecord | undefined {
  return DAC7_REPORT_HISTORY.find((r) => r.period === year);
}

export type Dac7SectionStatus = "Saved" | "Verified" | "Missing" | "Error";

export type ReportHistoryStatus =
  | "Not required yet"
  | "Not required"
  | "Reported"
  | "Correction pending"
  | "Corrected"
  | "Correction rejected";

export interface Dac7Section {
  id: string;
  title: string;
  status: Dac7SectionStatus;
  attentionMessage?: string;
}

export interface SubmissionHistoryEntry {
  kind: "Original report" | "Correction";
  date: string;
  reference: string;
}

export interface CorrectionEvent {
  date: string;
  label: string;
  detail: string;
}

export interface Dac7ReportRecord {
  period: string;
  status: ReportHistoryStatus;
  submitted: string;
  reference: string;
  action: string;
  correctionSubmitted?: string;
  correctionReference?: string;
  correctionHistory?: CorrectionEvent[];
  submissionHistory?: SubmissionHistoryEntry[];
}

export const DAC7_SELLER = {
  companyCountry: COUNTRY_LABEL[SELLER.baseCountry],
  companyCountryCode: SELLER.baseCountry,
  companyName: "Atelier Lune SRL",
  registeredAddress: "Str. Stelelor 12, Bucharest",
  legalRepresentative: "Veronica Fox",
  registrationNumber: "J40/2185/2022",
  taxpayerIssuingCountry: COUNTRY_LABEL[SELLER.baseCountry],
  taxpayerId: "42183901",
  permanentEstablishment: COUNTRY_LABEL[SELLER.baseCountry],
  vatNumber: "RO 42183901",
  bankAccountHolder: "Atelier Lune SRL",
  bankIban: "RO •••• •••• •••• 4421",
  bankCurrency: "EUR",
};

export function getDefaultTaxpayerRow(): Dac7TaxpayerIdRow {
  return {
    issuingCountry: DAC7_SELLER.taxpayerIssuingCountry,
    taxpayerId: DAC7_SELLER.taxpayerId,
    permanentEstablishment: formatPermanentEstablishment(DAC7_SELLER.permanentEstablishment),
  };
}

export const DAC7_SECTIONS: Dac7Section[] = [
  { id: "company", title: "A. Company information", status: "Saved" },
  { id: "registration", title: "B. Commercial registration number", status: "Saved" },
  {
    id: "taxpayer",
    title: "C. Taxpayer ID / CUI",
    status: taxpayerSectionStatus(DAC7_SELLER.taxpayerId, DAC7_SELLER.taxpayerIssuingCountry),
    attentionMessage: taxpayerAttentionMessage(
      DAC7_SELLER.taxpayerId,
      DAC7_SELLER.taxpayerIssuingCountry,
    ),
  },
  { id: "vat", title: "D. VAT ID number", status: "Verified" },
  { id: "bank", title: "E. Bank account for payouts", status: "Verified" },
];

export const DAC7_REPORT_HISTORY: Dac7ReportRecord[] = [
  {
    period: "2026",
    status: "Not required yet",
    submitted: "—",
    reference: "—",
    action: "View details",
  },
  {
    period: "2025",
    status: "Correction pending",
    submitted: "31 Jan 2026",
    reference: "DAC7-2025-00014",
    action: "View report",
    correctionSubmitted: "12 Mar 2026",
    correctionReference: "DAC7-2025-00014-C1",
    submissionHistory: [
      {
        kind: "Original report",
        date: "31 Jan 2026",
        reference: "DAC7-2025-00014",
      },
      {
        kind: "Correction",
        date: "12 Mar 2026",
        reference: "DAC7-2025-00014-C1",
      },
    ],
    correctionHistory: [
      {
        date: "31 Jan 2026",
        label: "Original submission",
        detail: "Report filed with tax authority",
      },
      {
        date: "12 Mar 2026",
        label: "Correction submitted",
        detail: "Awaiting authority confirmation",
      },
    ],
  },
  {
    period: "2024",
    status: "Corrected",
    submitted: "31 Jan 2025",
    reference: "DAC7-2024-00027",
    action: "View report",
    correctionSubmitted: "15 Apr 2025",
    correctionReference: "DAC7-2024-00027-C1",
    submissionHistory: [
      {
        kind: "Original report",
        date: "31 Jan 2025",
        reference: "DAC7-2024-00027",
      },
      {
        kind: "Correction",
        date: "15 Apr 2025",
        reference: "DAC7-2024-00027-C1",
      },
    ],
    correctionHistory: [
      {
        date: "31 Jan 2025",
        label: "Original submission",
        detail: "Report filed with tax authority",
      },
      {
        date: "15 Apr 2025",
        label: "Correction submitted",
        detail: "Taxpayer ID updated and resubmitted",
      },
      {
        date: "22 Apr 2025",
        label: "Correction accepted",
        detail: "Authority confirmed corrected report",
      },
    ],
  },
];

export function validateTaxpayerId(issuingCountry: string, taxpayerId: string): boolean {
  const id = taxpayerId.trim();
  if (!id) return false;
  if (issuingCountry === "Romania") return /^\d{2,10}$/.test(id);
  return id.length >= 2;
}

export function taxpayerFieldLabel(issuingCountry: string): string {
  return issuingCountry === "Romania" ? "Taxpayer ID (CUI)" : "Taxpayer ID number";
}

export function taxpayerSectionTitle(issuingCountry: string): string {
  return issuingCountry === "Romania"
    ? "Your taxpayer ID / CUI"
    : "Your taxpayer ID number";
}

export function formatPermanentEstablishment(country: string): string {
  return country ? `Yes — ${country}` : "No";
}

export function reportingDeadlineSubtitle(
  statusKind: "not-required" | "approaching" | "required" | "reported",
  reportingPeriod: number,
): string {
  if (statusKind === "reported" || statusKind === "required") {
    return `Reporting deadline: January 31, ${reportingPeriod + 1}`;
  }
  return "Camelune will notify you before the January 31 deadline if reporting becomes required.";
}

function taxpayerSectionStatus(taxpayerId: string, issuingCountry: string): Dac7SectionStatus {
  if (!taxpayerId.trim()) return "Missing";
  return validateTaxpayerId(issuingCountry, taxpayerId) ? "Saved" : "Error";
}

function taxpayerAttentionMessage(taxpayerId: string, issuingCountry: string): string | undefined {
  if (!taxpayerId.trim()) return "Taxpayer ID is missing";
  if (!validateTaxpayerId(issuingCountry, taxpayerId)) {
    return "Taxpayer ID format is invalid";
  }
  return undefined;
}

export function dac7SectionsNeedingAttention(sections: Dac7Section[]): string[] {
  return sections
    .filter((s) => s.status === "Missing" || s.status === "Error")
    .map((s) => s.attentionMessage ?? `${s.title} needs attention`);
}

export function getSectionDescriptions(countryCode: CountryCode): {
  registration: string;
  taxpayer: string;
} {
  if (countryCode === "RO") {
    return {
      registration:
        "If your company is a legal entity, please enter your commercial registration number (Numărul de înregistrare la registrul comerțului — ONRC). Otherwise, you can skip this step.",
      taxpayer:
        "Please enter at least one tax identification number linked to your company — CUI (Codul unic de identificare fiscală). If you have tax IDs in other EU countries, add those too.",
    };
  }
  if (countryCode === "DE") {
    return {
      registration:
        "If your company is a legal entity, please enter your Handelsregisternummer. Otherwise, you can skip this step.",
      taxpayer:
        "Please enter your Steuernummer or W-IdNr. linked to your company. If you have tax IDs in other EU countries, add those too.",
    };
  }
  if (countryCode === "FR") {
    return {
      registration:
        "If your company is a legal entity, please enter your numéro SIRET ou SIREN. Otherwise, you can skip this step.",
      taxpayer:
        "Please enter the tax identification number linked to your company. If you have tax IDs in other EU countries, add those too.",
    };
  }
  return {
    registration:
      "If your company is a legal entity, please enter your commercial registration number. Otherwise, you can skip this step.",
    taxpayer:
      "Please enter at least one tax identification number linked to your company. If you have tax IDs in other EU countries, add those too.",
  };
}

export function dac7MissingSectionLetters(sections: Dac7Section[]): string {
  return sections
    .filter((s) => s.status === "Missing" || s.status === "Error")
    .map((s) => s.title.charAt(0))
    .join(", ");
}

export function dac7InformationComplete(sections: Dac7Section[]): boolean {
  return sections.every((s) => s.status === "Saved" || s.status === "Verified");
}
