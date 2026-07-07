import type { Dac7ReportRecord, ReportHistoryStatus } from "@/lib/dac7-data";

export type Dac7QuarterRow = {
  q: string;
  sales: number;
  fees: number;
  taxes: number;
  revenue: number;
};

export type Dac7ReportPdfContent = {
  year: string;
  status: string;
  submitted: string;
  reference: string;
  seller: {
    companyName: string;
    country: string;
    vatNumber: string;
    registrationNumber: string;
    taxpayerId: string;
  };
  quarters: Dac7QuarterRow[];
  totals: Dac7QuarterRow;
};

export function buildDac7ReportPdfContent(input: {
  year: string;
  status: string;
  submitted: string;
  reference: string;
  companyName: string;
  country: string;
  vatNumber: string;
  registrationNumber: string;
  taxpayerId: string;
  quarters: Dac7QuarterRow[];
  totals: Dac7QuarterRow;
}): Dac7ReportPdfContent {
  return {
    year: input.year,
    status: input.status,
    submitted: input.submitted,
    reference: input.reference,
    seller: {
      companyName: input.companyName,
      country: input.country,
      vatNumber: input.vatNumber,
      registrationNumber: input.registrationNumber,
      taxpayerId: input.taxpayerId,
    },
    quarters: input.quarters,
    totals: input.totals,
  };
}

export function hasSubmissionHistory(report: Dac7ReportRecord): boolean {
  return (report.submissionHistory?.length ?? 0) > 0;
}

export function reportBannerCopy(report: Dac7ReportRecord): {
  title: string;
  body: string;
} {
  const status: ReportHistoryStatus = report.status;

  if (status === "Correction pending") {
    return {
      title: "Correction pending",
      body: `A corrected report was submitted on ${report.correctionSubmitted ?? "—"}. Camelune is awaiting confirmation from the tax authority. Original reference: ${report.reference}.`,
    };
  }

  if (status === "Corrected") {
    return {
      title: "Corrected report submitted",
      body: `This report contains corrections to your original submission. Submitted on ${report.correctionSubmitted ?? report.submitted}. Reference: ${report.correctionReference ?? report.reference}.`,
    };
  }

  if (status === "Correction rejected") {
    return {
      title: "Correction rejected",
      body: `The tax authority rejected your correction submitted on ${report.correctionSubmitted ?? "—"}. Please review your information and contact support if needed.`,
    };
  }

  return {
    title: "Reported",
    body: `Submitted on ${report.submitted} · Reference ${report.reference}`,
  };
}
