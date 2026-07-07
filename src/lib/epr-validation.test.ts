import { describe, expect, it } from "vitest";
import { validateLucidNumber } from "@/lib/epr-validation";

describe("validateLucidNumber", () => {
  it("accepts DE followed by 11 digits", () => {
    expect(validateLucidNumber("DE12345678901")).toBeNull();
  });

  it("rejects values that do not match LUCID format", () => {
    expect(validateLucidNumber("12345")).toMatch(/DE followed by 11 digits/);
    expect(validateLucidNumber("DE123")).toMatch(/DE followed by 11 digits/);
  });
});
