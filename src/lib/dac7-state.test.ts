import { describe, expect, it } from "vitest";
import {
  canTransition,
  isExcludedByThreshold,
  isThresholdReached,
  nextStatus,
  sellerNextAction,
  sellerStatusLabel,
  thresholdExplain,
} from "@/lib/dac7-state";
import { dac7Store, profileComplete, profileMissingFields } from "@/lib/dac7-store";

describe("dac7 thresholds", () => {
  it("requires 30 sales OR over €2000", () => {
    expect(isThresholdReached(29, 2000)).toBe(false);
    expect(isThresholdReached(29, 2001)).toBe(true);
    expect(isThresholdReached(30, 0)).toBe(true);
    expect(isExcludedByThreshold(17, 1240)).toBe(true);
  });

  it("explains the decision", () => {
    expect(thresholdExplain(17, 1240)).toContain("Below threshold");
    expect(thresholdExplain(30, 100)).toContain("Reportable");
  });
});

describe("dac7 state machine", () => {
  it("allows seller submit from in progress", () => {
    expect(canTransition("IN_PROGRESS", "seller.submit")).toBe(true);
    expect(nextStatus("IN_PROGRESS", "seller.submit")).toBe("SUBMITTED");
  });

  it("rejects invalid transitions", () => {
    expect(canTransition("VERIFIED", "seller.submit")).toBe(false);
    expect(() => nextStatus("VERIFIED", "seller.submit")).toThrow(/INVALID_STATE/);
  });

  it("maps seller-friendly next actions", () => {
    expect(sellerNextAction("NOT_STARTED").action).toBe("start");
    expect(sellerNextAction("NEEDS_CORRECTION").action).toBe("fix_and_resubmit");
    expect(sellerStatusLabel("PAYMENT_RESTRICTED")).toBe("Payout on hold");
  });
});

describe("dac7 store flow", () => {
  it("runs seller submit → admin review → approve → excluded when below threshold", () => {
    dac7Store.reset();
    const id = "case-atelier";
    const c0 = dac7Store.getCase(id)!;
    expect(c0.status).toBe("IN_PROGRESS");

    dac7Store.acceptDeclaration(id, true);
    dac7Store.submitSeller(id);
    expect(dac7Store.getCase(id)!.status).toBe("SUBMITTED");

    dac7Store.adminStartReview(id);
    expect(dac7Store.getCase(id)!.status).toBe("UNDER_REVIEW");

    dac7Store.adminApprove(id);
    expect(dac7Store.getCase(id)!.status).toBe("EXCLUDED");
  });

  it("marks reportable sellers and supports finance submit", () => {
    dac7Store.reset();
    const id = "case-chrono";
    dac7Store.adminStartReview(id);
    dac7Store.adminApprove(id);
    expect(dac7Store.getCase(id)!.status).toBe("REPORTABLE");

    dac7Store.financeReadyForF7000(id);
    expect(dac7Store.getCase(id)!.status).toBe("READY_FOR_F7000");

    dac7Store.financeSubmitF7000(id);
    dac7Store.financeAcceptReceipt(id);
    const done = dac7Store.getCase(id)!;
    expect(done.status).toBe("REPORTED");
    expect(done.f7000Reference).toMatch(/^F7000-/);
    expect(done.receiptAcceptedAt).toBeTruthy();
  });

  it("detects incomplete profiles", () => {
    expect(profileComplete(dac7Store.getCase("case-paris")!.profile)).toBe(false);
    expect(profileMissingFields(dac7Store.getCase("case-paris")!.profile)).toContain(
      "Taxpayer ID",
    );
  });
});
