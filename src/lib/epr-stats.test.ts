import { describe, expect, it } from "vitest";
import { computeEprCounters, tabObligations } from "@/lib/epr-stats";

describe("computeEprCounters", () => {
  it("matches the obligations visible in EPR tabs", () => {
    const listed = tabObligations();
    expect(listed).toHaveLength(8);

    const counters = computeEprCounters();
    expect(counters.identified).toBe(8);
    expect(counters["needs-action"]).toBe(2);
    expect(counters.rejected).toBe(1);
    expect(counters.submitted).toBe(2);
  });

  it("includes review-required obligations in needs-action", () => {
    const counters = computeEprCounters();
    expect(counters["needs-action"]).toBeGreaterThanOrEqual(2);
  });
});
