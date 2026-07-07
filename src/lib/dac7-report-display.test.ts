import { describe, expect, it } from "vitest";
import { getDac7ReportRecord } from "@/lib/dac7-data";
import { hasSubmissionHistory, reportBannerCopy } from "@/lib/dac7-report-display";

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
});
