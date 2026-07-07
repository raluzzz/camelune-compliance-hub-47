import { describe, expect, it } from "vitest";
import { buildComplianceActionItems } from "@/lib/compliance-actions";

describe("buildComplianceActionItems", () => {
  it("links each action item to its obligation detail slug", () => {
    const items = buildComplianceActionItems();
    expect(items).toHaveLength(3);

    const packagingDe = items.find((item) => item.title === "Packaging — Germany");
    expect(packagingDe?.params.slug).toBe("packaging-germany");
    expect(packagingDe?.cta).toBe("Complete");

    const batteriesDe = items.find((item) => item.title === "Batteries — Germany");
    expect(batteriesDe?.params.slug).toBe("batteries-germany");
    expect(batteriesDe?.cta).toBe("Review");

    const weeeFr = items.find((item) => item.title === "WEEE — France");
    expect(weeeFr?.params.slug).toBe("weee-france");
    expect(weeeFr?.cta).toBe("Fix");
  });
});
