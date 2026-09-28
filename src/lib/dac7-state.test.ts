import { describe, expect, it, beforeEach } from "vitest";
import {
  DAC7_REMINDER_1_DAYS,
  DAC7_REMINDER_2_DAYS,
  DAC7_RESTRICTION_MIN_DAYS,
  canTransition,
  hasTransactions,
  isThresholdReached,
  nextStatus,
  sellerNextAction,
} from "@/lib/dac7-state";
import { runComplianceSchedule } from "@/lib/dac7-notifications";
import {
  dac7Store,
  profileComplete,
  setComplianceClock,
} from "@/lib/dac7-store";

describe("dac7 production thresholds", () => {
  it("requires transactions for diligence", () => {
    expect(hasTransactions(0, 0)).toBe(false);
    expect(hasTransactions(1, 0)).toBe(true);
  });

  it("uses ANAF goods threshold", () => {
    expect(isThresholdReached(29, 2000)).toBe(false);
    expect(isThresholdReached(30, 0)).toBe(true);
  });
});

describe("dac7 diligence email calendar", () => {
  const baseCase = {
    id: "c1",
    sellerId: "s1",
    sellerName: "Test Seller",
    sellerEmail: "seller@example.com",
    status: "IN_PROGRESS" as const,
    salesCount: 5,
    revenueEur: 400,
    reportingYear: 2026,
    reminderStage: "none" as const,
    payoutHeld: false,
    accountSuspended: false,
  };

  it("sends initial request only when seller has transactions", () => {
    const now = new Date("2026-03-01T12:00:00.000Z");
    const noTx = runComplianceSchedule([{ ...baseCase, salesCount: 0, revenueEur: 0 }], [], now);
    expect(noTx.emails).toHaveLength(0);

    const withTx = runComplianceSchedule([baseCase], [], now);
    expect(withTx.emails.map((e) => e.templateId)).toEqual(["dac7_initial_request"]);
    expect(withTx.casePatches[0].informationRequestedAt).toBe(now.toISOString());
    expect(withTx.alerts.some((a) => a.audience === "seller")).toBe(true);
    expect(withTx.alerts.some((a) => a.audience === "admin")).toBe(true);
  });

  it("sends reminder 1 at day 14 and reminder 2 at day 30", () => {
    const start = new Date("2026-01-01T12:00:00.000Z");
    const day14 = new Date(start);
    day14.setUTCDate(day14.getUTCDate() + DAC7_REMINDER_1_DAYS);
    const r1 = runComplianceSchedule(
      [
        {
          ...baseCase,
          informationRequestedAt: start.toISOString(),
          reminderStage: "initial_sent",
        },
      ],
      [
        {
          id: "m0",
          templateId: "dac7_initial_request",
          caseId: "c1",
          sellerId: "s1",
          to: "seller@example.com",
          subject: "x",
          body: "y",
          channel: "email",
          scheduledFor: start.toISOString(),
          sentAt: start.toISOString(),
          status: "sent",
          inApp: true,
          createdAt: start.toISOString(),
        },
      ],
      day14,
    );
    expect(r1.emails.map((e) => e.templateId)).toContain("dac7_reminder_1");

    const day30 = new Date(start);
    day30.setUTCDate(day30.getUTCDate() + DAC7_REMINDER_2_DAYS);
    const r2 = runComplianceSchedule(
      [
        {
          ...baseCase,
          informationRequestedAt: start.toISOString(),
          reminderStage: "reminder_1_sent",
          reminder1SentAt: day14.toISOString(),
        },
      ],
      [
        {
          id: "m0",
          templateId: "dac7_initial_request",
          caseId: "c1",
          sellerId: "s1",
          to: "seller@example.com",
          subject: "x",
          body: "y",
          channel: "email",
          scheduledFor: start.toISOString(),
          sentAt: start.toISOString(),
          status: "sent",
          inApp: true,
          createdAt: start.toISOString(),
        },
        {
          id: "m1",
          templateId: "dac7_reminder_1",
          caseId: "c1",
          sellerId: "s1",
          to: "seller@example.com",
          subject: "x",
          body: "y",
          channel: "email",
          scheduledFor: day14.toISOString(),
          sentAt: day14.toISOString(),
          status: "sent",
          inApp: true,
          createdAt: day14.toISOString(),
        },
      ],
      day30,
    );
    expect(r2.emails.map((e) => e.templateId)).toContain("dac7_reminder_2");
    expect(r2.casePatches[0].status).toBe("OVERDUE");
  });

  it("auto-suspends account at day >= 60 with transactions", () => {
    const start = new Date("2026-01-01T12:00:00.000Z");
    const day60 = new Date(start);
    day60.setUTCDate(day60.getUTCDate() + DAC7_RESTRICTION_MIN_DAYS);
    const result = runComplianceSchedule(
      [
        {
          ...baseCase,
          status: "OVERDUE",
          informationRequestedAt: start.toISOString(),
          reminderStage: "reminder_2_sent",
          reminder1SentAt: new Date(start.getTime() + 14 * 86400000).toISOString(),
          reminder2SentAt: new Date(start.getTime() + 30 * 86400000).toISOString(),
        },
      ],
      [],
      day60,
    );
    expect(result.casePatches[0].status).toBe("ACCOUNT_RESTRICTED");
    expect(result.casePatches[0].accountSuspended).toBe(true);
    expect(result.casePatches[0].payoutHeld).toBe(true);
    expect(result.emails.map((e) => e.templateId)).toContain("dac7_account_suspended");
  });

  it("does not auto-suspend before day 60", () => {
    const start = new Date("2026-01-01T12:00:00.000Z");
    const day59 = new Date(start);
    day59.setUTCDate(day59.getUTCDate() + DAC7_RESTRICTION_MIN_DAYS - 1);
    const result = runComplianceSchedule(
      [
        {
          ...baseCase,
          status: "OVERDUE",
          informationRequestedAt: start.toISOString(),
          reminderStage: "reminder_2_sent",
          reminder1SentAt: start.toISOString(),
          reminder2SentAt: start.toISOString(),
        },
      ],
      [],
      day59,
    );
    expect(result.emails.some((e) => e.templateId === "dac7_account_suspended")).toBe(false);
    expect(result.casePatches.some((p) => p.accountSuspended)).toBe(false);
  });
});

