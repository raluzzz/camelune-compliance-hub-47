import { describe, expect, it } from "vitest";
import { getDac7ReportRecord } from "@/lib/dac7-data";
import {
  buildDac7ReportPdfContent,
  hasSubmissionHistory,
  reportBannerCopy,
} from "@/lib/dac7-report-display";
import { buildDac7ReportPdfBytes, toPdfSafeText } from "@/lib/dac7-pdf";

describe("dac7 report display", () => {
  it("shows correction pending banner for 2025", () => {
    const report = getDac7ReportRecord("2025");
    expect(report).toBeDefined();
    const banner = reportBannerCopy(report!);
    expect(banner.title).toBe("Correction pending");
    expect(banner.body).toContain("12 Mar 2026");
  });

  it("includes submission history for correction pending reports", () => {
    const report = getDac7ReportRecord("2025");
    expect(report).toBeDefined();
    expect(hasSubmissionHistory(report!)).toBe(true);
    expect(report!.submissionHistory).toHaveLength(2);
  });

  it("builds structured PDF content with seller and quarterly data", () => {
    const content = buildDac7ReportPdfContent({
      year: "2025",
      status: "Correction pending",
      submitted: "31 Jan 2026",
      reference: "DAC7-2025-00014",
      companyName: "Atelier Lune SRL",
      country: "Romania",
      vatNumber: "RO 42183901",
      registrationNumber: "J40/2185/2022",
      taxpayerId: "42183901",
      quarters: [
        { q: "Q1", sales: 12, fees: 240, taxes: 480, revenue: 4800 },
        { q: "Q2", sales: 18, fees: 360, taxes: 720, revenue: 7200 },
      ],
      totals: { q: "Total", sales: 30, fees: 600, taxes: 1200, revenue: 12000 },
    });

    expect(content.year).toBe("2025");
    expect(content.seller.companyName).toBe("Atelier Lune SRL");
    expect(content.quarters).toHaveLength(2);
    expect(content.totals.sales).toBe(30);
  });

  it("renders a PDF with table headers and seller fields", () => {
    const pdf = buildDac7ReportPdfBytes(
      buildDac7ReportPdfContent({
        year: "2025",
        status: "Correction pending",
        submitted: "31 Jan 2026",
        reference: "DAC7-2025-00014",
        companyName: "Atelier Lune SRL",
        country: "Romania",
        vatNumber: "RO 42183901",
        registrationNumber: "J40/2185/2022",
        taxpayerId: "42183901",
        quarters: [{ q: "Q1", sales: 12, fees: 240, taxes: 480, revenue: 4800 }],
        totals: { q: "Total", sales: 12, fees: 240, taxes: 480, revenue: 4800 },
      }),
    );
    const text = new TextDecoder().decode(pdf);
    expect(text).toContain("DAC7 Report - 2025");
    expect(text).toContain("Company information reported");
    expect(text).toContain("SALES COUNT");
    expect(text).toContain("Atelier Lune SRL");
  });
});

describe("dac7 pdf text", () => {
  it("replaces unsupported Unicode with ASCII equivalents", () => {
    expect(toPdfSafeText("DAC7 Report — 2025")).toBe("DAC7 Report - 2025");
    expect(toPdfSafeText("€1,500")).toBe("EUR 1,500");
  });
});
