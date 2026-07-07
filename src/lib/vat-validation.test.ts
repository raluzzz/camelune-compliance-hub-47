import { describe, expect, it } from "vitest";
import { vatFormatError, verifyVatNumber } from "@/lib/vat-validation";

describe("vat validation", () => {
  it("rejects invalid VAT numbers", () => {
    expect(vatFormatError("Germany", "INVALID123")).toMatch(/Invalid format/);
    const result = verifyVatNumber("Germany", "INVALID123");
    expect(result.status).toBe("Invalid");
    expect(result.error).toBeTruthy();
  });

  it("does not auto-verify unknown but well-formed numbers", () => {
    const result = verifyVatNumber("Italy", "IT12345678901");
    expect(result.status).toBe("Pending verification");
    expect(result.error).toBeNull();
  });

  it("verifies known demo VAT numbers", () => {
    const result = verifyVatNumber("Germany", "DE312456789");
    expect(result.status).toBe("Verified");
  });
});