describe("dac7 store end-to-end", () => {
  beforeEach(() => {
    setComplianceClock(null);
    dac7Store.reset();
  });

  it("runs seller submit → admin review → approve", () => {
    const id = "case-atelier";
    dac7Store.acceptDeclaration(id, true);
    dac7Store.submitSeller(id);
    expect(dac7Store.getCase(id)!.status).toBe("SUBMITTED");
    dac7Store.adminStartReview(id);
    dac7Store.adminApprove(id);
    expect(["EXCLUDED", "REPORTABLE"]).toContain(dac7Store.getCase(id)!.status);
  });

  it("auto-suspends Late Goods seed after compliance jobs", () => {
    dac7Store.processComplianceJobs();
    const late = dac7Store.getCase("case-late")!;
    expect(late.accountSuspended).toBe(true);
    expect(late.status).toBe("ACCOUNT_RESTRICTED");
    expect(sellerNextAction(late.status).action).toBe("contact_support");
    expect(
      dac7Store.getSnapshot().emails.some((e) => e.templateId === "dac7_account_suspended"),
    ).toBe(true);
  });

  it("rejects invalid transitions", () => {
    expect(canTransition("VERIFIED", "seller.submit")).toBe(false);
    expect(() => nextStatus("VERIFIED", "seller.submit")).toThrow(/INVALID_STATE/);
  });

  it("detects incomplete profiles", () => {
    expect(profileComplete(dac7Store.getCase("case-paris")!.profile)).toBe(false);
  });
});
